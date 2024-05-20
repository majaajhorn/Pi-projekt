<template>
    <div class="search-button-container">
      <button class="search-button">
        <i class="fas fa-search"></i>
        Search
        <i class="fas fa-filter"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchButton'
  };
  </script>
  
  <style scoped>
  @import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
  .search-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust as needed */
  }
  
  .search-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #4CAF50; /* Change to your preferred color */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .search-button i {
    margin: 0 10px;
  }
  
  .search-button:hover {
    background-color: #45a049; /* Change to your preferred hover color */
  }
  </style>
  