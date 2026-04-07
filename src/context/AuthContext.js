import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '../utils/logger';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch Firestore profile irrespective of email verification status.
        // Route guards and UI components will handle directing unverified users.

        try {
          const userDocRef = doc(db, 'users', user.uid);
          let userDoc = await getDoc(userDocRef);

          // Race condition: signup writes the Firestore doc AFTER Firebase Auth
          // fires onAuthStateChanged. Retry once after a short delay so we always
          // get the full profile (with role) instead of falling back to basic data.
          if (!userDoc.exists()) {
            await new Promise((r) => setTimeout(r, 1500));
            // Check again if user is still logged in before retrying getDoc
            if (auth.currentUser) {
              userDoc = await getDoc(userDocRef);
            }
          }

          if (userDoc.exists()) {
            const fullUserData = { uid: user.uid, email: user.email, displayName: user.displayName, ...userDoc.data() };
            setCurrentUser(user);
            setUserData(fullUserData);
            // Store only minimal non-sensitive data in localStorage
            // Full profile is always fetched fresh from Firestore via onAuthStateChanged
            localStorage.setItem('currentUser', JSON.stringify({
              uid: user.uid,
              email: user.email,
              role: fullUserData.role || '',
            }));
          } else {
            // If profile doc is missing, the app can't determine role safely.
            // Sign out to avoid redirect loops and show the user the login card again.
            logger.warn('User found in Auth but not in Firestore; signing out to avoid role ambiguity');
            try { await firebaseSignOut(auth); } catch (_) {}
            setCurrentUser(null);
            setUserData(null);
            localStorage.removeItem('currentUser');
          }
        } catch (error) {
          logger.error('Error fetching user data:', error);
          // If we can't read the profile (rules/network), sign out to avoid infinite splash.
          try { await firebaseSignOut(auth); } catch (_) {}
          setCurrentUser(null);
          setUserData(null);
          localStorage.removeItem('currentUser');
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        localStorage.removeItem('currentUser');
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserData(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      logger.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
