import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

function Leaderboard() {
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to top users by points
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(10) // Show top 10 users
    )

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTopUsers(usersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <p>Top study goal achievers!</p>
      
      {topUsers.length === 0 ? (
        <p>No users found. Be the first to complete a goal!</p>
      ) : (
        <div className="leaderboard-list">
          {topUsers.map((user, index) => (
            <div key={user.id} className={`leaderboard-item rank-${index + 1}`}>
              <div className="rank">#{index + 1}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-points">{user.points} points</span>
              </div>
              {index === 0 && <span className="crown">👑</span>}
              {index === 1 && <span className="medal">🥈</span>}
              {index === 2 && <span className="medal">🥉</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard