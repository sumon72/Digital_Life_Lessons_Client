import { useState, useEffect } from 'react'
import api from '../../config/api'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/users')
      setUsers(response.data || [])

    } catch (err) {
      const errorMsg = 'Failed to fetch users: ' + (err.response?.data?.error || err.message)
      setError(errorMsg)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // CRUD: CREATE
  const handleCreate = () => {
    setModalMode('create')
    setFormData({ displayName: '', email: '', photoURL: '', role: 'user' })
    setSelectedUser(null)
    setShowModal(true)
  }

  // CRUD: READ (View)
  const handleView = (user) => {
    setModalMode('view')
    setSelectedUser(user)
    setFormData(user)
    setShowModal(true)
  }

  // CRUD: UPDATE
  const handleEdit = (user) => {
    // Prevent editing the main admin user
    if (user.email === 'admin@gmail.com') {
      toast.error('Cannot edit the main admin account')
      return
    }

    setModalMode('edit')
    setSelectedUser(user)
    setFormData(user)
    setShowModal(true)
  }

  // CRUD: DELETE
  const handleDelete = async (id) => {
    const user = users.find(u => u._id === id)

    // Prevent deleting the main admin user
    if (user?.email === 'admin@gmail.com') {
      toast.error('Cannot delete the main admin account')
      return
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      const loadingToast = toast.loading('Deleting user...')
      try {
        await api.delete(`/users/${id}`)
        setUsers(users.filter(u => u._id !== id))
        toast.success('User deleted successfully', { id: loadingToast })
      } catch (err) {
        toast.error('Failed to delete user: ' + (err.response?.data?.error || err.message), { id: loadingToast })
        console.error('Error deleting user:', err)
      }
    }
  }

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    const user = users.find(u => u._id === userId)

    // Prevent changing role of main admin user
    if (user?.email === 'admin@gmail.com') {
      toast.error('Cannot change the role of the main admin account')
      return
    }

    const loadingToast = toast.loading('Updating role...')
    try {
      const response = await api.put(`/users/${userId}`, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: newRole
      })

      setUsers(users.map(u => u._id === userId ? response.data : u))
      toast.success('Role updated successfully', { id: loadingToast })
    } catch (err) {
      toast.error('Failed to update role: ' + (err.response?.data?.error || err.message), { id: loadingToast })
      console.error('Error updating role:', err)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.displayName || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    const loadingToast = toast.loading(modalMode === 'create' ? 'Creating user...' : 'Updating user...')

    try {
      if (modalMode === 'create') {
        const response = await api.post('/users', {
          displayName: formData.displayName,
          email: formData.email,
          photoURL: formData.photoURL,
          role: formData.role
        })

        setUsers([response.data, ...users])
        setShowModal(false)
        setFormData({ displayName: '', email: '', photoURL: '', role: 'user' })
        toast.success('User created successfully', { id: loadingToast })

      } else if (modalMode === 'edit') {
        const response = await api.put(`/users/${selectedUser._id}`, {
          displayName: formData.displayName,
          photoURL: formData.photoURL,
          role: formData.role
        })

        setUsers(users.map(u => u._id === selectedUser._id ? response.data : u))
        setShowModal(false)
        setFormData({ displayName: '', email: '', photoURL: '', role: 'user' })
        toast.success('User updated successfully', { id: loadingToast })

      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      toast.error('Failed to save user: ' + (err.response?.data?.error || err.message), { id: loadingToast })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'user':
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Manage Users</h2>
        {/* <button onClick={handleCreate} className="btn btn-primary">
          ➕ Add User
        </button> */}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xl font-bold">✕</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Filter Buttons */}
          <div className="mb-6 flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setFilter('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'admin'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Admin ({users.filter(u => u.role === 'admin').length})
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              User ({users.filter(u => u.role === 'user').length})
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Photo</th>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  <th className="px-6 py-3 text-left font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                            {user.displayName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{user.displayName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                            {user.role?.toUpperCase() || 'USER'}
                          </span>
                          {user.email === 'admin@gmail.com' ? (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">Protected</span>
                          ) : (
                            <select
                              value={user.role || 'user'}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="text-xs px-2 py-1 border rounded cursor-pointer"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.createdAt?.split('T')[0] || 'N/A'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleView(user)}
                          className="btn btn-sm btn-ghost"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className={`btn btn-sm btn-outline ${user.email === 'admin@gmail.com'
                              ? 'btn-disabled opacity-50 cursor-not-allowed'
                              : 'btn-primary'
                            }`}
                          disabled={user.email === 'admin@gmail.com'}
                          title={user.email === 'admin@gmail.com' ? 'Protected account' : 'Edit'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className={`btn btn-sm btn-outline ${user.email === 'admin@gmail.com'
                              ? 'btn-disabled opacity-50 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-50'
                            }`}
                          disabled={user.email === 'admin@gmail.com'}
                          title={user.email === 'admin@gmail.com' ? 'Protected account' : 'Delete'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Add New User'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'view' && 'View User'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalMode === 'view' ? (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{formData.displayName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900 capitalize">{formData.role || 'user'}</p>
                  </div>
                  {formData.photoURL && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
                      <img src={formData.photoURL} alt={formData.displayName} className="w-24 h-24 rounded-lg object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Enter user name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={modalMode === 'edit'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter user email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={modalMode === 'edit'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Photo URL</label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL || ''}
                      onChange={handleChange}
                      placeholder="Enter photo URL"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role || 'user'}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
