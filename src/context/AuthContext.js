import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';

console.log('AuthContext loaded, auth object:', auth);

// Only import Firebase auth functions when using real Firebase
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect running, auth:', auth);
    console.log('auth.onAuthStateChanged:', auth?.onAuthStateChanged);
    
    if (!auth || !auth.onAuthStateChanged) {
      console.error('Auth object or onAuthStateChanged is undefined!');
      setLoading(false);
      return;
    }
    
    // Using mock auth for development
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      if (user) {
        // Get stored user role from localStorage for mock authentication
        const storedUserData = localStorage.getItem('mockUserData');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUserData(userData);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            // Fallback to default farmer role
            setUserData({
              role: 'farmer',
              name: 'Demo User',
              email: user.email || 'demo@example.com'
            });
          }
        } else {
          // Fallback user data for development if no stored data
          setUserData({
            role: 'farmer', // Default role
            name: 'Demo User',
            email: user.email || 'demo@example.com'
          });
        }
      } else {
        setUserData(null);
        // Clear stored user data when user logs out
        localStorage.removeItem('mockUserData');
        localStorage.removeItem('mockUserRole');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
