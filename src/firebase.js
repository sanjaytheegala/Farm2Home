// // firebase.js
// import { initializeApp } from 'firebase/app'
// import { getDatabase } from 'firebase/database'

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
// }

// // Validate required environment variables
// const requiredEnvVars = [
//   'REACT_APP_FIREBASE_API_KEY',
//   'REACT_APP_FIREBASE_AUTH_DOMAIN',
//   'REACT_APP_FIREBASE_PROJECT_ID',
//   'REACT_APP_FIREBASE_DATABASE_URL'
// ]

// const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
// if (missingVars.length > 0) {
//   throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`)
// }

// const app = initializeApp(firebaseConfig)
// export const db = getDatabase(app)
