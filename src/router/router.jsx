import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import ProtectedRoute from '../components/ProtectedRoute'
import Dashboard from '../pages/admin/Dashboard'
import ManageLessons from '../pages/admin/ManageLessons'
import ManageUsers from '../pages/admin/ManageUsers'
import Analytics from '../pages/admin/Analytics'
import Settings from '../pages/admin/Settings'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/managelessons',
        element: <ProtectedRoute><ManageLessons /></ProtectedRoute>,
      },
      {
        path: '/dashboard/users',
        element: <ProtectedRoute><ManageUsers /></ProtectedRoute>,
      },
      {
        path: '/dashboard/analytics',
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: '/dashboard/settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
    ],
  },
])
