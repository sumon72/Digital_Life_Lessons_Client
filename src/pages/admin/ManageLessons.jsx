import { useState, useEffect } from 'react'
import api from '../../config/api'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { getSwalThemeConfig } from '../../utils/sweetAlertTheme'

export default function ManageLessons() {
  const [lessons, setLessons] = useState([])
  const [filter, setFilter] = useState('all') // all, public, private, free, premium
  const [statusFilter, setStatusFilter] = useState('all') // all, published, draft
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
    accessLevel: 'free',
    status: 'draft',
    authorName: '',
    authorPhotoURL: '',
    authorEmail: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['Personal', 'Work', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/lessons')
      setLessons(response.data || [])
    } catch (err) {
      const errorMsg = 'Failed to fetch lessons: ' + (err.response?.data?.error || err.message)
      setError(errorMsg)
      console.error('Error fetching lessons:', err)
    } finally {
      setLoading(false)
    }
  }

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
      accessLevel: 'free',
      status: 'draft',
      authorName: '',
      authorPhotoURL: '',
      authorEmail: ''
    })
    setSelectedLesson(null)
    setShowModal(true)
  }

  const handleView = (lesson) => {
    setModalMode('view')
    setSelectedLesson(lesson)
    setFormData(lesson)
    setShowModal(true)
  }

  const handleEdit = (lesson) => {
    setModalMode('edit')
    setSelectedLesson(lesson)
    setFormData(lesson)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      ...getSwalThemeConfig()
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

  const handleSubmit = async (e) => {
    e.preventDefault()

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
        status: formData.status,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail || '',
        authorPhotoURL: formData.authorPhotoURL || ''
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

  const filteredLessons = lessons.filter((lesson) => {
    const privacyMatch =
      filter === 'all'
        ? true
        : filter === 'public'
          ? lesson.privacy === 'public'
          : filter === 'private'
            ? lesson.privacy === 'private'
            : filter === 'free'
              ? lesson.accessLevel === 'free'
              : filter === 'premium'
                ? lesson.accessLevel === 'premium'
                : true

    const statusMatch = statusFilter === 'all' ? true : lesson.status === statusFilter
    return privacyMatch && statusMatch
  })

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
        <h2 className="text-3xl font-bold">Manage Lessons</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Add Lesson
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xl font-bold">✕</button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {!loading && (
        <>
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold">Privacy/Access:</span>
            {['all', 'public', 'private', 'free', 'premium'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === item
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item === 'all' && `All (${lessons.length})`}
                {item === 'public' && `Public (${lessons.filter(l => l.privacy === 'public').length})`}
                {item === 'private' && `Private (${lessons.filter(l => l.privacy === 'private').length})`}
                {item === 'free' && `Free (${lessons.filter(l => l.accessLevel === 'free').length})`}
                {item === 'premium' && `Premium (${lessons.filter(l => l.accessLevel === 'premium').length})`}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Image</th>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Author</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Privacy</th>
                  <th className="px-6 py-3 text-left font-semibold">Access</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
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
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-400 shadow-sm">
                            <span className="text-2xl">📖</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium truncate max-w-xs">
                        <div className="truncate">{lesson.title}</div>
                        <div className="text-xs text-gray-500 truncate">{lesson.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">{lesson.authorName || lesson.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-sm">{lesson.category || 'N/A'}</span>
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
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lesson.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lesson.status || 'draft'}
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
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                      No lessons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

            <div className="p-6">
              {modalMode === 'view' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Email</label>
                    <p className="text-gray-900">{formData.authorEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <p className="text-gray-900 capitalize">{formData.status}</p>
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
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-semibold mb-2">Author Email</label>
                    <input
                      type="email"
                      name="authorEmail"
                      value={formData.authorEmail}
                      onChange={handleChange}
                      placeholder="author@example.com"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Author Name (display)</label>
                      <input
                        type="text"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleChange}
                        placeholder="Display name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Author Photo URL</label>
                      <input
                        type="url"
                        name="authorPhotoURL"
                        value={formData.authorPhotoURL}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    {formData.authorPhotoURL ? (
                      <img src={formData.authorPhotoURL} alt={formData.authorName} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {(formData.authorName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
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
                      <label className="block text-sm font-semibold mb-2">Access Level *</label>
                      <select
                        name="accessLevel"
                        value={formData.accessLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="free">🆓 Free</option>
                        <option value="premium">⭐ Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
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
