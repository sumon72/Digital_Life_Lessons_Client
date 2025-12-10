import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import AdminLayout from '../layouts/AdminLayout'
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
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'
import AuthorLessons from '../pages/AuthorLessons'

// Dashboard Components
import DashboardHome from '../pages/DashboardHome'
import UserDashboardHome from '../pages/UserDashboardHome'
import MyLessons from '../pages/MyLessons'
import MyFavorites from '../pages/MyFavorites'
import AddEditLesson from '../pages/AddEditLesson'

// Admin Components
import AdminDashboardHome from '../pages/admin/AdminDashboardHome'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageLessons from '../pages/admin/ManageLessons'
import ReportedLessons from '../pages/admin/ReportedLessons'
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
        path: '/author/:authorName',
        element: <AuthorLessons />,
      },
      {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: '/lesson/:id',
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
      // Dashboard Routes
      {
        path: '/dashboard',
        element: <ProtectedRoute><DashboardHome /></ProtectedRoute>,
      },
      {
        path: '/dashboard/my-lessons',
        element: <ProtectedRoute><MyLessons /></ProtectedRoute>,
      },
      {
        path: '/dashboard/my-favorites',
        element: <ProtectedRoute><MyFavorites /></ProtectedRoute>,
      },
      {
        path: '/dashboard/add-lesson',
        element: <ProtectedRoute><AddEditLesson /></ProtectedRoute>,
      },
      {
        path: '/dashboard/edit-lesson/:id',
        element: <ProtectedRoute><AddEditLesson /></ProtectedRoute>,
      },
      // Admin Routes
      {
        path: '/dashboard/admin',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <AdminDashboardHome />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/admin/users',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/admin/lessons',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <ManageLessons />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/admin/reported',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <ReportedLessons />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/admin/settings',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
