// firebase.js
// Production Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, push, set, get, remove } from 'firebase/database';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { logger } from './utils/logger';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGMtcNKYtFdSaMSiXVyHh9xMKs1N5RKL4",
  authDomain: "farm2home-4a7a2.firebaseapp.com",
  databaseURL: "https://farm2home-4a7a2-default-rtdb.firebaseio.com",
  projectId: "farm2home-4a7a2",
  storageBucket: "farm2home-4a7a2.firebasestorage.app",
  messagingSenderId: "343445973692",
  appId: "1:343445973692:web:c1a5b3000f32b50268feb9",
  measurementId: "G-LGYM47DNDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const analytics = getAnalytics(app);

// Export Firebase functions for use in components
export {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  ref,
  push,
  set,
  get,
  remove,
  doc,
  setDoc,
  getDoc
};

logger.log('Firebase.js loaded - using production Firebase configuration');

