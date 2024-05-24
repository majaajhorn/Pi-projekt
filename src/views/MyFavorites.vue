<template>
    <div class="my-favorites">
      <h2>My Favorite Recipes</h2>
      <div v-if="loading">Loading favorite recipes...</div>
      <div v-else-if="favoriteRecipes.length === 0">No favorite recipes found.</div>
      <div v-else>
        <ul class="recipe-list">
          <li v-for="recipe in favoriteRecipes" :key="recipe.id" class="recipe-item">
            <div class="recipe-image-container">
              <router-link :to="{ name: 'RecipeDetails', params: { id: recipe.id } }" class="no-decoration">
                <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
                <h3>{{ recipe.title }}</h3>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
      <Navbar />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import { db } from '@/Firebase/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { mapState } from 'vuex';
  
  export default {
    name: 'MyFavorites',
    components: {
      Navbar
    },
    data() {
      return {
        favoriteRecipes: [],
        loading: true
      };
    },
    computed: {
      ...mapState(['currentUser']),
    },
    async created() {
      await this.fetchFavoriteRecipes();
    },
    methods: {
      async fetchFavoriteRecipes() {
        try {
          if (!this.currentUser) {
            console.error('No user logged in.');
            this.loading = false;
            return;
          }
  
          const favoritesSnapshot = await getDocs(collection(db, 'users', this.currentUser.uid, 'favorites'));
          this.favoriteRecipes = favoritesSnapshot.docs.map(doc => {
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
          console.error('Error fetching favorite recipes:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .my-favorites {
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
  </style>
  