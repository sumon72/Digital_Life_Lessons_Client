import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, userPlan } = useUser()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [photoURLInput, setPhotoURLInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalSaved: 0,
    totalLikes: 0
  })
  const [publicLessons, setPublicLessons] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (user) {
      setName(user.displayName || '')
      setEmail(user.email || '')
      setPhotoURL(user.photoURL || '')
      setPhotoURLInput(user.photoURL || '')
      fetchUserStats()
      fetchPublicLessons()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/dashboard/user/stats')
      setStats({
        totalLessons: response.data.totalLessons || 0,
        totalSaved: response.data.totalSaved || 0,
        totalLikes: response.data.totalLikes || 0
      })
    } catch (err) {
      console.error('Error fetching user stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchPublicLessons = async () => {
    try {
      const response = await api.get('/dashboard/user/public-lessons')
      setPublicLessons(response.data)
    } catch (err) {
      console.error('Error fetching public lessons:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updates = {
        displayName: name,
      }

      // Update photo URL if it's different and not empty
      if (photoURLInput && photoURLInput !== photoURL) {
        // Validate URL by trying to load it
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('Invalid image URL or image not accessible'))
          img.src = photoURLInput
        })
        updates.photoURL = photoURLInput
      }

      await updateProfile(auth.currentUser, updates)
      
      // Update local state if photo URL was changed
      if (updates.photoURL) {
        setPhotoURL(photoURLInput)
      }

      setSuccess('Profile updated successfully!')
      toast.success('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
        <div className="text-center">
          <p className="text-xl mb-4 font-semibold">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-8 sm:px-10"></div>

          {/* Content */}
          <div className="px-8 sm:px-10 pb-8">
            {error && (
              <div className="alert alert-error mb-6 shadow-md -mt-8 relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4v2m0 4v2m0-16v2m9 0v2m0 4v2m0 4v2m0-16v2"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-6 shadow-md -mt-8 relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
              <div className="avatar mb-6">
                <div className="w-40 rounded-full border-4 border-base-100 bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-5xl overflow-hidden shadow-lg">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold">{name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content">{name || 'User Profile'}</h1>
              <p className="text-base-content/60 mt-1">{email}</p>
              {userPlan?.isPremium && (
                <div className="badge badge-warning badge-lg gap-2 mt-3 shadow-lg">
                  <span>⭐</span>
                  <span className="font-semibold">Premium Member</span>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                <div className="card-body p-4 text-center">
                  <div className="text-3xl mb-1">📚</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {loadingStats ? '...' : stats.totalLessons}
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">Lessons Created</div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-red-50 to-red-100 shadow-md">
                <div className="card-body p-4 text-center">
                  <div className="text-3xl mb-1">❤️</div>
                  <div className="text-2xl font-bold text-red-700">
                    {loadingStats ? '...' : stats.totalLikes}
                  </div>
                  <div className="text-xs text-red-600 font-semibold">Total Likes</div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
                <div className="card-body p-4 text-center">
                  <div className="text-3xl mb-1">🔖</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {loadingStats ? '...' : stats.totalSaved}
                  </div>
                  <div className="text-xs text-purple-600 font-semibold">Lessons Saved</div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6 mt-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="input input-bordered focus:input-primary transition-all text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Email Address</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered bg-base-200 text-base"
                    value={email}
                    disabled
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Profile Picture URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"
                    className="input input-bordered focus:input-primary transition-all text-base"
                    value={photoURLInput}
                    onChange={(e) => setPhotoURLInput(e.target.value)}
                    disabled={loading}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">Paste an image URL from any source (try: dicebear.com for avatars)</span>
                  </label>
                </div>
              </div>

              <div className="form-control pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating Profile...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>

            {/* Account Info */}
            <div className="divider my-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-base-200/50 rounded-lg p-6">
              <div>
                <p className="text-base-content/60 text-xs font-semibold uppercase tracking-wide">Account Created</p>
                <p className="text-base-content font-semibold mt-1">
                  {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-base-content/60 text-xs font-semibold uppercase tracking-wide">Last Sign-in</p>
                <p className="text-base-content font-semibold mt-1">
                  {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Public Lessons Section */}
            <div className="divider my-8"></div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Public Lessons</h2>
                <button
                  onClick={() => navigate('/dashboard/my-lessons')}
                  className="btn btn-sm btn-ghost"
                >
                  View All →
                </button>
              </div>

              {publicLessons.length === 0 ? (
                <div className="text-center py-12 bg-base-200/50 rounded-lg">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-base-content/60">No public lessons yet</p>
                  <button
                    onClick={() => navigate('/dashboard/add-lesson')}
                    className="btn btn-primary btn-sm mt-4"
                  >
                    Create Your First Lesson
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicLessons.slice(0, 4).map((lesson) => (
                    <div
                      key={lesson._id}
                      onClick={() => navigate(`/lesson/${lesson._id}`)}
                      className="card bg-base-200 hover:bg-base-300 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">{lesson.title}</h3>
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="badge badge-sm badge-outline">{lesson.category}</span>
                          {lesson.accessLevel === 'premium' && (
                            <span className="badge badge-sm badge-warning">⭐ Premium</span>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-base-content/60">
                          <span>❤️ {lesson.likesCount || 0}</span>
                          <span>🔖 {lesson.savedCount || 0}</span>
                          <span>👁️ {lesson.viewsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {publicLessons.length > 4 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => navigate('/dashboard/my-lessons')}
                    className="btn btn-outline"
                  >
                    View All {publicLessons.length} Public Lessons
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
