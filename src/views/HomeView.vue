<template>
  <div class="home-view">
    <button class="button"><router-link to="/Login" class="link">Login</router-link></button>
    <button class="button"><router-link to="/SignUp" class="link">Sign Up</router-link></button>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
}

.button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.link {
  color: white;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
