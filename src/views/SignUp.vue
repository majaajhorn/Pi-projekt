<template>
  <div class="split-screen">
    <div class="left"></div>
    <div class="right">
      <div class="signup-container">
        <h2>Welcome to <span class="plant">Plantenious</span></h2>
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
          <button type="submit">Sign up</button>
        </form>
        <h4>Already have an account? Click to log in</h4>
        <button @click="goToLogin" type="button">Login</button>
      </div>
    </div>
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
}

.split-screen {
  display: flex;
  height: 100vh;
}

.left {
  flex: 1;
  background-image: url('../assets/login_wallpaper.jpg'); /* Update the path */
  background-size: cover;
  height: 100vh;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px; /* Added padding to the left */
}

.signup-container {
  padding: 20px;
  width: 300px;
  text-align: center;
}

h2 {
  margin-bottom: 50px; 
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
  margin-top: 20;
}

label {
  display: block;
  margin-bottom: 10px;
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

.plant {
  color: #5cc77a;
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
