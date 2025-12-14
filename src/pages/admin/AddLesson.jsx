import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../config/api'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { getSwalThemeConfig } from '../../utils/sweetAlertTheme'

export default function AddLesson() {
  const [lessons, setLessons] = useState([])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // create, edit, view
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    author: '', 
    description: '',
    category: 'Personal',
    emotionalTone: 'Hopeful',
    authorName: '',
    authorPhotoURL: '',
    accessLevel: 'free',
    privacy: 'private',
    status: 'draft' 
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['Personal', 'Work', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']
  const accessLevels = ['free', 'premium']
  const privacyOptions = ['private', 'public']

  const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.status === filter)

  // Fetch lessons on mount
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

  // CRUD: CREATE
  const handleCreate = () => {
    setModalMode('create')
    setFormData({ 
      title: '', 
      content: '', 
      author: '', 
      description: '',
      category: 'Personal',
      emotionalTone: 'Hopeful',
      authorName: '',
      authorPhotoURL: '',
      accessLevel: 'free',
      privacy: 'private',
      status: 'draft' 
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.author || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const loadingToast = toast.loading(modalMode === 'create' ? 'Adding lesson...' : 'Updating lesson...')

    try {
      if (modalMode === 'create') {
        const response = await api.post('/lessons', {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          description: formData.description,
          category: formData.category,
          emotionalTone: formData.emotionalTone,
          authorName: formData.authorName,
          authorPhotoURL: formData.authorPhotoURL,
          accessLevel: formData.accessLevel,
          privacy: formData.privacy,
          status: formData.status
        })
        console.log('Create response:', response.data)
        setLessons([response.data, ...lessons])
        setShowModal(false)
        setFormData({ 
          title: '', 
          content: '', 
          author: '', 
          description: '',
          category: 'Personal',
          emotionalTone: 'Hopeful',
          authorName: '',
          authorPhotoURL: '',
          accessLevel: 'free',
          privacy: 'private',
          status: 'draft' 
        })
        toast.success('Lesson added successfully', { id: loadingToast })
  
      } else if (modalMode === 'edit') {
        const response = await api.put(`/lessons/${selectedLesson._id}`, {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          description: formData.description,
          category: formData.category,
          emotionalTone: formData.emotionalTone,
          authorName: formData.authorName,
          authorPhotoURL: formData.authorPhotoURL,
          accessLevel: formData.accessLevel,
          privacy: formData.privacy,
          status: formData.status
        })
        console.log('Update response:', response.data)
        setLessons(lessons.map(l => l._id === selectedLesson._id ? response.data : l))
        setShowModal(false)
        setFormData({ 
          title: '', 
          content: '', 
          author: '', 
          description: '',
          category: 'Personal',
          emotionalTone: 'Hopeful',
          authorName: '',
          authorPhotoURL: '',
          accessLevel: 'free',
          privacy: 'private',
          status: 'draft' 
        })
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

  return (
    <AdminLayout>
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
        <h2 className="text-3xl font-bold">Add Lesson</h2>
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
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'published'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published ({lessons.filter(l => l.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'draft'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Draft ({lessons.filter(l => l.status === 'draft').length})
            </button>
          </div>

          {/* Lessons Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Tone</th>
                  <th className="px-6 py-3 text-left font-semibold">Creator</th>
                  <th className="px-6 py-3 text-left font-semibold">Access Level</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLessons.length > 0 ? (
                  filteredLessons.map(lesson => (
                    <tr key={lesson._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium truncate max-w-xs">{lesson.title}</td>
                      <td className="px-6 py-4">{lesson.category || 'N/A'}</td>
                      <td className="px-6 py-4">{lesson.emotionalTone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {lesson.authorPhotoURL ? (
                            <img
                              src={lesson.authorPhotoURL}
                              alt={lesson.authorName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {lesson.authorName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="truncate">{lesson.authorName || lesson.author || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          lesson.accessLevel === 'premium'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-success/20 text-success'
                        }`}>
                          {lesson.accessLevel === 'premium' ? '⭐ Premium' : '🌍 Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lesson.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lesson.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lesson.createdAt?.split('T')[0] || 'N/A'}</td>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                      <p className="text-gray-900">{formData.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Emotional Tone</label>
                      <p className="text-gray-900">{formData.emotionalTone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Access Level</label>
                      <p className="text-gray-900">{formData.accessLevel === 'premium' ? '⭐ Premium' : '🌍 Free'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Privacy</label>
                      <p className="text-gray-900">{formData.privacy === 'public' ? '🌍 Public' : '🔒 Private'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <p className="text-gray-900 capitalize">{formData.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Creator Name</label>
                      <p className="text-gray-900">{formData.authorName || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                    <p className="text-gray-900 whitespace-pre-wrap max-h-48 overflow-y-auto">{formData.content}</p>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
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
                    <label className="block text-sm font-semibold mb-2">Short Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief preview of the lesson (1-2 sentences)"
                      rows={2}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Creator Name *</label>
                      <input
                        type="text"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleChange}
                        placeholder="Creator's full name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Creator Photo URL</label>
                      <input
                        type="url"
                        name="authorPhotoURL"
                        value={formData.authorPhotoURL}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Access Level</label>
                      <select
                        name="accessLevel"
                        value={formData.accessLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {accessLevels.map(level => (
                          <option key={level} value={level}>
                            {level === 'premium' ? '⭐ Premium' : '🌍 Free'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Privacy</label>
                      <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {privacyOptions.map(option => (
                          <option key={option} value={option}>
                            {option === 'public' ? '🌍 Public' : '🔒 Private'}
                          </option>
                        ))}
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
                    <div>
                      <label className="block text-sm font-semibold mb-2">Author (Legacy) *</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Enter lesson content"
                      rows={8}
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
    </AdminLayout>
  )
}
