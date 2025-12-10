import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function AddEditLesson() {
  const { id } = useParams() // If editing
  const navigate = useNavigate()
  const { user, userPlan } = useUser()
  const [loading, setLoading] = useState(false)
  const [loadingLesson, setLoadingLesson] = useState(false)
  
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

  const categories = ['Personal', 'Work', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']

  useEffect(() => {
    if (id) {
      fetchLesson()
    }
  }, [id])

  const fetchLesson = async () => {
    try {
      setLoadingLesson(true)
      const response = await api.get(`/lessons/${id}`)
      const lesson = response.data
      
      // Check if user owns this lesson
      if (lesson.author !== user._id) {
        toast.error('You can only edit your own lessons')
        navigate('/dashboard/my-lessons')
        return
      }

      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        category: lesson.category || 'Personal',
        emotionalTone: lesson.emotionalTone || 'Hopeful',
        featuredImage: lesson.featuredImage || '',
        privacy: lesson.privacy || 'public',
        accessLevel: lesson.accessLevel || 'free'
      })
    } catch (err) {
      console.error('Error fetching lesson:', err)
      toast.error('Failed to load lesson')
      navigate('/dashboard/my-lessons')
    } finally {
      setLoadingLesson(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
      navigate('/pricing')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        ...formData,
        author: user._id,
        authorName: user.displayName || user.email,
        authorPhotoURL: user.photoURL || ''
      }

      if (id) {
        // Update existing lesson
        await api.put(`/lessons/${id}`, payload)
        toast.success('Lesson updated successfully!')
      } else {
        // Create new lesson
        await api.post('/lessons', payload)
        toast.success('Lesson created successfully!')
      }

      navigate('/dashboard/my-lessons')
    } catch (err) {
      console.error('Error saving lesson:', err)
      toast.error(err.response?.data?.error || 'Failed to save lesson')
    } finally {
      setLoading(false)
    }
  }

  if (loadingLesson) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/dashboard/my-lessons')}
            className="btn btn-ghost btn-sm mb-4"
          >
            ← Back to My Lessons
          </button>
          <h1 className="text-3xl font-bold">{id ? 'Edit Lesson' : 'Add New Lesson'}</h1>
          <p className="text-base-content/70">
            {id ? 'Update your life lesson' : 'Share your life lesson with the world'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-lg">
          <div className="card-body space-y-6">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Lesson Title *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., The Power of Consistency"
                className="input input-bordered"
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Short Description *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief summary of your lesson (2-3 sentences)"
                className="textarea textarea-bordered h-24"
                required
              />
            </div>

            {/* Content */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Story / Insight *</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Share your full story, experience, or insight here..."
                className="textarea textarea-bordered h-64"
                required
              />
            </div>

            {/* Category and Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Emotional Tone *</span>
                </label>
                <select
                  name="emotionalTone"
                  value={formData.emotionalTone}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  {tones.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Featured Image URL (Optional)</span>
              </label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input input-bordered"
              />
              {formData.featuredImage && (
                <div className="mt-2">
                  <img 
                    src={formData.featuredImage} 
                    alt="Preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Privacy and Access Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Privacy *</span>
                </label>
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  <option value="public">🌍 Public</option>
                  <option value="private">🔒 Private</option>
                </select>
                <label className="label">
                  <span className="label-text-alt">Public lessons appear in browse section</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Access Level *</span>
                  {!userPlan?.isPremium && (
                    <span className="badge badge-warning badge-sm">Premium Feature</span>
                  )}
                </label>
                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                  className="select select-bordered"
                  disabled={!userPlan?.isPremium && formData.accessLevel === 'free'}
                  required
                >
                  <option value="free">🆓 Free</option>
                  <option value="premium" disabled={!userPlan?.isPremium}>
                    ⭐ Premium {!userPlan?.isPremium && '(Upgrade Required)'}
                  </option>
                </select>
                <label className="label">
                  <span className="label-text-alt">
                    {userPlan?.isPremium 
                      ? 'Premium lessons are visible only to premium users'
                      : 'Upgrade to Premium to create paid lessons'
                    }
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span>{id ? '💾 Update Lesson' : '✨ Create Lesson'}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/my-lessons')}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
