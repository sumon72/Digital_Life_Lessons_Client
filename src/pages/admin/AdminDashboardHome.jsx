import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/api'
import toast from 'react-hot-toast'

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    publicLessons: 0,
    privateLessons: 0,
    premiumLessons: 0,
    reportedLessons: 0,
    todayNewLessons: 0,
    activeContributors: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      toast.error('Failed to load admin statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-semibold">Total Users</p>
                  <h2 className="text-4xl font-bold text-blue-700">{stats.totalUsers}</h2>
                </div>
                <div className="text-5xl">👥</div>
              </div>
              <Link to="/dashboard/admin/users" className="btn btn-sm btn-ghost mt-2">
                Manage Users →
              </Link>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-semibold">Total Lessons</p>
                  <h2 className="text-4xl font-bold text-purple-700">{stats.totalLessons}</h2>
                </div>
                <div className="text-5xl">📚</div>
              </div>
              <Link to="/dashboard/admin/lessons" className="btn btn-sm btn-ghost mt-2">
                Manage Lessons →
              </Link>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-semibold">Reported Lessons</p>
                  <h2 className="text-4xl font-bold text-red-700">{stats.reportedLessons}</h2>
                </div>
                <div className="text-5xl">🚩</div>
              </div>
              <Link to="/dashboard/admin/reported" className="btn btn-sm btn-ghost mt-2">
                View Reports →
              </Link>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-semibold">Today's New Lessons</p>
                  <h2 className="text-4xl font-bold text-green-700">{stats.todayNewLessons}</h2>
                </div>
                <div className="text-5xl">✨</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Public Lessons</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.publicLessons}</span>
                <span className="badge badge-success">🌍 Public</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Private Lessons</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.privateLessons}</span>
                <span className="badge badge-ghost">🔒 Private</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Premium Lessons</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.premiumLessons}</span>
                <span className="badge badge-warning">⭐ Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">🏆 Most Active Contributors</h2>
            {stats.activeContributors && stats.activeContributors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Lessons Created</th>
                      <th>Total Likes</th>
                      <th>Total Saves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.activeContributors.map((contributor, index) => (
                      <tr key={contributor._id}>
                        <td>
                          <span className="font-bold text-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="w-10 h-10 rounded-full bg-primary text-primary-content">
                                <span>{contributor.displayName?.[0] || 'U'}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{contributor.displayName || 'Anonymous'}</div>
                              <div className="text-xs text-base-content/60">{contributor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{contributor.lessonCount}</span></td>
                        <td><span className="text-red-500">❤️ {contributor.totalLikes || 0}</span></td>
                        <td><span className="text-blue-500">🔖 {contributor.totalSaves || 0}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/60">
                No active contributors yet
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
