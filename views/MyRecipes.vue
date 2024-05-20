<template>
    <div class="my-recipes">
      <h2>My Recipes</h2>
      <div v-if="loading">Loading recipes...</div>
      <div v-else-if="recipes.length === 0">No recipes found.</div>
      <div v-else>
        <ul>
          <li v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
            <h3>{{ recipe.title }}</h3>
            <p><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
            <p><strong>Course:</strong> {{ recipe.courses }}</p>
            <p><strong>Prep Time:</strong> {{ recipe.prepTime }} minutes</p>
            <p><strong>Cooking Time:</strong> {{ recipe.cookingTime }} minutes</p>
            <p><strong>Methods:</strong> {{ recipe.methods }}</p>
            <button @click="editRecipe(recipe)">Edit</button>
            <button @click="deleteRecipe(recipe.id)">Delete</button>
          </li>
        </ul>
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
        this.recipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteRecipe(recipeId) {
      try {
        await deleteDoc(doc(db, 'users', this.currentUser.uid, 'recepti', recipeId));
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe.');
      }
    },
    editRecipe(recipe) {
      this.$router.push({ name: 'EditRecipe', params: { recipe } });
    }
  },
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
  </style>
  