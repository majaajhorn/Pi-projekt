import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import MainPage from '../views/MainPage.vue';
import NewRecipe from '../views/NewRecipe.vue';
//import SearchButton from './components/SearchButton.vue'; // Uncomment this line if you want to use SearchButton

import MyRecipes from '../views/MyRecipes.vue';
import { createApp } from 'vue'; // Import createApp if not already imported

import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
const currentUser = getAuth().currentUser;

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/mainPage',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/NewRecipe',
    name: 'NewRecipe',
    component: NewRecipe
  },
  {
    path: '/MyRecipes',
    name: 'MyRecipes',
    component: MyRecipes
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(); // Create the Vue app instance

//app.component('SearchButton', SearchButton); // Register SearchButton globally
app.use(router); // Use the router

export default router;
