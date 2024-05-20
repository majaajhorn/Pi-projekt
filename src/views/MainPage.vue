<template>
    <div class="main-container">
      <h1>What would you like to cook today?</h1>
      <div class="buttons-container">
        <button id="novi_recept" @click="goToNewRecipe">Create new recipe</button>
        <search-button></search-button>
      </div>
      <hr>
    </div>
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
  
  /* Stil za SearchButton komponentu možete dodati ovde */
  </style>
  