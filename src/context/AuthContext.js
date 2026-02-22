import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthContext: Initializing Firebase Auth listener...');
    
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out');
      
      if (user) {
        // User is signed in
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            const fullUserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...firestoreData
            };
            
            setCurrentUser(user);
            setUserData(fullUserData);
            
            // Also store in localStorage for quick access
            localStorage.setItem('currentUser', JSON.stringify(fullUserData));
            
            console.log('✅ User authenticated:', fullUserData);
          } else {
            // User exists in Auth but not in Firestore
            console.warn('⚠️ User found in Auth but not in Firestore');
            const basicData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            };
            setCurrentUser(user);
            setUserData(basicData);
            localStorage.setItem('currentUser', JSON.stringify(basicData));
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          const basicData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          };
          setCurrentUser(user);
          setUserData(basicData);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserData(null);
        localStorage.removeItem('currentUser');
        console.log('ℹ️ No user logged in');
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
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
