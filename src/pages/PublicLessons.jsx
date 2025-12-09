import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function PublicLessons() {
  const navigate = useNavigate()
  const { user, userPlan } = useUser()
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [toneFilter, setToneFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['all', 'Work', 'Personal', 'Relationships', 'Health', 'Finance', 'Education', 'Spirituality']
  const tones = ['all', 'Happy', 'Sad', 'Motivated', 'Reflective', 'Hopeful', 'Angry', 'Grateful']

  useEffect(() => {
    fetchPublicLessons()
  }, [])

  useEffect(() => {
    filterLessons()
  }, [lessons, categoryFilter, toneFilter, searchQuery])

  const fetchPublicLessons = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lessons')
      
      // Filter only public lessons
      const publicLessons = response.data.filter(lesson => 
        lesson.privacy === 'public' || lesson.privacy === 'Public'
      )
      
      setLessons(publicLessons)
    } catch (err) {
      console.error('Error fetching public lessons:', err)
      toast.error('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = () => {
    let filtered = [...lessons]

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === categoryFilter)
    }

    // Tone filter
    if (toneFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.emotionalTone === toneFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredLessons(filtered)
  }

  const handleSeeDetails = (lessonId, lesson) => {
    // Check if lesson is premium and user is not premium
    if (lesson.accessLevel === 'premium' && !userPlan?.isPremium) {
      toast.error('This is a premium lesson. Please upgrade to view.')
      navigate('/pricing')
      return
    }

    navigate(`/lessons/${lessonId}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70">Loading public lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            📚 Public Life Lessons
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover wisdom shared by our community. Browse and learn from publicly shared life experiences.
          </p>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            {/* Search */}
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="🔍 Search lessons by title or description..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`btn btn-sm ${
                      categoryFilter === category
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Filter */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Emotional Tone</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map(tone => (
                  <button
                    key={tone}
                    onClick={() => setToneFilter(tone)}
                    className={`btn btn-sm ${
                      toneFilter === tone
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                  >
                    {tone === 'all' ? 'All Tones' : tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-base-content/70">
            Showing <span className="font-bold text-primary">{filteredLessons.length}</span> lesson{filteredLessons.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2">No Lessons Found</h3>
              <p className="text-base-content/70">
                {searchQuery || categoryFilter !== 'all' || toneFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'No public lessons available yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const isPremiumLocked = lesson.accessLevel === 'premium' && !userPlan?.isPremium

              return (
                <div
                  key={lesson._id}
                  className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isPremiumLocked ? 'relative overflow-hidden' : ''
                  }`}
                >
                  {/* Premium Overlay */}
                  {isPremiumLocked && (
                    <div className="absolute inset-0 bg-base-100/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-6xl mb-4">🔒</div>
                      <h3 className="text-xl font-bold mb-2">Premium Lesson</h3>
                      <p className="text-base-content/70 mb-4">
                        Upgrade to Premium to unlock this wisdom
                      </p>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="btn btn-primary btn-sm"
                      >
                        ⭐ Upgrade Now
                      </button>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={`card-body ${isPremiumLocked ? 'blur-sm' : ''}`}>
                    {/* Access Level Badge */}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`badge ${
                        lesson.accessLevel === 'premium'
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}>
                        {lesson.accessLevel === 'premium' ? '⭐ Premium' : '🌍 Free'}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {formatDate(lesson.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="card-title text-lg line-clamp-2">
                      {lesson.title || 'Untitled Lesson'}
                    </h2>

                    {/* Description Preview */}
                    <p className="text-sm text-base-content/70 line-clamp-3 mb-3">
                      {lesson.description || lesson.whatHappened || 'No description available'}
                    </p>

                    {/* Category & Tone */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`badge badge-sm ${getCategoryBadgeColor(lesson.category)}`}>
                        {lesson.category || 'Uncategorized'}
                      </span>
                      <span className={`badge badge-sm ${getToneBadgeColor(lesson.emotionalTone)}`}>
                        {lesson.emotionalTone || 'Neutral'}
                      </span>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-base-300">
                      {lesson.authorPhotoURL ? (
                        <img
                          src={lesson.authorPhotoURL}
                          alt={lesson.authorName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {lesson.authorName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {lesson.authorName || 'Anonymous'}
                        </p>
                        <p className="text-xs text-base-content/50">
                          Lesson Creator
                        </p>
                      </div>
                    </div>

                    {/* See Details Button */}
                    <div className="card-actions mt-4">
                      <button
                        onClick={() => handleSeeDetails(lesson._id, lesson)}
                        className="btn btn-primary btn-block btn-sm"
                      >
                        👁️ See Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Call to Action for Non-Logged Users */}
        {!user && (
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl mt-12">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl mb-2">
                Want to Share Your Wisdom?
              </h2>
              <p className="mb-6">
                Join our community to create and share your own life lessons with the world
              </p>
              <div className="card-actions justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-lg bg-white text-primary border-0 hover:bg-gray-100"
                >
                  Sign Up Now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
