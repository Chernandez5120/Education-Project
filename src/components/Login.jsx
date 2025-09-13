import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

function Login() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          points: 0,
          createdAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Study Habit Gamifier</h1>
        <p>Track your study goals and compete with friends!</p>
        <button 
          className="google-signin-btn" 
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Login