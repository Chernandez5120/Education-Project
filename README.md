# Study Habit Gamifier

A React application built with Vite that helps users track study goals and compete with friends through a gamified point system.

## Features

- **Firebase Authentication**: Google Sign-In integration
- **Goal Management**: Add, list, and complete study goals
- **Point System**: Earn 10 points for each completed goal
- **Leaderboard**: Compete with friends and see top achievers
- **Real-time Updates**: Live updates using Firestore
- **Responsive Design**: Clean, simple UI that works on all devices

## Technologies Used

- React 19
- Vite 7
- Firebase (Authentication & Firestore)
- React Router DOM
- CSS3 with modern styling

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd Education-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Get your Firebase config from Project Settings
5. Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules
Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read all user documents (for leaderboard)
    match /users/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Users can manage their own goals
    match /goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Run the application
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## How to Use

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Goals**: Enter study goals in the home page
3. **Complete Goals**: Mark goals as complete to earn 10 points each
4. **View Leaderboard**: See how you rank against other users
5. **Track Progress**: Watch your points grow as you complete more goals

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Google Sign-In page
│   ├── Home.jsx           # Goal management dashboard
│   ├── Leaderboard.jsx    # User rankings
│   └── Navigation.jsx     # App navigation
├── firebase.js            # Firebase configuration
├── App.jsx               # Main app with routing
├── App.css               # Application styles
└── main.jsx              # React entry point
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
