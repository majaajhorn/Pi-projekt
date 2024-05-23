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
        <input type="password" id="password" v-model="password" @input="showPasswordHint = true" required>
        <small class="password-hint" v-if="showPasswordHint">Password must be at least 6 characters long, contain at least one uppercase letter and one number.</small>
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
      password: '',
      showPasswordHint: false
    };
  },
  methods: {
    validatePassword(password) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      return password.length >= 6 && hasUpperCase && hasNumber;
    },
    async handleSignUp() {
      if (!this.validatePassword(this.password)) {
        alert('Password must be at least 6 characters long, contain at least one uppercase letter and one number.');
        return;
      }
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          email: this.email,
          password: this.password
        });

        console.log('New User:', userCredential.user);
        this.$router.push("/mainPage");
      } catch (error) {
        console.error('Error signing up:', error);
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
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.signup-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.password-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}
</style>
