<template>
    <div class="new-recipe">
      <h2>New Recipe</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="title" required>
        </div>
        <div class="form-group">
          <label for="ingredients">Ingredients:</label>
          <textarea id="ingredients" v-model="ingredients" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label for="courses">Courses:</label>
          <select id="courses" v-model="courses" required>
            <option value="">Select a course</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
            <option value="side dish">Side Dish</option>
          </select>
        </div>
        <div class="form-group">
          <label for="prep-time">Prep Time (minutes):</label>
          <input type="number" id="prep-time" v-model="prepTime" required>
        </div>
        <div class="form-group">
          <label for="cooking-time">Cooking Time (minutes):</label>
          <input type="number" id="cooking-time" v-model="cookingTime" required>
        </div>
        <div class="form-group">
          <label for="methods">Methods:</label>
          <textarea id="methods" v-model="methods" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label for="image">Image:</label>
          <input type="file" id="image" @change="handleImageUpload" accept="image/*" required>
        </div>
        <button type="submit">Create Recipe</button>
        <button type="button" @click="resetForm">Reset</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NewRecipe',
    data() {
      return {
        title: '',
        ingredients: '',
        courses: '',
        prepTime: 0,
        cookingTime: 0,
        methods: '',
        image: null
      };
    },
    methods: {
      submitForm() {
        // Ovdje dodajte logiku za slanje forme na server ili spremanje u bazu podataka
        console.log('Form submitted:', this.title, this.ingredients, this.courses, this.prepTime, this.cookingTime, this.methods, this.image);
      },
      handleImageUpload(event) {
        this.image = event.target.files[0];
      },
      resetForm() {
        this.title = '';
        this.ingredients = '';
        this.courses = '';
        this.prepTime = 0;
        this.cookingTime = 0;
        this.methods = '';
        this.image = null;
      }
    }
  };
  </script>
  
  <style scoped>
  .new-recipe {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input[type="text"],
  textarea,
  select,
  input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  