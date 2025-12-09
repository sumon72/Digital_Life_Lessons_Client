import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { user, loading, refreshUser } = useUser()

  // Sync user plan from MongoDB on every protected route access
  useEffect(() => {
    if (user && refreshUser) {
      refreshUser()
    }
  }, [user?.email]) // Only re-sync if email changes (new user login)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
