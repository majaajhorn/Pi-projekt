<template>
  <div class="my-favorites">
    <h2>My Favorite Recipes</h2>
    <div v-if="loading">Loading favorite recipes...</div>
    <div v-else-if="favoriteRecipes.length === 0">No favorite recipes found.</div>
    <div v-else>
      <ul class="recipe-list">
        <li v-for="recipe in favoriteRecipes" :key="recipe.id" class="recipe-item">
          <div class="recipe-image-container">
            <router-link :to="{ name: 'RecipeDetails', params: { userId: recipe.userId, id: recipe.id } }" class="no-decoration">
              <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
              <h3>{{ recipe.title }}</h3>
            </router-link>
          </div>
          <div class="button-container">
            <button @click="confirmDelete(recipe.id)" class="recipe-button">
              <i class="fas fa-trash-alt"></i>
            </button>
            <button @click="unfavoriteRecipe(recipe.id)" class="recipe-button">
              <i class="fas fa-heart" style="color: red;"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <Navbar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import { db } from '@/Firebase/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { mapState } from 'vuex';

export default {
  name: 'MyFavorites',
  components: {
    Navbar
  },
  data() {
    return {
      favoriteRecipes: [],
      loading: true
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  async created() {
    await this.fetchFavoriteRecipes();
  },
  methods: {
    async fetchFavoriteRecipes() {
      try {
        if (!this.currentUser) {
          console.error('No user logged in.');
          this.loading = false;
          return;
        }

        const recipesSnapshot = await getDocs(collection(db, 'users', this.currentUser.uid, 'recepti'));
        this.favoriteRecipes = recipesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: this.currentUser.uid,
            title: data.title,
            ingredients: data.ingredients,
            courses: data.courses,
            prepTime: data.prepTime,
            cookingTime: data.cookingTime,
            methods: data.methods,
            imageUrl: data.imageUrl || null,
            isFavorite: data.isFavorite || false
          };
        }).filter(recipe => recipe.isFavorite);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    async confirmDelete(recipeId) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        await this.deleteRecipe(recipeId);
      }
    },
    async deleteRecipe(recipeId) {
      try {
        await deleteDoc(doc(db, 'users', this.currentUser.uid, 'recepti', recipeId));
        this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.id !== recipeId);
        this.$emit('deleteRecipe', recipeId); // Emit event to MyRecipes.vue if necessary
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe.');
      }
    },
    async unfavoriteRecipe(recipeId) {
      try {
        const recipeRef = doc(db, 'users', this.currentUser.uid, 'recepti', recipeId);
        await updateDoc(recipeRef, { isFavorite: false });
        this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.id !== recipeId);
      } catch (error) {
        console.error('Error updating favorite status:', error);
        alert('An error occurred while updating the recipe.');
      }
    }
  }
};
</script>

<style scoped>
.my-favorites {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px; 
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
  width: calc(33.33% - 20px); 
  margin-bottom: 20px;
  background-color: #C7F9CC;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center; 
}

.recipe-image-container {
  width: 150px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center; 
}

.recipe-image {
  width: 100%;
  border-radius: 5px;
}

.no-decoration {
  text-decoration: none;
  color: black; 
}

.button-container {
  margin-top: auto; 
  display: flex;
  justify-content: center; 
}

.recipe-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 10px;
}

.recipe-button .fa-trash-alt {
  color: black; 
}

.recipe-button .fa-heart {
  color: red; 
}

.recipe-button:hover .fa-trash-alt {
  color: black; 
}

.recipe-button:hover .fa-heart {
  color: darkred; 
}
</style>
