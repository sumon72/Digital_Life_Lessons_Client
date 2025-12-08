import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import ProtectedRoute from '../components/ProtectedRoute'

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
      // Protected routes will be added below
      // {
      //   path: '/dashboard',
      //   element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      // },
      // {
      //   path: '/dashboard/my-lessons',
      //   element: <ProtectedRoute><MyLessons /></ProtectedRoute>,
      // },
      // {
      //   path: '/dashboard/add-lesson',
      //   element: <ProtectedRoute><AddLesson /></ProtectedRoute>,
      // },
    ],
  },
])
