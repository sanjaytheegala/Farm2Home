import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
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

// Initialize Firebase (HMR/React Refresh safe)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const isBrowser = typeof window !== 'undefined';

// Exports for the rest of the app
export const auth = getAuth(app);

// Set LOCAL persistence globally so sessions survive page-refresh and browser restart.
// Guarded so React Refresh/HMR doesn't repeatedly reconfigure persistence.
if (isBrowser && !window.__FIREBASE_AUTH_PERSISTENCE_SET__) {
  window.__FIREBASE_AUTH_PERSISTENCE_SET__ = true;
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // If persistence cannot be set (e.g., browser restrictions), continue without crashing.
  });
}

// Firestore can hit rare internal assertion failures in dev (especially behind proxies,
// with browser extensions, or during React Refresh). Initializing it once with
// long-polling auto-detection tends to stabilize the listen stream.
//
// If you ever need to force long-polling (stronger workaround), set:
//   REACT_APP_FIRESTORE_FORCE_LONG_POLLING=true
// and restart `npm start`.
export const db = (() => {
  if (!isBrowser) return getFirestore(app);

  if (!window.__FIREBASE_DB__) {
    const forceLongPolling = process.env.REACT_APP_FIRESTORE_FORCE_LONG_POLLING === 'true';
    window.__FIREBASE_DB__ = initializeFirestore(
      app,
      forceLongPolling
        ? { experimentalForceLongPolling: true }
        : { experimentalAutoDetectLongPolling: true }
    );
  }
  return window.__FIREBASE_DB__;
})();
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
