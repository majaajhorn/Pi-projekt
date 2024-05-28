import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue'; // Import createApp if not already imported
import { getAuth } from 'firebase/auth';
import HomeView from '../views/HomeView.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import MainPage from '../views/MainPage.vue';
import NewRecipe from '../views/NewRecipe.vue';
import MyRecipes from '../views/MyRecipes.vue';
import RecipeDetails from '@/views/RecipeDetails.vue';
import MyProfile from '../views/MyProfile.vue';
import SearchButton from '../components/SearchButton.vue';
import MyFavorites from '../views/MyFavorites.vue';
import AllRecipes from '../views/AllRecipes.vue';

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
    path: '/:userId/MyRecipes',
    name: 'MyRecipes',
    component: MyRecipes
  },
  { //
    path: '/RecipeDetails/:userId/:id',
    //path:'/RecipeDetails/:userId/:id',
    //path: '/:userId/MyRecipes/:recipeId/RecipeDetails',

    name: 'RecipeDetails',
    component: RecipeDetails
  },
  {
    path: '/MyProfile',
    name: 'MyProfile',
    component: MyProfile
  },
  {
    path: '/:userId/MyFavorites',
    name: 'MyFavorites',
    component: MyFavorites
  },
  {
    path: '/AllRecipes',
    name: 'AllRecipes',
    component: AllRecipes
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp({
  // Your root component, if needed. Example:
  // render: h => h(App)
});

app.component('SearchButton', SearchButton); // Register SearchButton globally
app.use(router); // Use the router
app.mount('#app'); // Mount the app to the DOM element with id "app"

export default router;