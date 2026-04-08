import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
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
// Force memory-only cache: no IndexedDB persistence
// This ensures writes FAIL immediately if server rejects them
// instead of silently caching locally
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});
export const storage = getStorage(app);
