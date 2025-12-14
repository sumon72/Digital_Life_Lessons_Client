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
  const [authorLessonsCount, setAuthorLessonsCount] = useState(0)
  
  // Comment states
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  useEffect(() => {
    fetchLesson()
    fetchComments()
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
      
      // Fetch author lessons count
      if (response.data.authorEmail) {
        fetchAuthorLessonsCount(response.data.authorEmail)
      }
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

  const fetchAuthorLessonsCount = async (authorEmail) => {
    try {
      const response = await api.get(`/lessons/author-email/${encodeURIComponent(authorEmail)}`)
      setAuthorLessonsCount(response.data?.total || 0)
    } catch (err) {
      console.error('Error fetching author lessons count:', err)
    }
  }

  const fetchComments = async () => {
    try {
      setLoadingComments(true)
      console.log('Fetching comments for lesson:', id)
      const response = await api.get(`/comments/lesson/${id}`)
      console.log('Comments received:', response.data)
      setComments(response.data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to comment')
      navigate('/login')
      return
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      setSubmittingComment(true)
      const response = await api.post('/comments', {
        lessonId: id,
        content: commentText
      })
      setComments([response.data, ...comments])
      setCommentText('')
      toast.success('Comment posted successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id)
    setEditingCommentText(comment.content)
  }

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const response = await api.put(`/comments/${commentId}`, {
        content: editingCommentText
      })
      setComments(comments.map(c => c._id === commentId ? response.data : c))
      setEditingCommentId(null)
      setEditingCommentText('')
      toast.success('Comment updated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/comments/${commentId}`)
        setComments(comments.filter(c => c._id !== commentId))
        toast.success('Comment deleted')
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete comment')
      }
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

            {/* Author / Creator Section */}
            <section className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-300 mb-8">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>✨</span>
                  <span>About the Creator</span>
                </h2>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Creator Profile Image */}
                  <div className="flex-shrink-0">
                    {lesson.authorPhotoURL ? (
                      <div className="relative">
                        <img
                          src={lesson.authorPhotoURL}
                          alt={lesson.authorName}
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content rounded-full p-3 shadow-lg">
                          <span className="text-2xl">👤</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent text-primary-content flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-base-100">
                        {(lesson.authorName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-2">{lesson.authorName || lesson.author || 'Anonymous'}</h3>
                    <p className="text-lg text-base-content/70 mb-6">🖊️ Lesson Creator & Contributor</p>
                    
                    {/* Creator Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-base-100 rounded-lg p-4 shadow-md border border-base-300">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <span className="text-2xl">📚</span>
                          <p className="text-3xl font-bold text-primary">{authorLessonsCount}</p>
                        </div>
                        <p className="text-sm text-base-content/60 font-medium">Total Lessons</p>
                      </div>
                      
                      <div className="bg-base-100 rounded-lg p-4 shadow-md border border-base-300">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <span className="text-2xl">⭐</span>
                          <p className="text-3xl font-bold text-warning">
                            {lesson.accessLevel === 'premium' ? 'Premium' : 'Free'}
                          </p>
                        </div>
                        <p className="text-sm text-base-content/60 font-medium">Content Tier</p>
                      </div>
                      
                      <div className="bg-base-100 rounded-lg p-4 shadow-md border border-base-300">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <span className="text-2xl">🌍</span>
                          <p className="text-3xl font-bold text-success">
                            {lesson.privacy === 'public' ? 'Public' : 'Private'}
                          </p>
                        </div>
                        <p className="text-sm text-base-content/60 font-medium">Visibility</p>
                      </div>
                    </div>

                    {/* View All Lessons Button */}
                    <button
                      onClick={() => navigate(`/author/${encodeURIComponent(lesson.authorName || lesson.author || 'Unknown')}`)}
                      className="btn btn-primary btn-lg gap-3 w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
                    >
                      <span className="text-xl">👤</span>
                      <span className="font-semibold">View All Lessons by This Author</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Optional: Author Email Badge */}
                {lesson.authorEmail && (
                  <div className="mt-6 pt-6 border-t border-base-300">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-base-content/60">
                      <span>✉️</span>
                      <span className="font-medium">{lesson.authorEmail}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Comments Section */}
            <section className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>💬</span>
                  <span>Comments</span>
                  <span className="badge badge-primary badge-lg ml-2">{comments.length}</span>
                </h2>

                {/* Comment Form */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="flex gap-4 items-start">
                      {/* User Avatar */}
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Share your thoughts about this lesson..."
                          className="textarea textarea-bordered w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={submittingComment}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-base-content/60">
                            {commentText.length} characters
                          </span>
                          <button
                            type="submit"
                            disabled={submittingComment || !commentText.trim()}
                            className="btn btn-primary gap-2"
                          >
                            {submittingComment ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                <span>Posting...</span>
                              </>
                            ) : (
                              <>
                                <span>💬</span>
                                <span>Post Comment</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-base-200 rounded-lg p-8 text-center mb-8">
                    <p className="text-lg mb-4">Please log in to join the conversation</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary gap-2">
                      <span>🔐</span>
                      <span>Log In to Comment</span>
                    </button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {loadingComments ? (
                    <div className="flex justify-center py-12">
                      <div className="loading loading-spinner loading-lg"></div>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="border-b border-base-300 pb-6 last:border-0">
                        <div className="flex gap-4">
                          {/* Commenter Avatar */}
                          {comment.userPhotoURL ? (
                            <img
                              src={comment.userPhotoURL}
                              alt={comment.userName}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent text-secondary-content flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {(comment.userName || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Comment Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold">{comment.userName}</span>
                              <span className="text-xs text-base-content/60">
                                {formatDate(comment.createdAt)}
                              </span>
                              {comment.updatedAt !== comment.createdAt && (
                                <span className="text-xs text-base-content/40 italic">(edited)</span>
                              )}
                            </div>

                            {/* Edit Mode */}
                            {editingCommentId === comment._id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  className="textarea textarea-bordered w-full min-h-[80px]"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateComment(comment._id)}
                                    className="btn btn-sm btn-primary"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(null)
                                      setEditingCommentText('')
                                    }}
                                    className="btn btn-sm btn-outline"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-base-content/90 whitespace-pre-wrap mb-3">
                                  {comment.content}
                                </p>

                                {/* Action Buttons (Only for comment owner) */}
                                {user && comment.userId === user._id && (
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                      <span>✏️</span>
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment._id)}
                                      className="text-sm text-error hover:underline flex items-center gap-1"
                                    >
                                      <span>🗑️</span>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-bold mb-2">No Comments Yet</h3>
                      <p className="text-base-content/60">
                        Be the first to share your thoughts about this lesson!
                      </p>
                    </div>
                  )}
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
