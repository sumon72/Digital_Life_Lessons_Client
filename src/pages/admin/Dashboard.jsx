import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLessons: 142,
    totalUsers: 89,
    totalSaves: 1203,
    thisWeekLessons: 12
  })

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-blue-600 text-4xl mb-2">📚</div>
          <div className="text-sm text-gray-600">Total Lessons</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalLessons}</div>
        </div>

        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-green-600 text-4xl mb-2">👥</div>
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold text-green-600">{stats.totalUsers}</div>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-purple-600 text-4xl mb-2">💾</div>
          <div className="text-sm text-gray-600">Total Saves</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalSaves}</div>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-orange-600 text-4xl mb-2">✨</div>
          <div className="text-sm text-gray-600">This Week</div>
          <div className="text-2xl font-bold text-orange-600">{stats.thisWeekLessons}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">📝</div>
            <div className="flex-1">
              <div className="font-semibold">New lesson published</div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">👤</div>
            <div className="flex-1">
              <div className="font-semibold">New user registered</div>
              <div className="text-sm text-gray-500">4 hours ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">⭐</div>
            <div className="flex-1">
              <div className="font-semibold">Lesson saved by user</div>
              <div className="text-sm text-gray-500">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
