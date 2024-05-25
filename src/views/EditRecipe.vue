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
        <label for="image">Image:</label>
        <input type="file" id="image" @change="handleImageUpload" accept="image/*">
      </div>
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<script>
import { db } from '@/Firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


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
        image: null, // New property for the image
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
        let imageUrl = this.recipe.imageUrl || ''; // Initialize with existing image URL
        
        // If a new image is uploaded, update the image in Firebase Storage
        if (this.recipe.image) {
          const storage = getStorage();
          const storageRef = ref(storage, `recipe-images/${this.$store.state.currentUser.uid}/${this.recipe.image.name}`);
          await uploadBytes(storageRef, this.recipe.image);

          // Log the size of the uploaded image after compression
      console.log("Uploaded image size after compression:", this.recipe.image.size, "bytes");
      
          imageUrl = await getDownloadURL(storageRef);
        }

        // Update recipe data in Firestore
        await updateDoc(recipeRef, {
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          courses: this.recipe.courses,
          prepTime: this.recipe.prepTime,
          cookingTime: this.recipe.cookingTime,
          methods: this.recipe.methods,
          imageUrl: imageUrl,
        });

        alert('Recipe updated successfully!');
        this.$router.push('/MyRecipes');
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("Uploaded image size:", file.size, "bytes");
        this.recipe.image = file; // Store the selected file
      }
    },
  },
};
</script>

<style scoped>
.my-recipes {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px; /* Add padding to the bottom */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding-left: 0;
}

.recipe-item {
  width: calc(33.33% - 20px); /* Adjust width for responsiveness */
  margin-bottom: 20px;
  background-color: #C7F9CC;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center text */
}

.recipe-image-container {
  width: 150px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center; /* Center image horizontally */
}

.recipe-image {
  width: 100%;
  border-radius: 5px;
}

.no-decoration {
  text-decoration: none;
  color: inherit;
}

.button-container {
  margin-top: auto; /* Push buttons to the bottom */
  display: flex;
  justify-content: center; /* Center buttons horizontally */
}

.recipe-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 10px;
}

.recipe-button .fa-trash-alt {
  color: black; /* Black color for delete button */
}

.recipe-button .fa-heart {
  color: black; /* Red color for heart button */
}

.recipe-button:hover .fa-trash-alt {
  color: black; /* Ensure delete button stays black on hover */
}

.recipe-button:hover .fa-heart {
  color: darkred; /* Darker red on hover */
}

.edit-recipe {
  max-width: 400px;
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
  border-radius: 20px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition */
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

.save-button {
  background-color: #007BFF; 
  border-radius: 5px;
  padding: 10px 20px;
  margin-right: 7em;
}

.cancel-button {
  background-color: #dc3545; /* Red */
  border-radius: 5px;
  padding: 10px 20px;
}
</style>