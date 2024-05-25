<template>
    <div class="recipe-details" v-if="!loading">
      <h2>{{ recipe.title }}</h2>
      <div class="recipe-image-container">
        <img :src="recipe.imageUrl" alt="Recipe Image" class="recipe-image" v-if="recipe.imageUrl" />
      </div>
      <p><strong>Ingredients:</strong></p>
      <p>{{ recipe.ingredients }}</p>
      <p><strong>Courses:</strong> {{ recipe.courses }}</p>
      <p><strong>Prep Time:</strong> {{ recipe.prepTime }} minutes</p>
      <p><strong>Cooking Time:</strong> {{ recipe.cookingTime }} minutes</p>
      <p><strong>Methods:</strong></p>
      <p>{{ recipe.methods }}</p>
      <!---->
      <p><strong>Created by:</strong> {{ userEmail }}</p>
  
      <button class="start-cooking-btn" @click="startCooking" v-if="!cooking">Start Cooking</button>
      <div v-else class="clock">
        <span>{{ timeLeft.minutes }}</span>:<span>{{ timeLeft.seconds }}</span>
      </div>
      <div v-if="showAlert" class="alert">Cooking time finished! Enjoy your meal!</div>
  
      <!-- Audio element for playing alarm sound -->
      <audio ref="alarmSound" :src="alarmSoundSrc"></audio>
    </div>
    <div v-else>Loading...</div>
  
    <!-- Include navbar component -->
    <Navbar />
  </template>
  
  <script>
  import { db } from '@/Firebase/firebase';
  import { doc, getDoc } from 'firebase/firestore';
  import Navbar from '../components/Navbar.vue';
  import alarmSound from '../assets/AlarmSound.mp3.mp3';
  
  export default {
    name: 'RecipeDetails',
    components: {
      Navbar,
    },
    data() {
      return {
        recipe: {},
        loading: true,
        cooking: false,
        showAlert: false,
        timeLeft: {
          minutes: 0,
          seconds: 0,
        },
        alarmSoundSrc: alarmSound, // Use the imported alarm sound
      };
    },
    async created() {
      await this.fetchRecipeDetails();
    },
    methods: {
      async fetchRecipeDetails() {
        try {
          const recipeId = this.$route.params.id;
          const recipeDoc = await getDoc(
            doc(db, 'users', this.$store.state.currentUser.uid, 'recepti', recipeId)
          );
          if (recipeDoc.exists()) {
            this.recipe = recipeDoc.data();
          } else {
            console.error('No such recipe!');
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        } finally {
          this.loading = false;
        }
      },
      startCooking() {
        this.cooking = true;
        const totalTime = this.recipe.cookingTime * 60; // Convert cooking time to seconds
        let timeLeft = totalTime;
        const countdown = setInterval(() => {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          this.timeLeft = {
            minutes: minutes < 10 ? '0' + minutes : minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds,
          };
          timeLeft--;
  
          if (timeLeft < 0) {
            clearInterval(countdown);
            this.showAlert = true;
            this.playAlarmSound();
          }
        }, 1000);
      },
      playAlarmSound() {
        try {
          const audioElement = this.$refs.alarmSound;
          audioElement.load(); // Ensure the audio is loaded
          audioElement.play().catch((error) => {
            console.error('Error playing alarm sound:', error);
          });
        } catch (error) {
          console.error('Error playing alarm sound:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Recipe Details Styles */
  .recipe-details {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 100px; /* Adjusted for navbar height */
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }
  
  .recipe-details h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }
  
  .recipe-image-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .recipe-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .recipe-details p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .recipe-details p strong {
    color: #333;
  }
  
  .start-cooking-btn {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 8px;
  }
  
  .start-cooking-btn:hover {
    background-color: #45a049; /* Darker Green */
  }
  
  .clock {
    font-size: 30px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .clock span {
    padding: 5px;
    background-color: #f2f2f2;
    border-radius: 5px;
  }
  
  .alert {
    text-align: center;
    background-color: #ffc107;
    color: #333;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
  }
  </style>
  