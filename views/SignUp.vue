<template>
  <div class="signup-container">
    <h2>SIGN UP</h2>
    <form @submit.prevent="handleSignUp">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">SIGN UP</button>
    </form>
    <h4>Already have an account? Click to log in</h4>
    <button @click="goToLogin" type="button">Login</button>
  </div>
</template>

<script>
import { auth, db } from '@/Firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: 'SignUpForm',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleSignUp() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        // New user is signed up
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          email: this.email,
          password: this.password
        });

        console.log('New User:', userCredential.user);
        // Optionally, you can do something like sending a verification email here
        // Redirect to the main page or perform other actions as needed
        this.$router.push("/mainPage");
      } catch (error) {
        console.error('Error signing up:', error);
        // Handle sign-up errors here
        alert('Failed to sign up. Please try again.');
      }
    },
    goToLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.signup-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #80ed99;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5cc77a;
}
</style>
