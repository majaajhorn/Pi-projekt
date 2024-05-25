<template>
  <nav class="navbar">
    <router-link to="/MyProfile" class="nav-item">
      <i class="fas fa-user"></i>
    </router-link>
    <router-link to="/MyRecipes" class="nav-item">
      <i class="fas fa-utensils"></i>
    </router-link>
    <router-link to="/MainPage" class="nav-item">
      <i class="fas fa-home"></i>
    </router-link>
    <router-link to="/AllRecipes" class="nav-item">
      <i class="fa-solid fa-plate-wheat"></i>
    </router-link>
    <router-link to="/MyFavorites" class="nav-item">
      <i class="fas fa-heart"></i>
    </router-link>
    <button @click="logout" class="nav-item logout">
      <i class="fas fa-sign-out-alt"></i>
    </button>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'Navbar',
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        window.alert("Successfully signed out!");
        this.$router.push('/');
      } catch (error) {
        console.error("Logout error", error);
        window.alert("Log out has not been completed");
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #C7F9CC;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.nav-item {
  color: #333333;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-item i {
  font-size: 24px;
  padding-bottom: 5px;
  cursor: pointer;
}

/* Override color for logout icon */
.nav-item.logout i {
  color: #333333;
}

/* Remove button styling */
.nav-item.logout {
  background-color: transparent;
  border: none;
  padding: 0;
}
</style>
