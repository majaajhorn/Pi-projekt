import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import MainPage from '../views/MainPage.vue'
import NewRecipe from '../views/NewRecipe.vue'
import searchButton from '../components/SearchButton.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
