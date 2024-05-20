import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router instance from index.js
//import store from './store/store.js';
import store from './store/store.js';
import SearchButton from './components/SearchButton.vue';


// Create the Vue app instance
const app = createApp(App);

// Register the global components
app.component('SearchButton', SearchButton);

// Use the router
app.use(router);
app.use(store);

// Mount the app
app.mount('#app');
