import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore'

function Home() {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    if (!auth.currentUser) return

    // Listen to user's goals
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setGoals(goalsData)
    })

    // Listen to user's points
    const userDoc = doc(db, 'users', auth.currentUser.uid)
    const unsubscribeUser = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        setUserPoints(doc.data().points || 0)
      }
    })

    return () => {
      unsubscribe()
      unsubscribeUser()
    }
  }, [])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!newGoal.trim()) return

    try {
      await addDoc(collection(db, 'goals'), {
        title: newGoal,
        userId: auth.currentUser.uid,
        completed: false,
        createdAt: new Date()
      })
      setNewGoal('')
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const completeGoal = async (goalId) => {
    try {
      // Update goal to completed
      await updateDoc(doc(db, 'goals', goalId), {
        completed: true,
        completedAt: new Date()
      })

      // Add 10 points to user
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        points: increment(10)
      })
    } catch (error) {
      console.error('Error completing goal:', error)
    }
  }

  return (
    <div className="home-container">
      <div className="user-info">
        <h2>Welcome, {auth.currentUser?.displayName}!</h2>
        <p className="points">Your Points: {userPoints}</p>
      </div>

      <div className="goal-form">
        <h3>Add New Goal</h3>
        <form onSubmit={addGoal}>
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter your study goal..."
            required
          />
          <button type="submit">Add Goal</button>
        </form>
      </div>

      <div className="goals-list">
        <h3>Your Goals</h3>
        {goals.length === 0 ? (
          <p>No goals yet. Add your first goal above!</p>
        ) : (
          <div className="goals">
            {goals.map((goal) => (
              <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <span className="goal-title">{goal.title}</span>
                {goal.completed ? (
                  <span className="completed-badge">✓ Completed (+10 points)</span>
                ) : (
                  <button 
                    className="complete-btn"
                    onClick={() => completeGoal(goal.id)}
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home