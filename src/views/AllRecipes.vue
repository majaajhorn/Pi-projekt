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
        <p v-if="recipe.averageRating !== null"><strong>Average Rating:</strong> {{ recipe.averageRating.toFixed(2) }}</p>
        <p v-else><strong>Average Rating:</strong> No ratings yet</p>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore';
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

        for (const recipeDoc of receptiSnapshot.docs) {
          const recipeData = recipeDoc.data();
          const recipeId = recipeDoc.id;
          const reviewsCollection = collection(db, `users/${userId}/recepti/${recipeId}/reviews`);
          const reviewsSnapshot = await getDocs(reviewsCollection);

          let totalRating = 0;
          let numberOfReviews = 0;

          reviewsSnapshot.forEach(reviewDoc => {
            const reviewData = reviewDoc.data();
            const rating = Number(reviewData.rating); // Convert rating to number
            console.log(`Review Rating: ${rating}`); // Log the rating for debugging
            totalRating += rating;
            numberOfReviews++;
          });

          const averageRating = numberOfReviews > 0 ? totalRating / numberOfReviews : null;
          console.log(`Recipe ID: ${recipeId}, Total Rating: ${totalRating}, Number of Reviews: ${numberOfReviews}, Average Rating: ${averageRating}`); // Log the average rating for debugging

          allRecipes.push({
            userId,
            userEmail,
            id: recipeId,
            averageRating,
            ...recipeData
          });
        }
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