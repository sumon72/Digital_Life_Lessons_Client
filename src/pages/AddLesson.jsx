import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast, { Toaster } from 'react-hot-toast'
import SuccessAnimation from '../components/SuccessAnimation'

export default function AddLesson() {
  const { user, userPlan } = useUser()
  const navigate = useNavigate()
  
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
  
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const categories = ['Personal', 'Work', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']

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
      return
    }

    const loadingToast = toast.loading('Creating lesson...')
    setSubmitting(true)

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

      const response = await api.post('/lessons', payload)
      toast.success('Lesson created successfully!', { id: loadingToast })
      
      // Show success animation
      setShowSuccess(true)
      
      // Navigate to My Lessons after animation completes
      setTimeout(() => {
        navigate('/dashboard/my-lessons')
      }, 2000)
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      toast.error(err.response?.data?.error || 'Failed to create the lesson.', { id: loadingToast })
    } finally {
      setSubmitting(false)
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

      <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">Add New Lesson</h1>
              <p className="text-base-content/70">Share your life wisdom and experiences with the community</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/my-lessons')}
              className="btn btn-ghost btn-sm"
            >
              ← Back to My Lessons
            </button>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Author Info (Read-only) */}
                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>👤</span>
                    <span>Author Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Author Name</label>
                      <input
                        type="text"
                        value={user?.displayName || user?.email || 'Anonymous'}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-base-300 text-base-content cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Author Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        placeholder="No email available"
                        className="w-full px-4 py-2 border rounded-lg bg-base-300 text-base-content cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {user?.photoURL && (
                    <div className="mt-3">
                      <label className="block text-sm font-semibold mb-2">Author Photo</label>
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Lesson Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Lesson Title <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., How I overcame my biggest fear"
                    className="input input-bordered w-full"
                    required
                  />
                  <p className="text-xs text-base-content/60 mt-1">Give your lesson a clear, engaging title</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description / Summary <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A brief summary of your lesson (2-3 sentences)"
                    rows={3}
                    className="textarea textarea-bordered w-full"
                    required
                  />
                  <p className="text-xs text-base-content/60 mt-1">Provide a concise overview to hook readers</p>
                </div>

                {/* Category & Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category <span className="text-error">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <p className="text-xs text-base-content/60 mt-1">Choose the best fit category</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Emotional Tone <span className="text-error">*</span>
                    </label>
                    <select
                      name="emotionalTone"
                      value={formData.emotionalTone}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      {tones.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                    <p className="text-xs text-base-content/60 mt-1">Select the overall mood of your lesson</p>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Featured Image URL <span className="text-base-content/60">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full"
                  />
                  <p className="text-xs text-base-content/60 mt-1">Add a visual to make your lesson stand out</p>
                  {formData.featuredImage && (
                    <div className="mt-3">
                      <img
                        src={formData.featuredImage}
                        alt="Preview"
                        className="max-w-xs rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Privacy & Access Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Privacy <span className="text-error">*</span>
                    </label>
                    <select
                      name="privacy"
                      value={formData.privacy}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="public">🌍 Public - Everyone can see</option>
                      <option value="private">🔒 Private - Only you can see</option>
                    </select>
                    <p className="text-xs text-base-content/60 mt-1">Control who can view this lesson</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Access Level <span className="text-error">*</span>
                      {!userPlan?.isPremium && (
                        <span className="badge badge-warning badge-sm ml-2">Premium Feature</span>
                      )}
                    </label>
                    <select
                      name="accessLevel"
                      value={formData.accessLevel}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="free">🆓 Free - Anyone can read</option>
                      <option value="premium" disabled={!userPlan?.isPremium}>
                        ⭐ Premium - Only subscribers {!userPlan?.isPremium && '(Upgrade Required)'}
                      </option>
                    </select>
                    {!userPlan?.isPremium && (
                      <p className="text-xs text-warning mt-1">
                        💡 Upgrade to Premium to create paid lessons
                      </p>
                    )}
                  </div>
                </div>

                {/* Full Content */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Story / Content <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Share your full story, insights, and lessons learned..."
                    rows={10}
                    className="textarea textarea-bordered w-full"
                    required
                  />
                  <p className="text-xs text-base-content/60 mt-1">
                    Write your complete lesson with all the details, insights, and takeaways
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="divider"></div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/my-lessons')}
                    className="btn btn-outline"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span>Create Lesson</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SuccessAnimation 
        isVisible={showSuccess} 
        onComplete={() => setShowSuccess(false)} 
      />
    </>
  )
}
