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

    <!-- Review button -->
    <button class="rate-btn" @click="toggleReviewForm">Rate</button>

    <!-- Review form -->
    <!-- <div v-if="showReviewForm && currentUserEmail !== recipeCreatorEmail"> -->
      <div v-if="showReviewForm">
  <form @submit.prevent="submitReview">
    <label for="review-description">Review Description:</label>
    <textarea id="review-description" v-model="reviewDescription"></textarea>
    <label for="star-rating">Star Rating:</label>
    <select id="star-rating" v-model="starRating">
      <option value="1">1 star</option>
      <option value="2">2 stars</option>
      <option value="3">3 stars</option>
      <option value="4">4 stars</option>
      <option value="5">5 stars</option>
    </select>
    <button type="submit">Submit Review</button>
  </form>
</div>


    <!-- Reviews -->
    <div v-if="reviews.length > 0">
      <h3>Reviews:</h3>
      <ul>
        <li v-for="review in reviews" :key="review.id">
  <p>{{ review.description }}</p>
  <p>Rating: {{ review.rating }}</p>
  <p>By: {{ review.userEmail }}</p> <!-- Display user's email -->
</li> 
      </ul>
    </div>

    <!-- Audio element for playing alarm sound -->
    <audio ref="alarmSound" :src="alarmSoundSrc"></audio>
  </div>
  <div v-else>Loading...</div>

  <!-- Include navbar component -->
  <Navbar />
</template>

<script>
import { db, auth } from '@/Firebase/firebase'; // Assuming you have auth exported from Firebase
import { doc, getDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
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
      showReviewForm: false,
      reviewDescription: '',
      starRating: 1,
      reviews: [],
      currentUserEmail: null, // Store current user's email
    };
  },
  async created() {
    await this.fetchRecipeDetails();
    await this.fetchReviews();
    this.getCurrentUserEmail(); // Fetch current user's email when component is created
  },
  methods: {
    async getCurrentUserEmail() {
      try {
        const user = auth.currentUser; // Get currently logged-in user
        if (user) {
          // If user is logged in, fetch their email
          this.currentUserEmail = user.email;
        }
      } catch (error) {
        console.error('Error fetching current user email:', error);
      }
    },
    async fetchRecipeDetails() {
  try {
    const recipeId = this.$route.params.id;
    const userId = this.$route.params.userId;
    const recipeDoc = await getDoc(doc(db, `users/${userId}/recepti/${recipeId}`));
    if (recipeDoc.exists()) {
      this.recipe = recipeDoc.data();
      // Fetch the creator's email
      const userDoc = await getDoc(doc(db, `users/${userId}`));
      if (userDoc.exists()) {
        this.recipeCreatorEmail = userDoc.data().email;
      }
    } else {
      console.error('No such recipe!');
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  } finally {
    this.loading = false;
  }
},

    async startCooking() {
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
    toggleReviewForm() {
      
      if (this.currentUserEmail === this.recipeCreatorEmail) {
      // Display an alert
      alert("You can't review your own recipe.");
      return; // Stop further execution
      }
      else {
      this.showReviewForm = !this.showReviewForm;
      }
    },
    async submitReview() {
      try {
        const recipeId = this.$route.params.id;
        const userId = this.$route.params.userId;

        


        // Add review to Firebase
        await addDoc(collection(db, `users/${userId}/recepti/${recipeId}/reviews`), {
          description: this.reviewDescription,
          rating: this.starRating,
          userEmail: this.currentUserEmail, // Use current user's email
          timestamp: new Date(),
        });

        // Reset review form fields
        this.reviewDescription = '';
        this.starRating = 1;

        // Fetch updated reviews
        await this.fetchReviews();
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    },
    async fetchReviews() {
      try {
        const recipeId = this.$route.params.id;
        const userId = this.$route.params.userId;

        const q = query(
          collection(db, `users/${userId}/recepti/${recipeId}/reviews`)
        );
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Update the current user's email for existing reviews
        for (const review of reviewsData) {
          if (review.userId === auth.currentUser.uid) {
            review.userEmail = this.currentUserEmail;
          } else {
            // Fetch user email for other reviews
            const userDoc = await getDoc(doc(db, `users/${review.userId}`));
            if (userDoc.exists()) {
              review.userEmail = userDoc.data().email;
            }
          }
        }

        this.reviews = reviewsData;
      } catch (error) {
        console.error('Error fetching reviews:', error);
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
