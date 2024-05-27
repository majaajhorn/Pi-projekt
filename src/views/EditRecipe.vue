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
      <div class="form-group">
        <label for="image">Image URL:</label>
        <input type="url" id="image" v-model="recipe.imageUrl">
      </div>
      <div class="form-group">
        <label for="new-image">Upload New Image:</label>
        <input type="file" id="new-image" @change="handleImageUpload" accept="image/*">
      </div>
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: 'EditRecipe',
  data() {
    return {
      recipe: {
        id: '',
        title: '',
        ingredients: '',
        courses: '',
        prepTime: 0,
        cookingTime: 0,
        methods: '',
        imageUrl: '', // Using URL directly
      },
      newImage: null,
    };
  },
  created() {
    if (this.$route.params.recipe) {
      this.recipe = this.$route.params.recipe;
    } else {
      console.error('Recipe data not found in route parameters.');
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newImage = file; // Store the selected file
      }
    },
    async submitForm() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          console.error('No user logged in.');
          return;
        }

        let imageUrl = this.recipe.imageUrl;
        if (this.newImage) {
          // Upload the new image to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `recipe-images/${user.uid}/${this.newImage.name}`);
          await uploadBytes(storageRef, this.newImage);

          // Get the download URL of the uploaded image
          imageUrl = await getDownloadURL(storageRef);
        }

        // Update recipe data in Firestore
        const recipeRef = doc(getFirestore(), 'users', user.uid, 'recepti', this.recipe.id);
        await updateDoc(recipeRef, {
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          courses: this.recipe.courses,
          prepTime: this.recipe.prepTime,
          cookingTime: this.recipe.cookingTime,
          methods: this.recipe.methods,
          imageUrl: imageUrl, // Save the image URL directly
        });

        alert('Recipe updated successfully!');
        this.$router.push('/MyRecipes');
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
      }
    },
  },
};
</script>

<style scoped>
.edit-recipe {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.edit-recipe h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
}

.form-group button {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.form-group button:hover {
  background-color: #0056b3;
}

.form-group select {
  appearance: none;
  -webkit-appearance: none;
  padding: 8px 30px 8px 8px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position-x: calc(100% - 10px);
  background-position-y: 50%;
}
</style>
