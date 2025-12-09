import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useUser()

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

  // Check if user has admin role
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
