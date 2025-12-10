import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function AuthorLessons() {
  const { authorName } = useParams()
  const navigate = useNavigate()
  
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authorInfo, setAuthorInfo] = useState(null)

  useEffect(() => {
    fetchAuthorLessons()
  }, [authorName])

  const fetchAuthorLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/lessons/author/${encodeURIComponent(authorName)}`)
      setLessons(response.data.lessons || [])
      setAuthorInfo(response.data.authorInfo || null)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch author lessons'
      setError(errorMsg)
      toast.error(errorMsg)
      console.error('Error fetching author lessons:', err)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-base-content/60">Loading author's lessons...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card bg-base-100 shadow-lg max-w-md w-full">
          <div className="card-body">
            <h2 className="card-title text-error">Error Loading Lessons</h2>
            <p className="text-base-content/70">{error}</p>
            <div className="card-actions">
              <button onClick={() => navigate(-1)} className="btn btn-outline">
                Go Back
              </button>
              <button onClick={fetchAuthorLessons} className="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-base-200 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button onClick={() => navigate('/public-lessons')} className="btn btn-ghost btn-sm mb-6">
          ← Back to Lessons
        </button>

        {/* Author Header Section */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Author Avatar */}
              {authorInfo?.photoURL ? (
                <img
                  src={authorInfo.photoURL}
                  alt={authorName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-3xl font-bold">
                  {(authorName || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{authorName}</h1>
                <p className="text-base-content/70 mb-4">Lesson Creator</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-value text-2xl">{lessons.length}</div>
                    <div className="stat-desc">Total Lessons</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-value text-2xl">
                      {formatNumber(lessons.reduce((sum, l) => sum + (l.viewCount || 0), 0))}
                    </div>
                    <div className="stat-desc">Total Views</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-value text-2xl">
                      {formatNumber(lessons.reduce((sum, l) => sum + (l.likesCount || 0), 0))}
                    </div>
                    <div className="stat-desc">Total Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            All Lessons by {authorName}
          </h2>
          <span className="badge badge-lg badge-primary">
            {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
          </span>
        </div>

        {/* No Lessons Message */}
        {lessons.length === 0 ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">No Lessons Yet</h3>
              <p className="text-base-content/60 mb-6">
                This author hasn't created any public lessons yet.
              </p>
              <button onClick={() => navigate('/public-lessons')} className="btn btn-primary">
                Browse All Lessons
              </button>
            </div>
          </div>
        ) : (
          /* Lessons Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/lesson/${lesson._id}`)}
              >
                {/* Featured Image or Gradient */}
                {lesson.featuredImage ? (
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={lesson.featuredImage}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </figure>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📖</span>
                  </div>
                )}

                <div className="card-body">
                  {/* Title */}
                  <h3 className="card-title text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                    {lesson.description || 'No description available.'}
                  </p>

                  {/* Category & Tone Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-sm badge-primary">
                      {lesson.category || 'Uncategorized'}
                    </span>
                    <span className="badge badge-sm badge-outline">
                      {lesson.emotionalTone || 'Neutral'}
                    </span>
                    {lesson.accessLevel === 'premium' && (
                      <span className="badge badge-sm badge-warning">⭐ Premium</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-base-content/60 mb-3">
                    <div className="flex items-center gap-3">
                      <span>❤️ {formatNumber(lesson.likesCount || 0)}</span>
                      <span>🔖 {formatNumber(lesson.savedCount || 0)}</span>
                      <span>👀 {formatNumber(lesson.viewCount || 0)}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-base-content/50">
                    Created {formatDate(lesson.createdAt)}
                  </div>

                  {/* View Button */}
                  <div className="card-actions mt-4">
                    <button className="btn btn-primary btn-sm w-full gap-2">
                      <span>📖</span>
                      <span>Read Lesson</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
