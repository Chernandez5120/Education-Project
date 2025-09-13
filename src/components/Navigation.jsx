import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

function Navigation() {
  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Study Habit Gamifier</h2>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navigation