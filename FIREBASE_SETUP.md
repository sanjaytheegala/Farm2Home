# Firebase Setup Guide for Farm2Home

## 🔥 Firebase Configuration Complete!

Your Firebase project is now configured with the following details:
- **Project ID**: farm2home-4a7a2
- **Database URL**: https://farm2home-4a7a2-default-rtdb.firebaseio.com
- **Auth Domain**: farm2home-4a7a2.firebaseapp.com

## 📋 Next Steps

### 1. Set up Firebase Realtime Database Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `farm2home-4a7a2` project
3. Navigate to **Realtime Database** → **Rules**
4. Copy the rules from `firebase-rules.json` in your project root
5. Publish the rules

### 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following:
   - **Email/Password** ✅
   - **Phone** ✅ (for OTP verification)

### 3. Configure Phone Authentication

1. In **Authentication** → **Sign-in method** → **Phone**
2. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain when deploying

### 4. Test the Connection

Run your application to test Firebase integration:

```bash
npm start
```

### 5. Database Structure

Your app will create these collections:
```
/
├── users/{uid}/
│   ├── role: "farmer" | "consumer"
│   ├── email: string
│   └── createdAt: timestamp
├── crops/{cropId}/
│   ├── crop: string
│   ├── quantity: string
│   ├── price: string
│   ├── status: "available" | "sold" | "reserved"
│   ├── state: string
│   ├── district: string
│   └── createdAt: timestamp
├── orders/{orderId}/
│   ├── items: array
│   ├── timestamp: number
│   ├── otp: number
│   └── status: string
└── shared_resources/{resourceId}/
    ├── title: string
    ├── description: string
    └── ownerId: string
```

## 🔒 Security Features

- ✅ User data is protected (users can only access their own data)
- ✅ Authenticated users can read all crops (for browsing)
- ✅ Only authenticated users can create/edit their own crops
- ✅ Orders are protected and only visible to involved parties
- ✅ Basic validation for required fields

## 🚀 Production Deployment

When ready to deploy:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting** (optional):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 📊 Analytics

Firebase Analytics is already enabled and will track:
- User engagement
- Popular features
- App performance
- User demographics

## ⚠️ Important Notes

- **API Key is public**: This is normal for web apps, security is handled by Firebase rules
- **Database Rules**: Start with basic rules provided, refine based on your needs
- **Phone Auth**: Requires domain verification in production
- **Rate Limits**: Firebase has usage limits; monitor in Console

## 🛠️ Troubleshooting

**Common Issues:**
1. **CORS errors**: Add your domain to authorized domains
2. **Phone auth fails**: Check if phone provider is enabled
3. **Database permission denied**: Verify your security rules
4. **Analytics not working**: Check if domain is added to Firebase project

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify Firebase configuration matches console settings

---

Your Farm2Home app is now ready to use real Firebase! 🌱✨