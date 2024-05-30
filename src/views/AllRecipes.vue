<template>
  <div>
    <h1>All recipes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else class="recipe-container">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe">
        <router-link :to="{ name: 'RecipeDetails', params: { userId: recipe.userId, id: recipe.id } }" class="recipe-link">
          <h2>{{ recipe.title }}</h2>
        </router-link>
        <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl"/>
        <p>{{ recipe.description }}</p>
        <p><strong>Created by:</strong> {{ recipe.userEmail }}</p>
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
div h1 {
  text-align: center;
}

.recipe-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center items horizontally */
}

.recipe {
  width: 50%;
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px 8px; /* Adjust margin */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
}

.recipe-image {
  width: 150px; /* Set a fixed width */
  height: 150px; /* Set a fixed height */
  object-fit: cover; /* Ensure the image covers the container */
  border-radius: 5px;
  margin: 10px 0; /* Add some margin to separate the image from the text */
}

.recipe-link {
  color: black; /* Set title color to black */
  text-decoration: none;
}
</style>
