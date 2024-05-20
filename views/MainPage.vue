<template>
    <div class="main-container">
      <h1>What would you like to cook today?</h1>
      <div class="buttons-container">
        <button id="novi_recept" @click="goToNewRecipe">Create new recipe</button>
        <search-button></search-button>
      </div>
      <hr>
    </div>

    
    <nav class="navbar">
    <router-link to="/user" class="nav-item">
      <i class="fas fa-user"></i>
    </router-link>
    <router-link to="/recipes" class="nav-item">
      <i class="fas fa-utensils"></i>
    </router-link>
    <router-link to="/" class="nav-item">
      <i class="fas fa-home"></i>
    </router-link>
    <router-link to="/favorites" class="nav-item">
      <i class="fas fa-heart"></i>
    </router-link>
    <button @click="logout" class="nav-item">
      <i class="fas fa-sign-out-alt"></i>
    </button>
  </nav>

  </template>
  
  <script>
  import SearchButton from '../components/SearchButton.vue';

  
  export default {
    name: 'MainPage',
    components: {
      SearchButton
    },
    methods: {
        goToNewRecipe() {
            this.$router.push({
                path: '/NewRecipe'
            })
        }
    }
  };

  </script>
  
  <style>
  .main-container {
    text-align: center; /* Centriranje sadržaja */
  }
  
  .buttons-container {
    display: flex;
    flex-direction: column; /* Stavljanje dugmadi jedno iznad drugog */
    align-items: center; /* Centriranje dugmadi */
    margin-top: 20px; /* Margina iznad dugmadi */
  }
  
  #novi_recept {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.1);
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
  
  
  /* Stil za SearchButton komponentu možete dodati ovde */
  </style>
  