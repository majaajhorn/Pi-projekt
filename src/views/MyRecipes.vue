<template>
  <div class="my-recipes">
    <h2>My Recipes</h2>
    <div v-if="loading">Loading recipes...</div>
    <div v-else-if="recipes.length === 0">No recipes found.</div>
    <div v-else>
      <ul class="recipe-list">
        <li v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
          <div class="recipe-image-container">
            <router-link :to="{ name: 'RecipeDetails', params: { userId: recipe.userId, id: recipe.id } }" class="no-decoration">
              <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
              <h3>{{ recipe.title }}</h3>
            </router-link>
          </div>
          <div class="button-container">
            <button @click="editRecipe(recipe)" class="recipe-button"><i class="fas fa-edit"></i></button>
            <button @click="confirmDelete(recipe.id)" class="recipe-button"><i class="fas fa-trash-alt"></i></button>
            <button @click="makeFavorite(recipe)" class="recipe-button"><i class="fas fa-heart"></i></button>
          </div>
        </li>
      </ul>
      <div v-if="recipeBeingEdited" class="edit-recipe">
        <h2>Edit Recipe</h2>
        <form @submit.prevent="saveRecipe">
          <!-- Form content -->
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
          <div class="form-group">
            <label for="image">Recipe Image:</label>
            <input type="file" id="image" @change="onFileChange" accept="image/*">
          </div>
          <button type="submit" class="recipe-button save-button">Save Changes</button>
          <button type="button" @click="cancelEdit" class="recipe-button cancel-button">Cancel</button>
        </form>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import { db } from '@/Firebase/firebase';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { mapState } from 'vuex';

export default {
  name: 'MyRecipes',
  components: {
    Navbar
  },
  data() {
    return {
      recipes: [], // recipes : []
      loading: true,
      recipeToDelete: null,
      recipeBeingEdited: null,
      newImageFile: null,
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  async created() {
    await this.fetchRecipes();
  },
  methods: {
    /*
    async fetchRecipes() {
      try {
        if (!this.currentUser) {
          console.error('No user logged in.');
          this.loading = false;
          return;
        }
        const userId = userDoc.id;
        const recipesSnapshot = await getDocs(collection(db, 'users', userId, 'recepti'));
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
            imageUrl: data.imageUrl || null,
            isFavorite: data.isFavorite || false
          };
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    */
    async  fetchRecipes() {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    const userId = currentUser.uid;
    const userEmail = currentUser.email;
    const receptiCollection = collection(db, `users/${userId}/recepti`);
    const receptiSnapshot = await getDocs(receptiCollection);

    const userRecipes = receptiSnapshot.docs.map(doc => ({
      userId,
      userEmail,
      id: doc.id,
      ...doc.data()
    }));

    this.recipes = userRecipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
  } finally {
    this.loading = false;
  }
},
    async confirmDelete(recipeId) {
      this.recipeToDelete = recipeId;
      if (confirm('Are you sure you want to delete this recipe?')) {
        await this.deleteRecipe();
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
      this.newImageFile = null; // Reset the new image file
    },
    async saveRecipe() {
      try {
        console.log('Recipe being saved:', this.recipeBeingEdited);

        let imageUrl = this.recipeBeingEdited.imageUrl;

        if (this.newImageFile) {
          // Upload the new image to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `recipe-images/${this.currentUser.uid}/${this.newImageFile.name}`);
          await uploadBytes(storageRef, this.newImageFile);

          // Get the download URL of the uploaded image
          imageUrl = await getDownloadURL(storageRef);
        }

        const recipeRef = doc(db, 'users', this.currentUser.uid, 'recepti', this.recipeBeingEdited.id);
        await updateDoc(recipeRef, {
          title: this.recipeBeingEdited.title,
          ingredients: this.recipeBeingEdited.ingredients,
          courses: this.recipeBeingEdited.courses,
          prepTime: this.recipeBeingEdited.prepTime,
          cookingTime: this.recipeBeingEdited.cookingTime,
          methods: this.recipeBeingEdited.methods,
          imageUrl: imageUrl
        });

        alert('Recipe updated successfully!');
        this.recipeBeingEdited = null;
        await this.fetchRecipes();
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
      }
    },
    cancelEdit() {
      this.recipeBeingEdited = null;
    },
    async makeFavorite(recipe) {
      try {
        const recipeRef = doc(db, 'users', this.currentUser.uid, 'recepti', recipe.id);
        await updateDoc(recipeRef, { isFavorite: !recipe.isFavorite });
        recipe.isFavorite = !recipe.isFavorite;
      } catch (error) {
        console.error('Error updating favorite status:', error);
        alert('An error occurred while updating the recipe.');
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newImageFile = file;
      }
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

.no-decoration {
  text-decoration: none;
  color: inherit;
}

.button-container {
  margin-top: auto; /* Push buttons to the bottom */
  display: flex;
  justify-content: center; /* Center buttons horizontally */
}

.recipe-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 10px;
}

.recipe-button .fa-trash-alt {
  color: black; /* Black color for delete button */
}

.recipe-button .fa-heart {
  color: black; /* Red color for heart button */
}

.recipe-button:hover .fa-trash-alt {
  color: black; /* Ensure delete button stays black on hover */
}

.recipe-button:hover .fa-heart {
  color: darkred; /* Darker red on hover */
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

.form-group button {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  border-radius: 20px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition */
}

.form-group button:hover {
  background-color: #0056b3;
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

.save-button {
  background-color: #007BFF; 
  border-radius: 5px;
  padding: 10px 20px;
  margin-right: 7em;
}

.cancel-button {
  background-color: #dc3545; /* Red */
  border-radius: 5px;
  padding: 10px 20px;
}

.no-decoration {
  text-decoration: none;
  color: black;
}

.no-decoration:hover {
  text-decoration: none;
}
</style>
