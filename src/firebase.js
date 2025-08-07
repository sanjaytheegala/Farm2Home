// firebase.js
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyB78hNtGRwB5h1FdWXIv9sY-JWQxoHBB4M",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "agricultureportal-81186.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "agricultureportal-81186",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "agricultureportal-81186.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "880675711106",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:880675711106:web:e64bebe2f81b7c73d4ac9b",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://agricultureportal-81186-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
