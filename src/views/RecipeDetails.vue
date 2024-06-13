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

    <div class="button-container">
      <button class="start-cooking-btn" @click="startCooking" v-if="!cooking">Start Cooking</button>
      <div v-else class="clock">
        <span>{{ timeLeft.minutes }}</span>:<span>{{ timeLeft.seconds }}</span>
      </div>
      <div v-if="showAlert" class="alert">Cooking time finished! Enjoy your meal!</div>

      <!-- Review button -->
      <button class="rate-btn" @click="toggleReviewForm">Rate</button>
    </div>

    <!-- Review form -->
    <div v-if="showReviewForm" class="review-form">
      <h3>Leave a Review</h3>
      <form @submit.prevent="submitReview">
        <div class="form-group">
          <label for="review-description">Review Description:</label>
          <textarea id="review-description" v-model="reviewDescription" class="form-control" rows="6" placeholder="Write your review here"></textarea>
        </div>
        <div class="form-group">
          <label for="star-rating">Star Rating:</label>
          <div class="star-rating">
            <input type="radio" id="star1" name="star-rating" v-model="starRating" :value="5" @click="selectRating(5)" :checked="selectedRating === 5" />
            <label for="star1" title="5 stars"><i class="fas fa-star" :class="{ 'selected': selectedRating === 5 }"></i></label>
            <input type="radio" id="star2" name="star-rating" v-model="starRating" :value="4" @click="selectRating(4)" :checked="selectedRating === 4" />
            <label for="star2" title="4 stars"><i class="fas fa-star" :class="{ 'selected': selectedRating === 4 }"></i></label>
            <input type="radio" id="star3" name="star-rating" v-model="starRating" :value="3" @click="selectRating(3)" :checked="selectedRating === 3" />
            <label for="star3" title="3 stars"><i class="fas fa-star" :class="{ 'selected': selectedRating === 3 }"></i></label>
            <input type="radio" id="star4" name="star-rating" v-model="starRating" :value="2" @click="selectRating(2)" :checked="selectedRating === 2" />
            <label for="star4" title="2 stars"><i class="fas fa-star" :class="{ 'selected': selectedRating === 2 }"></i></label>
            <input type="radio" id="star5" name="star-rating" v-model="starRating" :value="1" @click="selectRating(1)" :checked="selectedRating === 1" />
            <label for="star5" title="1 star"><i class="fas fa-star" :class="{ 'selected': selectedRating === 1 }"></i></label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit Review</button>
      </form>
    </div>

    <!-- Reviews -->
    <div v-if="reviews.length > 0">
      <h3>Reviews:</h3>
      <ul class="reviews-list">
        <li v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="review-user">{{ review.userEmail }}</span>
            <span class="review-rating">{{ review.rating }}</span> <!-- Display the numeric rating -->
          </div>
          <p class="review-description">{{ review.description }}</p>
          <span class="review-timestamp">{{ new Date(review.timestamp.seconds * 1000).toLocaleString() }}</span>
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
import { doc, getDoc, collection, addDoc, getDocs, query } from 'firebase/firestore';
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
      selectedRating: null, // New property to store the selected star rating
      reviews: [],
      currentUserEmail: null, // Store current user's email
      recipeCreatorEmail: null, // Store recipe creator's email
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
      } else {
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
        this.selectedRating = null; // Clear selected rating after submission

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
        let reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

        // Sort reviews by timestamp in descending order (newest first)
        reviewsData = reviewsData.sort((a, b) => b.timestamp - a.timestamp);

        this.reviews = reviewsData;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },

    // Method to select a star rating
    selectRating(rating) {
      this.selectedRating = rating;
      this.starRating = rating
    },
    toggleStarColor(rating) {
      if (this.selectedRating === rating) {
        this.selectedRating = null; // Deselect if already selected
      } else {
        this.selectedRating = rating;
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
  padding-bottom: 100px; 
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

.recipe-details p strong {
  color: #333;
}

.start-cooking-btn {
  background-color: #4CAF50; 
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
  background-color: #45a049; 
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

/* Rate Button Styles */
.rate-btn {
  background: #66cc80;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.rate-btn:hover {
  background: linear-gradient(90deg, #66cc80 0%, #4CAF50 100%);
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px; 
}

.star-rating {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.star-rating input[type="radio"] {
  display: none;
}

.star-rating label {
  cursor: pointer;
  font-size: 24px;
  color: #ffd700;
  margin-right: 5px; 
}

.star-rating label:hover,
.star-rating label:hover ~ label {
  color: #ffbb00;
}

.star-rating label.selected,
.star-rating label.selected {
  color: #ffd700; 
}

.review-form {
  margin-top: 20px;
}

.review-form h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.review-form form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.review-form .form-group {
  margin-bottom: 20px;
}

.review-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.review-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.review-form .star-rating {
  margin-top: 10px;
}

.review-form button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition-duration: 0.4s;
}

.review-form button:hover {
  background-color: #45a049;
}

/* Reviews List Styles */
.reviews-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.review-item {
  background-color: #f9f9f9;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.review-user {
  font-weight: bold;
  color: #333;
}

.review-rating {
  color: #333;
}

.review-description {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.review-timestamp {
  font-size: 14px;
  color: #999;
  text-align: right;
  display: block;
}
</style>

