import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/api'
import toast from 'react-hot-toast'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  const [growthData, setGrowthData] = useState({
    lessonGrowth: [],
    userGrowth: []
  })
  const [loading, setLoading] = useState(true)
  const [contribPage, setContribPage] = useState(1)
  const contribPageSize = 5

  useEffect(() => {
    // Reset to first page when contributors change
    setContribPage(1)
  }, [stats.activeContributors])

  useEffect(() => {
    fetchAdminStats()
    fetchGrowthAnalytics()
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

  const fetchGrowthAnalytics = async () => {
    try {
      const response = await api.get('/admin/growth-analytics')
      setGrowthData(response.data)
    } catch (err) {
      console.error('Error fetching growth analytics:', err)
      console.log('Growth analytics fetch failed - continuing without charts')
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


      {/* Growth Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Lesson Growth Chart */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">📊 Lesson Growth (Last 30 Days)</h2>
            </div>
            {growthData.lessonGrowth && growthData.lessonGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData.lessonGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1.5, stroke: '#2563eb', fill: '#eff6ff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#1d4ed8', fill: '#bfdbfe' }}
                    name="Lessons Created"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-base-content/60 text-center py-8">No lesson data available</p>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">👥 User Growth (Last 30 Days)</h2>
            </div>
            {growthData.userGrowth && growthData.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1.5, stroke: '#059669', fill: '#ecfdf3' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#047857', fill: '#d1fae5' }}
                    name="Users Registered"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-base-content/60 text-center py-8">No user data available</p>
            )}
          </div>
        </div>
      </div>
      {/* Top Contributors */}
      {/* <div className="card bg-base-100 shadow-lg">
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
                  {stats.activeContributors
                    .slice((contribPage - 1) * contribPageSize, (contribPage - 1) * contribPageSize + contribPageSize)
                    .map((contributor, index) => {
                      const globalIndex = (contribPage - 1) * contribPageSize + index
                      const rankLabel = globalIndex === 0
                        ? '🥇'
                        : globalIndex === 1
                          ? '🥈'
                          : globalIndex === 2
                            ? '🥉'
                            : `#${globalIndex + 1}`
                      return (
                        <tr key={contributor._id}>
                          <td>
                            <span className="font-bold text-lg">
                              {rankLabel}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring ring-primary/20 overflow-hidden">
                                  {contributor.photoURL ? (
                                    <img src={contributor.photoURL} alt={contributor.displayName || contributor.email || 'User'} />
                                  ) : (
                                    <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                                      <span>{contributor.displayName?.[0] || 'U'}</span>
                                    </div>
                                  )}
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
                      )
                    })}
                </tbody>
              </table>
              {(() => {
                const total = stats.activeContributors.length
                const start = (contribPage - 1) * contribPageSize
                const end = Math.min(start + contribPageSize, total)
                const totalPages = Math.ceil(total / contribPageSize)
                return (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-base-content/70">
                      Showing <span className="font-semibold">{start + 1}</span>–<span className="font-semibold">{end}</span> of <span className="font-semibold">{total}</span>
                    </div>
                    <div className="join">
                      <button
                        className="join-item btn btn-sm btn-outline"
                        disabled={contribPage === 1}
                        onClick={() => setContribPage(p => Math.max(p - 1, 1))}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`join-item btn btn-sm ${contribPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setContribPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="join-item btn btn-sm btn-outline"
                        disabled={contribPage === totalPages}
                        onClick={() => setContribPage(p => Math.min(p + 1, totalPages))}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              No active contributors yet
            </div>
          )}
        </div>
      </div> */}
    </div>
  )
}
