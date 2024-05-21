<template>
  <div class="edit-recipe">
    <h2>Edit Recipe</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="recipe.title" required>
      </div>
      <div class="form-group">
        <label for="ingredients">Ingredients:</label>
        <textarea id="ingredients" v-model="recipe.ingredients" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="courses">Courses:</label>
        <select id="courses" v-model="recipe.courses" required>
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
        <input type="number" id="prep-time" v-model="recipe.prepTime" required>
      </div>
      <div class="form-group">
        <label for="cooking-time">Cooking Time (minutes):</label>
        <input type="number" id="cooking-time" v-model="recipe.cookingTime" required>
      </div>
      <div class="form-group">
        <label for="methods">Methods:</label>
        <textarea id="methods" v-model="recipe.methods" rows="4" required></textarea>
      </div>
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<script>
import { db } from '@/Firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  name: 'EditRecipe',
  data() {
    return {
      recipe: {
        title: '',
        ingredients: '',
        courses: '',
        prepTime: 0,
        cookingTime: 0,
        methods: '',
      },
    };
  },
  created() {
  if (this.$route.params.recipe) {
    this.recipe = this.$route.params.recipe;
  } else {
    // Handle case where route params are not available
    console.error('Recipe data not found in route parameters.');
  }
},

  methods: {
    async submitForm() {
      try {
        const recipeRef = doc(db, 'users', this.$store.state.currentUser.uid, 'recepti', this.recipe.id);
        await updateDoc(recipeRef, {
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          courses: this.recipe.courses,
          prepTime: this.recipe.prepTime,
          cookingTime: this.recipe.cookingTime,
          methods: this.recipe.methods,
        });

        alert('Recipe updated successfully!');
        this.$router.push('/MyRecipes');
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
      }
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
