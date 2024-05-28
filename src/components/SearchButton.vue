<template>
  <div class="search-container">
    <div class="search-input-container">
      <input v-model="searchTerm" @keydown.enter="applyFilters" placeholder="Search recipes..." />
      <button @click="toggleFilter" class="filter-button">
        <i class="fas fa-filter"></i>
      </button>
    </div>
    <div v-if="showFilterPanel" class="filter-panel">
      <input v-model="filterByIngredients" @input="pretrazi" placeholder="Filter by ingredients..." />
      <input v-model="filterByCourses" @input="pretrazi" placeholder="Filter by courses..." />
      <button @click="applyFilters">Apply Filters</button>
      <button @click="resetFilters">Reset Filters</button>
    </div>
    <div v-if="loading" class="loading">Loading recipes...</div>
    <ul v-if="!loading && filteredRecipes.length > 0" class="recipe-list">
      <li v-for="recipe in filteredRecipes" :key="recipe.id" class="recipe-item">
        <router-link :to="{ name: 'RecipeDetails', params: { userId: recipe.userId, id: recipe.id } }">
          {{ recipe.title }}
        </router-link>
      </li>
    </ul>
    <div v-if="!loading && filteredRecipes.length === 0" class="no-recipes">No recipes found.</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'SearchButton',
  setup() {
    const searchTerm = ref('');
    const recipes = ref([]);
    const filteredRecipes = ref([]);
    const loading = ref(true);
    const showFilterPanel = ref(false); // Flag to toggle filter panel visibility
    const filterByIngredients = ref('');
    const filterByCourses = ref('');

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
/*
    const filterRecipes = () => {
      let filtered = recipes.value;

      // Apply filter by ingredients
      if (filterByIngredients.value) {
        const filterIngredient = filterByIngredients.value.toLowerCase();
        filtered = filtered.filter(recipe =>
          recipe.ingredients.toLowerCase().includes(filterIngredient)
        );
      }

      // Apply filter by courses
      if (filterByCourses.value) {
        const filterCourse = filterByCourses.value.toLowerCase();
        filtered = filtered.filter(recipe =>
          recipe.courses.toLowerCase().includes(filterCourse)
        );
      }

      // Apply search term filter
      if (searchTerm.value) {
        const searchTermLower = searchTerm.value.toLowerCase();
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTermLower)
        );
      }

      filteredRecipes.value = filtered;
    };
*/
const filterRecipes = () => {
  let filtered = recipes.value;

  // Check if any filtering conditions are present
  if (!filterByIngredients.value && !filterByCourses.value && !searchTerm.value) {
    // No filtering conditions, display "No recipes found"
    filteredRecipes.value = [];
    return;
  }

  // Apply filter by ingredients
  if (filterByIngredients.value) {
    const filterIngredient = filterByIngredients.value.toLowerCase();
    filtered = filtered.filter(recipe =>
      recipe.ingredients.toLowerCase().includes(filterIngredient)
    );
  }

  // Apply filter by courses
  if (filterByCourses.value) {
    const filterCourse = filterByCourses.value.toLowerCase();
    filtered = filtered.filter(recipe =>
      recipe.courses.toLowerCase().includes(filterCourse)
    );
  }

  // Apply search term filter
  if (searchTerm.value) {
    const searchTermLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTermLower)
    );
  }

  // Set the filtered recipes
  filteredRecipes.value = filtered;

  // Check if any recipes are found after filtering
  if (filtered.length === 0) {
    // No recipes found, display "No recipes found"
    filteredRecipes.value = [];
  }
};
    const pretrazi = async () => {
      if (loading.value) {
        await fetchRecipes();
      }
      
      filterRecipes();
    };

    const applyFilters = () => {
      filterRecipes();
    };

    const resetFilters = () => {
      searchTerm.value = '';
      filterByIngredients.value = '';
      filterByCourses.value = '';
      filterRecipes();
    };

    const toggleFilter = () => {
      showFilterPanel.value = !showFilterPanel.value;
    };

    fetchRecipes(); // Initial fetch

    return {
      searchTerm,
      filterByIngredients,
      filterByCourses,
      filteredRecipes,
      loading,
      toggleFilter,
      showFilterPanel,
      applyFilters,
      resetFilters
    };
  }
};
</script>

<style scoped>
@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.search-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.search-input-container input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 200px;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button i {
  margin: 0;
}

.filter-button:hover {
  background-color: #f0f0f0;
}

.filter-panel {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.filter-panel input {
  margin-right: 10px;
  margin-bottom: 10px;
}

.filter-panel button {
  margin-right: 10px;
}

.loading,
.no-recipes {
  margin-top: 20px;
  font-size: 18px;
  color: #666;
}

.recipe-list {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
}

.recipe-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
