import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue'; 
import { getAuth } from 'firebase/auth';
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
import Statistics from '../views/Statistics.vue';

const routes = [
 /* {
    path: '/',
    name: 'home',
    component: HomeView
  },*/
   {
    path: '/',
    redirect: '/login' // Redirekcija s početne rute na /login
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
  },
  {
    path: '/Statistics',
    name: 'Statistics',
    component: Statistics
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp({
  
});

app.component('SearchButton', SearchButton); 
app.use(router); 
app.mount('#app'); 

export default router;
