<template>
    <div class="countdown">
      <p v-if="countdown > 0">{{ countdown }} minutes remaining</p>
      <p v-else>Cooking time is up!</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CountDown',
    props: {
      cookingTime: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        countdown: 0
      };
    },
    methods: {
      startCountdown() {
        this.countdown = this.cookingTime;
        const interval = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            clearInterval(interval);
            // Notify the user here (e.g., using a notification library)
            alert('Cooking time is up!');
          }
        }, 60000); // 1 minute interval (60000 milliseconds)
      }
    },
    mounted() {
      this.startCountdown();
    }
  };
  </script>
  
  <style scoped>
  .countdown {
    text-align: center;
  }
  </style>
  