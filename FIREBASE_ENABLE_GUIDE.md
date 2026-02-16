# 🔧 Firebase Configuration Guide

## ✅ Firebase Code Temporarily Commented Out

All Firebase-related code has been commented out in the following files to avoid compilation errors:

### Files Modified:
1. **`src/pages/ProfilePage.js`**
   - Firebase Auth imports
   - Firestore operations
   - User data fetching from Firebase
   - Profile update operations
   - Password change functionality

2. **`src/features/consumer/components/ProductReviews/ProductReviews.js`**
   - Firebase Auth imports
   - Firestore reviews collection
   - Review submission
   - Review fetching

---

## 📝 Mock Data Currently Used:

### ProfilePage:
```javascript
// Mock user data
{
  fullName: 'Demo User',
  email: 'demo@farm2home.com',
  phone: '+91 9876543210',
  addressLine: '123 Main Street',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500001',
  role: 'consumer',
  photoURL: ''
}
```

### ProductReviews:
```javascript
// Empty reviews array
reviews: []
```

---

## 🔓 How to Re-enable Firebase (After Getting API Keys):

### Step 1: Update Firebase Config
In `src/firebase.js`, add your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 2: Un-comment Code in ProfilePage.js

**Line ~7-9:** Uncomment imports
```javascript
// Remove // from these lines:
import { auth, db, doc, getDoc, updateDoc } from '../firebase';
import { updatePassword, updateEmail, updateProfile } from 'firebase/auth';
```

**Line ~38-70:** Uncomment `fetchUserData` function
Find this section and uncomment:
```javascript
// Remove all // comments from:
const user = auth.currentUser;
if (user) {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  // ... rest of the code
}
```

**Line ~100-125:** Uncomment `handleSaveProfile` function
```javascript
// Remove // from:
const user = auth.currentUser;
if (!user) return;
await updateProfile(user, { ... });
await updateDoc(doc(db, 'users', user.uid), { ... });
```

**Line ~135-160:** Uncomment `handleChangePassword` function
```javascript
// Remove // from:
const user = auth.currentUser;
await updatePassword(user, passwordData.newPassword);
```

### Step 3: Un-comment Code in ProductReviews.js

**Line ~3:** Uncomment imports
```javascript
// Remove // from:
import { db, collection, addDoc, getDocs, query, where, orderBy, auth } from '../../../../firebase';
```

**Line ~28-45:** Uncomment `fetchReviews` function
```javascript
// Remove all // comments from Firestore query code
```

**Line ~48-80:** Uncomment `handleSubmitReview` function
```javascript
// Remove // from Firebase review submission code
```

---

## 🚀 Quick Un-comment Commands:

### For ProfilePage.js:
1. Search for: `// import { auth, db`
2. Remove `//` from line
3. Search for: `// TODO: Uncomment when Firebase is configured`
4. Remove all `//` from Firebase-related code blocks

### For ProductReviews.js:
1. Search for: `// import { db, collection`
2. Remove `//` from line
3. Search for: `// TODO: Uncomment when Firebase is configured`
4. Remove all `//` from Firebase-related code blocks

---

## ✅ After Un-commenting:

1. **Test Firebase Connection:**
   ```bash
   npm start
   ```

2. **Check Console for Errors:**
   - Open browser DevTools (F12)
   - Look for Firebase initialization messages

3. **Test Features:**
   - Navigate to `/profile`
   - Try editing profile information
   - Submit a product review

---

## 🔒 Firebase Security Rules Needed:

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📌 Current Status:

- ✅ All new features work WITHOUT Firebase
- ✅ No compilation errors
- ✅ Mock data shows proper UI/UX
- ⏳ Firebase functionality ready to enable
- ⏳ Waiting for Firebase API keys

---

## 📞 Need Help?

When you get Firebase API keys, just:
1. Update `src/firebase.js` with your credentials
2. Follow the un-comment instructions above
3. Test the app

అన్ని features Firebase లేకుండా పని చేస్తాయి. మీరు API keys ఇచ్చినప్పుడు, comment చేసిన code ని uncomment చేయండి! 🚀
