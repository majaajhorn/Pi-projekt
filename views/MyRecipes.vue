<template>
  <div class="my-recipes">
    <h2>My Recipes</h2>
    <div v-if="loading">Loading recipes...</div>
    <div v-else-if="recipes.length === 0">No recipes found.</div>
    <div v-else>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
          <h3>{{ recipe.title }}</h3>
          <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
          <p><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
          <p><strong>Course:</strong> {{ recipe.courses }}</p>
          <p><strong>Prep Time:</strong> {{ recipe.prepTime }} minutes</p>
          <p><strong>Cooking Time:</strong> {{ recipe.cookingTime }} minutes</p>
          <p><strong>Methods:</strong> {{ recipe.methods }}</p>
          <button @click="editRecipe(recipe)">Edit</button>
          <button @click="confirmDelete(recipe.id)">Delete</button>
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
          <button type="submit">Save Changes</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/Firebase/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  name: 'MyRecipes',
  data() {
    return {
      recipes: [],
      loading: true,
      recipeToDelete: null,
      recipeBeingEdited: null, // Holds the recipe currently being edited
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
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
    }
  }
};
</script>

<style scoped>
.my-recipes {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.recipe-item {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.recipe-item h3 {
  margin-top: 0;
}

.recipe-item p {
  margin: 5px 0;
}

.recipe-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.edit-recipe {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 10px;
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
  box-sizing: border-box;
}
</style>
