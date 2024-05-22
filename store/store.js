import { createStore } from 'vuex';
import { ref, onMounted } from 'vue'; // Import ref and onMounted from Vue Composition API

const store = createStore({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
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

/*
const password = ref('');
onMounted(() => {
  const user = store.state.currentUser;
  if (user) {
    password.value = user.password;
  }
});
*/