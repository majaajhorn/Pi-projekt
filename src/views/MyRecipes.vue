<template>
  <div class="my-recipes">
    <h2>My Recipes</h2>
    <div v-if="loading">Loading recipes...</div>
    <div v-else-if="recipes.length === 0">No recipes found.</div>
    <div v-else>
      <ul class="recipe-list">
        <li v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
          <div class="recipe-image-container">
            <router-link :to="{ name: 'RecipeDetails', params: { id: recipe.id } }" class="no-decoration">
              <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
              <h3>{{ recipe.title }}</h3>
            </router-link>
          </div>
          <div class="button-container">
            <button @click="editRecipe(recipe)" class="recipe-button"><i class="fas fa-edit"></i></button>
            <button @click="confirmDelete(recipe.id)" class="recipe-button"><i class="fas fa-trash-alt"></i></button>
          </div>
        </li>
      </ul>
      <div v-if="recipeBeingEdited" class="edit-recipe">
        <h2>Edit Recipe</h2>
        <form @submit.prevent="saveRecipe">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="recipeBeingEdited.title" required>
          </div>
          <div class="form-group">
            <label for="ingredients">Ingredients:</label>
            <textarea id="ingredients" v-model="recipeBeingEdited.ingredients" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="courses">Courses:</label>
            <select id="courses" v-model="recipeBeingEdited.courses" required>
              <option value="">Select a course</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
              <option value="side dish">Side Dish</option>
            </select>
          </div>
          <div class="form-group">
            <label for="prep-time">Prep Time (minutes):</label>
            <input type="number" id="prep-time" v-model="recipeBeingEdited.prepTime" required>
          </div>
          <div class="form-group">
            <label for="cooking-time">Cooking Time (minutes):</label>
            <input type="number" id="cooking-time" v-model="recipeBeingEdited.cookingTime" required>
          </div>
          <div class="form-group">
            <label for="methods">Methods:</label>
            <textarea id="methods" v-model="recipeBeingEdited.methods" rows="4" required></textarea>
          </div>
          <button type="submit" class="recipe-button">Save Changes</button>
          <button type="button" @click="cancelEdit" class="recipe-button">Cancel</button>
        </form>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'; // Adjust the path as per your project structure
import { db } from '@/Firebase/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { mapState } from 'vuex';

export default {
  name: 'MyRecipes',
  components: {
    Navbar
  },
  data() {
    return {
      recipes: [],
      loading: true,
      recipeToDelete: null,
      recipeBeingEdited: null, // Holds the recipe currently being edited
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  async created() {
    await this.fetchRecipes();
  },
  methods: {
    stayOnPage() {
      // Optionally, you can add some logic here if needed
      // For now, do nothing to stay on the same page
    },

    async fetchRecipes() {
      try {
        if (!this.currentUser) {
          console.error('No user logged in.');
          this.loading = false;
          return;
        }

        const recipesSnapshot = await getDocs(collection(db, 'users', this.currentUser.uid, 'recepti'));
        this.recipes = recipesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            ingredients: data.ingredients,
            courses: data.courses,
            prepTime: data.prepTime,
            cookingTime: data.cookingTime,
            methods: data.methods,
            imageUrl: data.imageUrl || null
          };
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(recipeId) {
      this.recipeToDelete = recipeId;
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.deleteRecipe();
      } else {
        this.recipeToDelete = null;
      }
    },
    async deleteRecipe() {
      try {
        await deleteDoc(doc(db, 'users', this.currentUser.uid, 'recepti', this.recipeToDelete));
        this.recipes = this.recipes.filter(recipe => recipe.id !== this.recipeToDelete);
        this.recipeToDelete = null;
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe.');
      }
    },
    editRecipe(recipe) {
      this.recipeBeingEdited = { ...recipe };
    },
    async saveRecipe() {
      try {
        const recipeRef = doc(db, 'users', this.currentUser.uid, 'recepti', this.recipeBeingEdited.id);
        await updateDoc(recipeRef, {
          title: this.recipeBeingEdited.title,
          ingredients: this.recipeBeingEdited.ingredients,
          courses: this.recipeBeingEdited.courses,
          prepTime: this.recipeBeingEdited.prepTime,
          cookingTime: this.recipeBeingEdited.cookingTime,
          methods: this.recipeBeingEdited.methods,
        });

        alert('Recipe updated successfully!');
        this.recipeBeingEdited = null;
        await this.fetchRecipes(); // Refresh the list of recipes
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
      }
    },
    cancelEdit() {
      this.recipeBeingEdited = null;
    },
    viewRecipeDetails(recipeId) {
      this.$router.push({ name: 'RecipeDetails', params: { id: recipeId } });
    },
    logout() {
      // Your logout logic here
    }
  }
};
</script>

<style scoped>
.my-recipes {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px; /* Add padding to the bottom */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding-left: 0;
}

.recipe-item {
  width: calc(33.33% - 20px); /* Adjust width for responsiveness */
  margin-bottom: 20px;
  background-color: #C7F9CC;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center text */
}

.recipe-image-container {
  width: 150px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center; /* Center image horizontally */
}

.recipe-image {
  width: 100%;
  border-radius: 5px;
}

.recipe-details {
  text-align: center;
}

.recipe-details h3 {
  font-size: 1.2em;
  margin: 0;
}

.button-container {
  margin-top: auto; /* Push buttons to the bottom */
  display: flex;
  justify-content: center; /* Center buttons horizontally */
}

.button-container button {
  margin-right: 5px;
}

button {
  padding: 8px 12px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #C7F9CC; /* Change background color here */
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px; /* Rounded corners for the navbar */
  border-top-right-radius: 20px; /* Rounded corners for the navbar */
}

.nav-item {
  color: #333333;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-item i {
  cursor: pointer;
  font-size: 24px; /* Adjust icon size */
  padding-bottom: 5px; /* Adjust padding between icon and text */
}

/* Override color for logout icon */
.nav-item.logout i {
  color: #333333 !important;
}

/* Set background color of logout button to transparent */
.nav-item.logout {
  background-color: transparent !important;
}

/* Prevent color change on hover for logout button */
.nav-item.logout:hover {
  color: #333333 !important;
}

/* Remove underline from links */
.no-decoration {
  text-decoration: none;
}

.edit-recipe {
  max-width: 400px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.edit-recipe h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
}

.form-group select {
  appearance: none;
  -webkit-appearance: none;
  padding: 8px 30px 8px 8px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position-x: calc(100% - 10px);
  background-position-y: 50%;
}

.form-group button {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}

.form-group button:hover {
  background-color: #0056b3;
}
</style>
