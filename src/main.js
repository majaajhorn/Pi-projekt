import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
import store from './store/store.js';
import { auth } from './Firebase/firebase';

let app;

auth.onAuthStateChanged(user => {
  store.commit('setCurrentUser', user || null);

  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.mount('#app');
  }
});




