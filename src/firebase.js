// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC-iSg3N-m9NlRa8mFbfiHeMO7JiiAZ2TY",
  authDomain: "pave-local.firebaseapp.com",
  projectId: "pave-local",
  storageBucket: "pave-local.firebasestorage.app",
  messagingSenderId: "535377812899",
  appId: "1:535377812899:web:56978f1e7d4fcc51aace16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);