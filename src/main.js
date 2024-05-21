import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router instance from index.js
//import store from './store/store.js';
import store from './store/store.js';
import SearchButton from './components/SearchButton.vue';
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


// Register the global components
app.component('SearchButton', SearchButton);


