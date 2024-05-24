import { createStore } from 'vuex';
import { ref, onMounted } from 'vue'; // Import ref and onMounted from Vue Composition API

const store = createStore({
  state: {
    currentUser: null,
    recipes: [] // add recipes array to store recipe data
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setRecipes(state, recipes) {
      state.recipes = recipes;
    },
    deleteRecipe(state, recipeId) {
      state.recipes = state.recipes.filter(recipe => recipe.id !== recipeId);
    }
  },
  actions: {
    setCurrentUser({ commit }, user) {
      commit('setCurrentUser', user);
    },
  },
  getters: {
    currentUser: state => state.currentUser,
    isAuthenticated: state => !!state.currentUser,
  },
});

export default store;

/* --- OVO NISAM SIGURNA, NEKA OSTANE ZAKOMENTIRANO
const password = ref('');
onMounted(() => {
  const user = store.state.currentUser;
  if (user) {
    password.value = user.password;
  }
});
*/