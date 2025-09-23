// mockFirebase.js - Standalone mock Firebase implementation

// Mock auth implementation
const createMockAuth = () => {
  console.log('Creating mock auth object');
  
  let currentUser = null;
  let authCallbacks = [];
  
  const updateAuthState = (user) => {
    currentUser = user;
    authCallbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(user);
      }
    });
  };
  
  return {
    get currentUser() {
      return currentUser;
    },
    onAuthStateChanged: (callback) => {
      console.log('Mock onAuthStateChanged called with callback:', typeof callback);
      
      authCallbacks.push(callback);
      
      // Immediately call with current user
      if (typeof callback === 'function') {
        setTimeout(() => callback(currentUser), 100);
      }
      
      // Return unsubscribe function
      return () => {
        console.log('Mock auth unsubscribe called');
        const index = authCallbacks.indexOf(callback);
        if (index > -1) {
          authCallbacks.splice(index, 1);
        }
      };
    },
    updateAuthState: updateAuthState
  };
};

// Create and export the mock auth
export const auth = createMockAuth();

// Mock database
export const db = {
  mock: true
};

// Mock Firebase Database functions
export const ref = (database, path) => {
  console.log('Mock ref called:', path);
  return { path, mock: true };
};

export const push = (reference, data) => {
  console.log('Mock push called:', data);
  return Promise.resolve({ key: `mock-key-${Date.now()}` });
};

export const set = (reference, data) => {
  console.log('Mock set called:', data);
  return Promise.resolve();
};

export const get = (reference) => {
  console.log('Mock get called');
  return Promise.resolve({
    exists: () => false,
    val: () => null,
    forEach: () => {}
  });
};

export const remove = (reference) => {
  console.log('Mock remove called');
  return Promise.resolve();
};

// Mock Auth functions
export class RecaptchaVerifier {
  constructor(...args) {
    console.log('Mock RecaptchaVerifier created with args:', args);
    this.verify = () => Promise.resolve();
  }
}

export const signInWithPhoneNumber = (authInstance, phone, verifier) => {
  console.log('Mock signInWithPhoneNumber called:', phone);
  return Promise.resolve({
    confirm: (code) => {
      console.log('Mock confirm called with code:', code);
      const user = { uid: `mock-uid-${Date.now()}`, phone, displayName: 'Mock User' };
      // Update auth state to simulate successful login
      setTimeout(() => {
        if (authInstance.updateAuthState) {
          authInstance.updateAuthState(user);
        }
      }, 100);
      return Promise.resolve({ user });
    }
  });
};

export const signInWithEmailAndPassword = (authInstance, email, password) => {
  console.log('Mock signInWithEmailAndPassword called:', email);
  const user = { uid: `mock-uid-${Date.now()}`, email, displayName: 'Mock User' };
  // Update auth state to simulate successful login
  setTimeout(() => {
    if (authInstance.updateAuthState) {
      authInstance.updateAuthState(user);
    }
  }, 100);
  return Promise.resolve({ user });
};

export const createUserWithEmailAndPassword = (authInstance, email, password) => {
  console.log('Mock createUserWithEmailAndPassword called:', email);
  const user = { uid: `mock-uid-${Date.now()}`, email, displayName: 'Mock User' };
  // Update auth state to simulate successful signup
  setTimeout(() => {
    if (authInstance.updateAuthState) {
      authInstance.updateAuthState(user);
    }
  }, 100);
  return Promise.resolve({ user });
};

// Mock Firestore functions
export const doc = (database, collection, id) => {
  console.log('Mock doc called:', collection, id);
  return { collection, id, mock: true };
};

export const setDoc = (docRef, data) => {
  console.log('Mock setDoc called:', data);
  return Promise.resolve();
};

export const getDoc = (docRef) => {
  console.log('Mock getDoc called');
  return Promise.resolve({
    exists: () => false,
    data: () => null
  });
};

console.log('Mock Firebase module loaded successfully');