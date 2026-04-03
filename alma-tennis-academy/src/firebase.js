import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDJ27ac6fGFv1jxKLMNJL6lMn7jTdIhFEw",
  authDomain: "alma-tennis-academy.firebaseapp.com",
  projectId: "alma-tennis-academy",
  storageBucket: "alma-tennis-academy.firebasestorage.app",
  messagingSenderId: "530788124405",
  appId: "1:530788124405:web:d788c27e52b078dc09e7bc",
  measurementId: "G-5MMPMWF7M6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
