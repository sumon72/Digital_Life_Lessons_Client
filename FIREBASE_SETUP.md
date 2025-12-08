# Firebase Setup Guide

## Steps to Fix the Firebase Configuration

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "Digital Life Lessons"
4. Disable Google Analytics (optional)
5. Create the project

### 2. Enable Authentication
1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Save

### 3. Get Your API Credentials
1. Go to **Project Settings** (gear icon)
2. Select the **General** tab
3. Scroll to "Your apps" section
4. Click **Web** (or create a web app if not exists)
5. Copy the Firebase config object

### 4. Create `.env.local` File
In the root of `Digital_Life_Lessons_Client` folder, create a `.env.local` file with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace each value with the actual credentials from your Firebase project.

### 5. Restart Dev Server
Once you've created `.env.local`, restart the dev server:
```powershell
npm.cmd run dev
```

## Running the Application

```powershell
cd "e:\programming hero\assaignment11\Digital_Life_Lessons_Client"
npm.cmd run dev
```

The application will be available at `http://localhost:3000`

## Verify the Setup
- Navigate to `/login` or `/register`
- You should see the authentication pages without errors
- Firebase should now be initialized correctly
