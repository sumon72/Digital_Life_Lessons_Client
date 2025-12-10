import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { ShareButtons } from '../components/ShareButtons'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userPlan } = useUser()
  
  // Main lesson state
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Interaction states
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [similarLessons, setSimilarLessons] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)

  useEffect(() => {
    fetchLesson()
  }, [id])

  const fetchLesson = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/lessons/${id}`)
      setLesson(response.data)
      setLikesCount(response.data.likesCount || 0)
      setSavedCount(response.data.savedCount || 0)
      
      // Check if user liked this lesson
      if (user && response.data.likes) {
        setIsLiked(response.data.likes.includes(user._id))
      }

      // Check if user saved this lesson
      if (user) {
        const statusRes = await api.get(`/lessons/${id}/save/status`, {
          params: { userId: user._id }
        })
        setIsSaved(statusRes.data.saved)
      }
      
      // Fetch similar lessons
      fetchSimilarLessons()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch lesson'
      setError(errorMsg)
      console.error('Error fetching lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarLessons = async () => {
    try {
      setLoadingSimilar(true)
      const response = await api.get(`/lessons/${id}/similar`)
      setSimilarLessons(response.data)
    } catch (err) {
      console.error('Error fetching similar lessons:', err)
    } finally {
      setLoadingSimilar(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like this lesson')
      navigate('/login')
      return
    }

    try {
      const response = await api.post(`/lessons/${id}/like`)
      setIsLiked(response.data.isLiked)
      setLikesCount(response.data.likesCount)
      toast.success(response.data.isLiked ? '❤️ Liked!' : 'Unliked')
    } catch (err) {
      toast.error('Failed to like lesson')
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save this lesson')
      navigate('/login')
      return
    }

    try {
      const response = await api.post(`/lessons/${id}/save`, { userId: user._id })
      setIsSaved(response.data.saved)
      setSavedCount(response.data.savedCount || 0)
      toast.success(response.data.saved ? '🔖 Saved!' : 'Unsaved')
    } catch (err) {
      toast.error('Failed to save lesson')
    }
  }

  const handleReport = async () => {
    if (!user) {
      toast.error('Please log in to report this lesson')
      navigate('/login')
      return
    }

    const { value: reason } = await Swal.fire({
      title: 'Report Lesson',
      input: 'select',
      inputOptions: {
        'inappropriate': 'Inappropriate Content',
        'hate_speech': 'Hate Speech or Harassment',
        'misleading': 'Misleading or False Information',
        'spam': 'Spam or Promotional Content',
        'sensitive': 'Sensitive or Disturbing Content',
        'other': 'Other'
      },
      inputPlaceholder: 'Select a reason...',
      showCancelButton: true,
      confirmButtonText: 'Report',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a reason'
        }
      }
    })

    if (reason) {
      try {
        const loadingToast = toast.loading('Reporting lesson...')
        await api.post(`/lessons/${id}/report`, { reason })
        toast.success('Thank you for reporting. We will review this shortly.', { id: loadingToast })
      } catch (err) {
        toast.error('Failed to report lesson')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = (content || '').split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return readTime < 1 ? 1 : readTime
  }

  const getToneBadgeColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case 'happy':
        return 'bg-yellow-100 text-yellow-700'
      case 'sad':
        return 'bg-blue-100 text-blue-700'
      case 'motivated':
        return 'bg-green-100 text-green-700'
      case 'reflective':
        return 'bg-purple-100 text-purple-700'
      case 'hopeful':
        return 'bg-cyan-100 text-cyan-700'
      case 'angry':
        return 'bg-red-100 text-red-700'
      case 'grateful':
        return 'bg-pink-100 text-pink-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'work':
        return 'bg-blue-100 text-blue-700'
      case 'personal':
        return 'bg-purple-100 text-purple-700'
      case 'relationships':
        return 'bg-pink-100 text-pink-700'
      case 'health':
        return 'bg-green-100 text-green-700'
      case 'finance':
        return 'bg-emerald-100 text-emerald-700'
      case 'education':
        return 'bg-indigo-100 text-indigo-700'
      case 'spirituality':
        return 'bg-violet-100 text-violet-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const isPremiumLocked = lesson?.accessLevel === 'premium' && !userPlan?.isPremium

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-base-content/60">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card bg-base-100 shadow-lg max-w-md w-full">
          <div className="card-body">
            <h2 className="card-title text-error">Error Loading Lesson</h2>
            <p className="text-base-content/70">{error}</p>
            <div className="card-actions">
              <button onClick={() => navigate(-1)} className="btn btn-outline">
                Go Back
              </button>
              <button onClick={fetchLesson} className="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">Lesson Not Found</h2>
          <p className="text-base-content/60 mb-6">The lesson you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/public-lessons')} className="btn btn-primary">
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-base-200 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button onClick={() => navigate('/public-lessons')} className="btn btn-ghost btn-sm mb-6">
          ← Back to Lessons
        </button>

        {/* Premium Lock Overlay */}
        {isPremiumLocked && (
          <div className="card bg-base-100 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-base-100/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
              <p className="text-base-content/70 mb-6">
                This is a premium lesson. Upgrade your subscription to unlock this wisdom.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="btn btn-primary btn-lg gap-2"
              >
                <span>⭐</span>
                <span>Upgrade to Premium</span>
              </button>
            </div>
            <div className={`card-body ${isPremiumLocked ? 'blur-sm' : ''}`}>
              {/* Content will be hidden */}
            </div>
          </div>
        )}

        {/* Main Content (Hidden if Premium Locked) */}
        {!isPremiumLocked && (
          <>
            {/* Lesson Card */}
            <article className="card bg-base-100 shadow-xl mb-8">
              {/* Header Section */}
              <div className="card-body border-b border-base-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>

                    {/* Category & Tone Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(lesson.category)}`}>
                        {lesson.category || 'Uncategorized'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getToneBadgeColor(lesson.emotionalTone)}`}>
                        {lesson.emotionalTone || 'Neutral'}
                      </span>
                    </div>
                  </div>

                  {/* Access Level Badge */}
                  <div className="flex flex-col gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        lesson.accessLevel === 'premium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {lesson.accessLevel === 'premium' ? '⭐ Premium' : '🌍 Free'}
                    </span>
                  </div>
                </div>

                {/* Metadata Info Block */}
                <div className="divider my-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-xs text-base-content/60 uppercase font-semibold mb-1">Created</p>
                    <p className="font-semibold">{formatDate(lesson.createdAt)}</p>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-xs text-base-content/60 uppercase font-semibold mb-1">Updated</p>
                    <p className="font-semibold">{formatDate(lesson.updatedAt)}</p>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-xs text-base-content/60 uppercase font-semibold mb-1">Reading Time</p>
                    <p className="font-semibold">{estimateReadTime(lesson.content)} min</p>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-xs text-base-content/60 uppercase font-semibold mb-1">Visibility</p>
                    <p className="font-semibold">{lesson.privacy === 'public' ? '🌍 Public' : '🔒 Private'}</p>
                  </div>
                </div>
              </div>

              {/* Featured Image (if available) */}
              {lesson.featuredImage && (
                <img
                  src={lesson.featuredImage}
                  alt={lesson.title}
                  className="w-full h-96 object-cover"
                />
              )}

              {/* Content Section */}
              <div className="card-body">
                {/* Description/Story */}
                <div className="prose prose-sm md:prose-base max-w-none mb-8">
                  <p className="text-lg leading-relaxed text-base-content/80 mb-6 font-semibold">
                    {lesson.description}
                  </p>
                  <div className="divider"></div>
                  <div className="whitespace-pre-wrap text-base-content leading-relaxed">
                    {lesson.content}
                  </div>
                </div>

                {/* Stats & Engagement Section */}
                <div className="divider my-8"></div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-base-200 rounded-lg">
                    <p className="text-2xl font-bold">{formatNumber(likesCount)}</p>
                    <p className="text-xs text-base-content/60 uppercase">❤️ Likes</p>
                  </div>
                  <div className="text-center p-4 bg-base-200 rounded-lg">
                    <p className="text-2xl font-bold">{formatNumber(savedCount)}</p>
                    <p className="text-xs text-base-content/60 uppercase">🔖 Favorites</p>
                  </div>
                  <div className="text-center p-4 bg-base-200 rounded-lg">
                    <p className="text-2xl font-bold">
                      {formatNumber(lesson.viewCount || Math.floor(Math.random() * 10000))}
                    </p>
                    <p className="text-xs text-base-content/60 uppercase">👀 Views</p>
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="divider"></div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleSave}
                    className={`btn gap-2 ${isSaved ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <span>🔖</span>
                    <span>{isSaved ? 'Favorites' : 'Favorites'}</span> 
                  </button>
                  <button
                    onClick={handleLike}
                    className={`btn gap-2 ${isLiked ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <span>{isLiked ? '❤️' : '🤍'}</span>
                    <span>{isLiked ? 'Liked' : 'Like'}</span> 
                  </button>
                  <button onClick={handleReport} className="btn btn-outline gap-2">
                    <span>🚩</span>
                    <span>Report</span>
                  </button>
                  <ShareButtons lesson={lesson} />
                </div>
              </div>
            </article>

            {/* Author Section */}
            <section className="card bg-base-100 shadow-lg mb-8">
              <div className="card-body">
                <h2 className="card-title mb-6">About the Creator</h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {lesson.authorPhotoURL ? (
                      <img
                        src={lesson.authorPhotoURL}
                        alt={lesson.authorName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-2xl font-bold">
                        {(lesson.authorName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{lesson.authorName || lesson.author || 'Anonymous'}</h3>
                      <p className="text-base-content/60">Lesson Creator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/author/${lesson.authorName}`)}
                    className="btn btn-primary gap-2"
                  >
                    <span>👤</span>
                    <span>View All Lessons</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Similar & Recommended Lessons */}
            {similarLessons.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Similar Lessons You'll Love</h2>
                {loadingSimilar ? (
                  <div className="flex justify-center py-12">
                    <div className="loading loading-spinner loading-lg"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarLessons.map((similarLesson) => (
                      <div
                        key={similarLesson._id}
                        className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => navigate(`/lesson/${similarLesson._id}`)}
                      >
                        <div className="card-body flex flex-col">
                          <h3 className="card-title text-base line-clamp-2">{similarLesson.title}</h3>
                          <p className="text-sm text-base-content/70 line-clamp-2">
                            {similarLesson.description}
                          </p>
                          <div className="flex flex-wrap gap-2 my-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(similarLesson.category)}`}>
                              {similarLesson.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getToneBadgeColor(similarLesson.emotionalTone)}`}>
                              {similarLesson.emotionalTone}
                            </span>
                          </div>
                          <div className="text-xs text-base-content/50 mb-4">
                            {formatDate(similarLesson.createdAt)}
                          </div>
                          <div className="card-actions mt-auto">
                            <button className="btn btn-sm btn-primary w-full gap-2">
                              <span>📖</span>
                              <span>View Lesson</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
