import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function UserDashboardHome() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalSaved: 0,
    recentLessons: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/user/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-semibold">Total Lessons</p>
                  <h2 className="text-4xl font-bold text-blue-700">{stats.totalLessons}</h2>
                </div>
                <div className="text-5xl">📚</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-semibold">Saved Favorites</p>
                  <h2 className="text-4xl font-bold text-purple-700">{stats.totalSaved}</h2>
                </div>
                <div className="text-5xl">🔖</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-semibold">Total Likes</p>
                  <h2 className="text-4xl font-bold text-green-700">{stats.totalLikes || 0}</h2>
                </div>
                <div className="text-5xl">❤️</div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Recent Lessons */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Recently Added Lessons</h2>
              <Link to="/dashboard/my-lessons" className="btn btn-sm btn-ghost">View All →</Link>
            </div>
            
            {stats.recentLessons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-base-content/60 mb-4">No lessons created yet</p>
                <Link to="/dashboard/add-lesson" className="btn btn-primary">
                  Create Your First Lesson
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recentLessons.map((lesson) => (
                  <div 
                    key={lesson._id} 
                    className="card bg-base-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/lesson/${lesson._id}`)}
                  >
                    <div className="card-body p-4">
                      <h3 className="font-semibold line-clamp-2">{lesson.title}</h3>
                      <p className="text-sm text-base-content/70 line-clamp-2">{lesson.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="badge badge-sm">{lesson.category}</span>
                        <span className="badge badge-sm badge-outline">{lesson.emotionalTone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
