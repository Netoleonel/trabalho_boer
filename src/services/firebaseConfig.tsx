import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCPwpjeEX8ApXQX7qA2eAIgFlDPij-XI_8",
  authDomain: "projetro-agrotech.firebaseapp.com",
  projectId: "projetro-agrotech",
  storageBucket: "projetro-agrotech.firebasestorage.app",
  messagingSenderId: "926558825563",
  appId: "1:926558825563:web:a832e4c7846246fc6fe37e",
  databaseURL: "https://projetro-agrotech-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);