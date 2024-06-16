
<template>
  <div class="split-screen">
    <div class="left"></div>
    <div class="right">
      <div class="login-container">
        <h2>Welcome to <span class="plant">Plantenious</span></h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
        <button @click="forgotPassword" type="button" class="forgot-password">Forgot password?</button>
        <h4>Don't have an account? <span class="black_text">Create a new one</span></h4>
        <button @click="goToSignUp" type="button" id="btn_vodi_na_signup">Click me</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/Firebase/firebase';

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

    // Increment timesLoggedIn in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedTimesLoggedIn = (userData.timesLoggedIn || 0) + 1;
      await updateDoc(userDocRef, { timesLoggedIn: updatedTimesLoggedIn });
    }

    this.$router.push("/mainPage");
  } catch (error) {
    console.error('Error logging in:', error);
    alert('Failed to log in. Please check your credentials.');
  }
},
    async updateFirestorePassword(uid, newPassword) {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().password !== newPassword) {
          await updateDoc(userDocRef, { password: newPassword });
        }
      } catch (error) {
        console.error('Error updating Firestore password:', error);
      }
    },
    async forgotPassword() {
      const auth = getAuth();
      if (!this.email) {
        alert('Please enter your email address to reset your password.');
        return;
      }
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert('Password reset email sent. Please check your inbox.');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('Failed to send password reset email. Please try again.');
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
  margin: 0;
  font-family: Arial, sans-serif;
}

.split-screen {
  display: flex;
  height: 100vh;
}

.left {
  flex: 1;
  background-image: url('../assets/login_wallpaper.jpg'); 
  background-size: cover;
  height: 100vh;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
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

.forgot-password {
  margin-top: 10px;
  background-color: #f0ad4e;
}

.forgot-password:hover {
  background-color: #ec971f;
}

.black_text {
  color: black; 
}

.plant {
  color: #5cc77a;
}
</style>
