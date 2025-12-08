import AdminLayout from '../../layouts/AdminLayout'

export default function Analytics() {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold mb-4 text-blue-900">Lessons Published Over Time</h3>
          <div className="h-40 bg-white rounded flex items-end justify-between px-4 gap-2">
            {[12, 8, 15, 10, 18, 14, 12].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${height * 5}px` }} />
            ))}
          </div>
          <div className="text-xs text-blue-700 mt-2 text-center">Last 7 days</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-bold mb-4 text-green-900">User Growth</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-2xl font-bold text-green-600">+12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-2xl font-bold text-green-600">+67</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-2xl font-bold text-green-600">89</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-bold mb-4 text-purple-900">Most Saved Lessons</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Mindful Mornings</span>
              <span className="font-bold text-purple-600">420</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Career Pivot Guide</span>
              <span className="font-bold text-purple-600">387</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Difficult Feedback</span>
              <span className="font-bold text-purple-600">332</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-bold mb-4 text-orange-900">Engagement Metrics</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Reads/Day</span>
              <span className="text-2xl font-bold text-orange-600">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Saves/Day</span>
              <span className="text-2xl font-bold text-orange-600">87</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-2xl font-bold text-orange-600">45</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
