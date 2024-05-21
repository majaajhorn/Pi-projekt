<template>
    <div class="recipe-details" v-if="!loading">
      <h2>{{ recipe.title }}</h2>
      <div class="recipe-image-container">
        <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
      </div>
      <p><strong>Ingredients:</strong></p>
      <p>{{ recipe.ingredients }}</p>
      <p><strong>Courses:</strong> {{ recipe.courses }}</p>
      <p><strong>Prep Time:</strong> {{ recipe.prepTime }} minutes</p>
      <p><strong>Cooking Time:</strong> {{ recipe.cookingTime }} minutes</p>
      <p><strong>Methods:</strong></p>
      <p>{{ recipe.methods }}</p>
    </div>
    <div v-else>Loading...</div>

    <nav class="navbar">
    <router-link to="/user" class="nav-item">
      <i class="fas fa-user"></i>
    </router-link>
    <router-link to="/MyRecipes" class="nav-item">
      <i class="fas fa-utensils"></i>
    </router-link>
    <router-link to="/mainPage" class="nav-item">
      <i class="fas fa-home"></i>
    </router-link>
    <router-link to="/favorites" class="nav-item">
      <i class="fas fa-heart"></i>
    </router-link>
    <button @click="logout" class="nav-item logout">
      <i class="fa-solid fa-arrow-right-to-bracket"></i>
    </button>
  </nav>

  </template>
  
  <script>
  import { db } from '@/Firebase/firebase';
  import { doc, getDoc } from 'firebase/firestore';
  
  export default {
    name: 'RecipeDetails',
    data() {
      return {
        recipe: {},
        loading: true,
      };
    },
    async created() {
      await this.fetchRecipeDetails();
    },
    methods: {
      async fetchRecipeDetails() {
        try {
          const recipeId = this.$route.params.id;
          const recipeDoc = await getDoc(doc(db, 'users', this.$store.state.currentUser.uid, 'recepti', recipeId));
          if (recipeDoc.exists()) {
            this.recipe = recipeDoc.data();
          } else {
            console.error('No such recipe!');
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Recipe Details Styles */
  .recipe-details {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 100px; /* Adjusted for navbar height */
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }
  
  .recipe-details h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }
  
  .recipe-image-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .recipe-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .recipe-details p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .recipe-details p strong {
    color: #333;
  }
  
  /* Navbar Styles */
  .navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #C7F9CC; /* Restored previous background color */
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    z-index: 999;
  }
  
  .nav-item {
    color: #333;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .nav-item i {
    font-size: 24px;
  }
  
  .nav-item.logout:hover {
    color: #c00; /* Change hover color for logout icon */
  }
  </style>
  
  
  