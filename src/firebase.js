import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

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

// Exports for the rest of the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
