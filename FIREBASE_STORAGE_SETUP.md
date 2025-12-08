# Firebase Storage Setup & Troubleshooting

## Problem: Images Not Uploading to Firebase Storage

### Step 1: Check Firebase Storage is Enabled
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. In the left menu, go to **Build** → **Storage**
4. If you see "Get Started", click it to enable Storage
5. Accept the security rules (we'll update them next)
6. Choose the location (default is fine)

### Step 2: Update Firebase Storage Security Rules
The default rules block uploads. You need to update them:

1. Go to **Storage** → **Rules** tab
2. Replace the entire content with this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload and read their own profile pictures
    match /profile-pictures/{uid}/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Allow authenticated users to read all lesson images
    match /lesson-images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

3. Click **Publish** to save the rules

### Step 3: Verify Your Environment Variables
Make sure your `.env.local` file has the correct Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Browser Console Check
1. Open your browser's Developer Tools (F12)
2. Go to **Console** tab
3. Try uploading a profile picture
4. Look for error messages that say:
   - `Permission denied` → Storage rules issue
   - `undefined is not a valid storage bucket` → Wrong STORAGE_BUCKET env var
   - `auth/invalid-api-key` → Wrong API key

### Step 5: Firestore Database (if needed)
If you also need to store lesson data:

1. Go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode**
4. Choose a location and create

### Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Permission denied` | Storage rules too restrictive | Update rules as shown above |
| `undefined storageBucket` | Missing env variable | Add `VITE_FIREBASE_STORAGE_BUCKET` to `.env.local` |
| `auth/invalid-api-key` | Wrong API key | Copy exact key from Firebase Console |
| Upload button appears stuck | Rules don't allow write access | Check `request.auth.uid` match |

### Verify Storage Works
After setting up rules, test with:

```javascript
// In browser console
import { storage } from './config/firebase.js'
import { ref, uploadBytes } from 'firebase/storage'

const testRef = ref(storage, 'test.txt')
console.log('Storage reference created:', testRef)
```

If the reference is created without error, storage is configured correctly.

### Need Help?
Check the browser's Network tab (F12 → Network) when uploading:
- Look for requests to `firebasestorage.googleapis.com`
- Check the response status (should be 200 OK)
- See the error message in the response if it fails
