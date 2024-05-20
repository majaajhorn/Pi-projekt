<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">LOGIN</button>
    </form>
    <h4>Don't have an account? Click to sign up</h4>
    <button @click="goToSignUp" type="button" id="btn_vodi_na_signup">Click me</button>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleSubmit() {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log('User:', user);
        this.$store.commit('setCurrentUser', user);
        this.$router.push("/mainPage");
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Failed to log in. Please check your credentials.');
      }
    },
    goToSignUp() {
      this.$router.push("/SignUp");
    }
  }
};
</script>

<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.login-container {
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
