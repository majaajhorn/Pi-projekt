<template>
    <div class="login-container">
      <h2>SIGNUP</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" @input="validateEmail" required>
          <span v-if="emailError" class="error">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" @input="validatePassword" required>
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>
        <button type="submit" :disabled="!formValid">SIGNUP</button>
      </form>
      <button @click="goToLogin">Idi natrag</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignUpForm',
    data() {
      return {
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
      };
    },
    computed: {
      formValid() {
        return !this.emailError && !this.passwordError && this.email && this.password;
      }
    },
    methods: {
      validateEmail() {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        this.emailError = emailPattern.test(this.email) ? '' : 'Invalid email address';
      },
      validatePassword() {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        this.passwordError = passwordPattern.test(this.password) 
          ? '' 
          : 'Password must be at least 6 characters long, include at least one uppercase letter and one number';
      },
      handleSubmit() {
        if (this.formValid) {
          console.log('Email:', this.email);
          console.log('Password:', this.password);
          // Ovdje možete dodati logiku za registraciju
        }
      },
      goToLogin() {
        this.$router.push("/Login");
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
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #5cc77a;
  }
  
  .error {
    color: red;
    font-size: 12px;
  }
  </style>
  