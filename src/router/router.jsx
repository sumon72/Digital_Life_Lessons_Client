import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import LessonDetail from '../pages/LessonDetail'
import PublicLessons from '../pages/PublicLessons'
import Pricing from '../pages/Pricing'
import PaymentSuccess from '../pages/PaymentSuccess'
import PaymentCancel from '../pages/PaymentCancel'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'
import Dashboard from '../pages/admin/Dashboard'
import AddLesson from '../pages/admin/AddLesson'
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
        path: '/public-lessons',
        element: <PublicLessons />,
      },
      {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: '/lessons/:id',
        element: <ProtectedRoute><LessonDetail /></ProtectedRoute>,
      },
      {
        path: '/pricing',
        element: <ProtectedRoute><Pricing /></ProtectedRoute>,
      },
      {
        path: '/payment/success',
        element: <ProtectedRoute><PaymentSuccess /></ProtectedRoute>,
      },
      {
        path: '/payment/cancel',
        element: <ProtectedRoute><PaymentCancel /></ProtectedRoute>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/add-lesson',
        element: <ProtectedRoute><AdminRoute><AddLesson /></AdminRoute></ProtectedRoute>,
      },
      {
        path: '/dashboard/users',
        element: <ProtectedRoute><AdminRoute><ManageUsers /></AdminRoute></ProtectedRoute>,
      },
      {
        path: '/dashboard/analytics',
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: '/dashboard/settings',
        element: <ProtectedRoute><AdminRoute><Settings /></AdminRoute></ProtectedRoute>,
      },
    ],
  },
])
