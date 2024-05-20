<template>
  <div class="new-recipe">
    <div class="title-container">
      <i class="fas fa-arrow-left" @click="goToMainPage"></i>
      <h2>New Recipe</h2>
    </div>
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
      <button type="button" @click="goToMyRecipes">My Recipes</button>
    </form>
  </div>
</template>

<script>
import { db, auth, storage } from '@/Firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
      image: null,
    };
  },
  methods: {
    async submitForm() {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('No user logged in.');
          return;
        }

        let imageUrl = '';
        if (this.image) {
          const storageRef = ref(storage, `recipes/${currentUser.uid}/${this.image.name}`);
          await uploadBytes(storageRef, this.image);
          imageUrl = await getDownloadURL(storageRef);
        }

        await addDoc(collection(db, 'users', currentUser.uid, 'recepti'), {
          title: this.title,
          ingredients: this.ingredients,
          courses: this.courses,
          prepTime: this.prepTime,
          cookingTime: this.cookingTime,
          methods: this.methods,
          imageUrl: imageUrl
        });

        alert('Recipe created successfully!');
        this.resetForm();
      } catch (error) {
        console.error('Error creating recipe:', error);
        alert('An error occurred while creating the recipe.');
      }
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
    },
    goToMainPage() {
      this.$router.push('/MainPage');
    },
    goToMyRecipes() {
      this.$router.push('/MyRecipes');
    }
  },
};
</script>
  
  <style scoped>
  .new-recipe {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .title-container {
    display: flex;
    align-items: center; /* Centriranje vertikalno */
  }
  
  .title-container i {
    margin-right: 10px; /* Razmak između ikone i naslova */
  }
  
  h2 {
    margin: 0; /* Uklanja podrazumijevani margin */
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
  