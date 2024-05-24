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
            <button @click="makeFavorite(recipe)" class="recipe-button"><i class="fas fa-heart"></i></button>
          </div>
        </li>
      </ul>
      <div v-if="recipeBeingEdited" class="edit-recipe">
        <h2>Edit Recipe</h2>
        <form @submit.prevent="saveRecipe">
          <!-- Form content -->
          <button type="submit" class="recipe-button">Save Changes</button>
          <button type="button" @click="cancelEdit" class="recipe-button">Cancel</button>
        </form>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
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
      recipeBeingEdited: null,
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  async created() {
    await this.fetchRecipes();
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
.my-recipes {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px
  ;
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
</style>