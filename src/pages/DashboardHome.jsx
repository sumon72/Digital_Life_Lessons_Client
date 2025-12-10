import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import UserDashboardHome from './UserDashboardHome'
import AdminLayout from '../layouts/AdminLayout'

export default function DashboardHome() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Route based on user role
  if (user.role === 'admin') {
    return <AdminLayout />
  }

  return <UserDashboardHome />
}
