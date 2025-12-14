import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function MyLessons() {
  const { user, userPlan } = useUser()
  const [lessons, setLessons] = useState([])
  const [filter, setFilter] = useState('all') // all, public, private, free, premium
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // create, edit, view
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Personal',
    emotionalTone: 'Hopeful',
    featuredImage: '',
    privacy: 'public',
    accessLevel: 'free'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['Personal', 'Work', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']

  // Fetch lessons on mount and when user changes
  useEffect(() => {
    if (user?._id) {
      fetchMyLessons()
    }
  }, [user?._id])

  const fetchMyLessons = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.email) {
        setLessons([])
        return
      }

      const response = await api.get(`/lessons/author-email/${encodeURIComponent(user.email)}`)
      const lessonsData = Array.isArray(response.data?.lessons) ? response.data.lessons : (response.data || [])
      setLessons(lessonsData)
    } catch (err) {
      const errorMsg = 'Failed to fetch lessons: ' + (err.response?.data?.error || err.message)
      setError(errorMsg)
      console.error('Error fetching lessons:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter lessons
  const getFilteredLessons = () => {
    if (filter === 'all') return lessons
    if (filter === 'public') return lessons.filter(l => l.privacy === 'public')
    if (filter === 'private') return lessons.filter(l => l.privacy === 'private')
    if (filter === 'free') return lessons.filter(l => l.accessLevel === 'free')
    if (filter === 'premium') return lessons.filter(l => l.accessLevel === 'premium')
    return lessons
  }

  // CRUD: CREATE
  const handleCreate = () => {
    setModalMode('create')
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'Personal',
      emotionalTone: 'Hopeful',
      featuredImage: '',
      privacy: 'public',
      accessLevel: 'free'
    })
    setSelectedLesson(null)
    setShowModal(true)
  }

  // CRUD: READ (View)
  const handleView = (lesson) => {
    setModalMode('view')
    setSelectedLesson(lesson)
    setFormData(lesson)
    setShowModal(true)
  }

  // CRUD: UPDATE
  const handleEdit = (lesson) => {
    setModalMode('edit')
    setSelectedLesson(lesson)
    setFormData(lesson)
    setShowModal(true)
  }

  // CRUD: DELETE
  const handleDelete = async (id) => {
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
      const loadingToast = toast.loading('Deleting lesson...')
      try {
        await api.delete(`/lessons/${id}`)
        setLessons(lessons.filter(l => l._id !== id))
        toast.success('Lesson deleted successfully', { id: loadingToast })
      } catch (err) {
        toast.error('Failed to delete lesson: ' + (err.response?.data?.error || err.message), { id: loadingToast })
        console.error('Error deleting lesson:', err)
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    // Check premium access level permission
    if (formData.accessLevel === 'premium' && !userPlan?.isPremium) {
      toast.error('Upgrade to Premium to create premium lessons')
      return
    }

    const loadingToast = toast.loading(modalMode === 'create' ? 'Creating lesson...' : 'Updating lesson...')

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        emotionalTone: formData.emotionalTone,
        featuredImage: formData.featuredImage,
        privacy: formData.privacy,
        accessLevel: formData.accessLevel,
        author: user._id,
        authorName: user.displayName || user.email,
        authorEmail: user.email,
        authorPhotoURL: user.photoURL || ''
      }

      if (modalMode === 'create') {
        const response = await api.post('/lessons', payload)
        setLessons([response.data, ...lessons])
        setShowModal(false)
        toast.success('Lesson created successfully', { id: loadingToast })
      } else if (modalMode === 'edit') {
        const response = await api.put(`/lessons/${selectedLesson._id}`, payload)
        setLessons(lessons.map(l => l._id === selectedLesson._id ? response.data : l))
        setShowModal(false)
        toast.success('Lesson updated successfully', { id: loadingToast })
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      toast.error(err.response?.data?.error || 'Failed to save the lesson.', { id: loadingToast })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const filteredLessons = getFilteredLessons()
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
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
        <h2 className="text-3xl font-bold">My Lessons</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Add Lesson
        </button>
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
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({lessons.length})
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'public'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Public ({lessons.filter(l => l.privacy === 'public').length})
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'private'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Private ({lessons.filter(l => l.privacy === 'private').length})
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'free'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Free ({lessons.filter(l => l.accessLevel === 'free').length})
            </button>
            <button
              onClick={() => setFilter('premium')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'premium'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Premium ({lessons.filter(l => l.accessLevel === 'premium').length})
            </button>
          </div>

          {/* Lessons Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Image</th>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Privacy</th>
                  <th className="px-6 py-3 text-left font-semibold">Access</th>
                  <th className="px-6 py-3 text-left font-semibold">Stats</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLessons.length > 0 ? (
                  filteredLessons.map(lesson => (
                    <tr key={lesson._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {lesson.featuredImage ? (
                          <img 
                            src={lesson.featuredImage} 
                            alt={lesson.title}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
                            <span className="text-2xl">📚</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium truncate max-w-xs">
                        <div className="truncate">{lesson.title}</div>
                        <div className="text-xs text-gray-500 truncate">{lesson.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-sm">{lesson.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lesson.privacy === 'public'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {lesson.privacy === 'public' ? '🌍 Public' : '🔒 Private'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lesson.accessLevel === 'premium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {lesson.accessLevel === 'premium' ? '⭐ Premium' : '🆓 Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="space-y-1">
                          <div>❤️ {formatNumber(lesson.likesCount || 0)}</div>
                          <div>🔖 {formatNumber(lesson.savedCount || 0)}</div>
                          <div>👀 {formatNumber(lesson.viewCount || 0)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(lesson.createdAt)}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleView(lesson)}
                          className="btn btn-sm btn-ghost"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(lesson)}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No lessons found
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
                {modalMode === 'create' && 'Add Lesson'}
                {modalMode === 'edit' && 'Edit Lesson'}
                {modalMode === 'view' && 'View Lesson'}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <p className="text-gray-900">{user?.displayName || user?.email || 'Anonymous'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Email</label>
                    <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Photo</label>
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900">{formData.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Emotional Tone</label>
                    <p className="text-gray-900">{formData.emotionalTone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Privacy</label>
                    <p className="text-gray-900">{formData.privacy === 'public' ? '🌍 Public' : '🔒 Private'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Access Level</label>
                    <p className="text-gray-900">{formData.accessLevel === 'premium' ? '⭐ Premium' : '🆓 Free'}</p>
                  </div>
                  {formData.featuredImage && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image</label>
                      <img src={formData.featuredImage} alt="Featured" className="max-w-xs rounded-lg" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.content}</p>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Author</label>
                    <input
                      type="text"
                      value={user?.displayName || user?.email || 'Anonymous'}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Author Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      placeholder="No email available"
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Author Photo URL</label>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={user?.photoURL || ''}
                          disabled
                          placeholder="No photo URL available"
                          className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex-shrink-0">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-lg object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xl">
                            {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter lesson title"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter lesson description (2-3 sentences)"
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Emotional Tone *</label>
                      <select
                        name="emotionalTone"
                        value={formData.emotionalTone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        {tones.map(tone => (
                          <option key={tone} value={tone}>{tone}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Featured Image URL (Optional)</label>
                    <input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formData.featuredImage && (
                      <img src={formData.featuredImage} alt="Preview" className="max-w-xs mt-2 rounded-lg" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Privacy *</label>
                      <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="public">🌍 Public</option>
                        <option value="private">🔒 Private</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Access Level *
                        {!userPlan?.isPremium && <span className="badge badge-warning badge-sm ml-2">Premium Feature</span>}
                      </label>
                      <select
                        name="accessLevel"
                        value={formData.accessLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="free">🆓 Free</option>
                        <option value="premium" disabled={!userPlan?.isPremium}>
                          ⭐ Premium {!userPlan?.isPremium && '(Upgrade Required)'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Enter full lesson content / story"
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
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
                      {modalMode === 'create' ? 'Add Lesson' : 'Save Changes'}
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
