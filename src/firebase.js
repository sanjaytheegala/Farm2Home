// firebase.js
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyB78hNtGRwB5h1FdWXIv9sY-JWQxoHBB4M",
  authDomain: "agricultureportal-81186.firebaseapp.com",
  projectId: "agricultureportal-81186",
  storageBucket: "agricultureportal-81186.appspot.com",
  messagingSenderId: "880675711106",
  appId: "1:880675711106:web:e64bebe2f81b7c73d4ac9b",
  databaseURL: "https://agricultureportal-81186-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
