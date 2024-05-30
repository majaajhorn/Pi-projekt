<template>
  <div class="main-container">
    <h1>What would you like to cook today?</h1>
    <div class="buttons-container">
      <button id="novi_recept" @click="goToNewRecipe">Create new recipe</button>
      <search-button></search-button>
    </div>
    <!-- Include Navbar component -->
    <Navbar />
  </div>
</template>

<script>
import { auth } from '@/Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SearchButton from '../components/SearchButton.vue';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'MainPage',
  components: {
    SearchButton,
    Navbar
  },
  data() {
    return {
      currentUser: null
    };
  },
  methods: {
    goToNewRecipe() {
      this.$router.push({
        path: '/NewRecipe'
      });
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-bottom: 60px; /* Ensure there's space for the fixed navbar */
  padding-top: 20px; /* Add padding to top for spacing */
  text-align: center;
}

h1 {
  margin-bottom: 20px; /* Add margin below the header */
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Allow the buttons container to take up remaining space */
}

#novi_recept {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px; /* Ensure consistent button width */
  margin-bottom: 10px; /* Add margin between buttons */
}

#novi_recept:hover {
  background-color: #45a049;
}

.nav-item {
  color: #333333;
  font-size: 20px;
}

.nav-item i {
  cursor: pointer;
}

.nav-item:hover {
  color: #007bff;
}
</style>
