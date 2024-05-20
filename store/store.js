// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  actions: {
    setCurrentUser({ commit }, user) {
      commit('setCurrentUser', user);
    }
  },
  getters: {
    currentUser: state => state.currentUser,
  }
});

export default store;
