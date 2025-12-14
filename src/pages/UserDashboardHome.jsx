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
    totalLikes: 0,
    recentLessons: [],
    weeklyContributions: []
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

  const formatWeekLabel = (isoDate) => {
    if (!isoDate) return ''
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 sm:py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
        <div className="card bg-base-100 shadow-lg mb-6 sm:mb-8">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
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

        {/* Weekly Analytics */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Weekly Reflections</h2>
              <span className="text-sm text-base-content/60">Last 8 weeks</span>
            </div>
            {stats.weeklyContributions && stats.weeklyContributions.length > 0 ? (
              <div className="space-y-3">
                {(() => {
                  const maxVal = Math.max(...stats.weeklyContributions.map(c => c.count), 1)
                  return stats.weeklyContributions.map((week) => {
                    const width = (week.count / maxVal) * 100
                    return (
                      <div key={week.weekStart} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-base-content/70">{formatWeekLabel(week.weekStart)}</div>
                        <div className="flex-1 h-3 bg-base-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-sm font-semibold text-base-content">{week.count}</div>
                      </div>
                    )
                  })
                })()}
              </div>
            ) : (
              <p className="text-base-content/60">No activity yet. Create your first lesson to see insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
