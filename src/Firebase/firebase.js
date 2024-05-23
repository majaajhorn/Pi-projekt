import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { onAuthStateChanged } from 'firebase/auth';
import store from '../store/store';

const firebaseConfig = {
  apiKey: "AIzaSyC56wrFHPtAL9k6I__BkmKXolxiJHo3-Pw",
  authDomain: "pi-projekt-4eae8.firebaseapp.com",
  projectId: "pi-projekt-4eae8",
  storageBucket: "pi-projekt-4eae8.appspot.com",
  messagingSenderId: "1026057018611",
  appId: "1:1026057018611:web:dca67afee6a10ad77b6b86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


onAuthStateChanged(auth, user => {
  store.commit('setCurrentUser', user || null);
});

export {
    db,
    auth,
    storage
}