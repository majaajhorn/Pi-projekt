<template>
    <div>
      <h1>All Recipes</h1>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe">
          <router-link :to="{ name: 'RecipeDetails', params: { userId: recipe.userId, id: recipe.id } }">
            <h2>{{ recipe.title }}</h2>
          </router-link>
          <p>{{ recipe.description }}</p>
          <p><strong>Created by:</strong> {{ recipe.userEmail }}</p>
          <!-- Add more fields as needed -->
        </div>
      </div>
      <Navbar />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import Navbar from '../components/Navbar.vue';
  
  export default {
    name: 'AllRecipes',
    components: {
    Navbar
  },
    setup() {
      const recipes = ref([]);
      const loading = ref(true);
  
      const fetchRecipes = async () => {
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
  
        const allRecipes = [];
  
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userEmail = userDoc.data().email;
          const receptiCollection = collection(db, `users/${userId}/recepti`);
          const receptiSnapshot = await getDocs(receptiCollection);
  
          receptiSnapshot.forEach(doc => {
            allRecipes.push({ userId, userEmail, id: doc.id, ...doc.data() });
          });
        }
  
        recipes.value = allRecipes;
        loading.value = false;
      };
  
      onMounted(() => {
        fetchRecipes();
      });
  
      return {
        recipes,
        loading
      };
    }
  };
  </script>
  
  <style scoped>
  .recipe {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px 0;
  }
  </style>