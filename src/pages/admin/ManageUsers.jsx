import AdminLayout from '../../layouts/AdminLayout'

export default function ManageUsers() {
  const users = [
    { id: 1, name: 'Alex Rivera', email: 'alex@example.com', role: 'Admin', joined: '2025-10-15', lessons: 12 },
    { id: 2, name: 'Sara Lee', email: 'sara@example.com', role: 'User', joined: '2025-11-20', lessons: 5 },
    { id: 3, name: 'Maya Khan', email: 'maya@example.com', role: 'User', joined: '2025-12-01', lessons: 3 },
    { id: 4, name: 'John Smith', email: 'john@example.com', role: 'Moderator', joined: '2025-11-05', lessons: 8 }
  ]

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Role</th>
              <th className="px-6 py-3 text-left font-semibold">Lessons</th>
              <th className="px-6 py-3 text-left font-semibold">Joined</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'Moderator'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user.lessons}</td>
                <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="btn btn-sm btn-outline">View</button>
                  <button className="btn btn-sm btn-outline text-red-600 hover:bg-red-50">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
