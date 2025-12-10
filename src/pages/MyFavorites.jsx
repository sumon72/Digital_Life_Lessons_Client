import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function MyFavorites() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [toneFilter, setToneFilter] = useState('all')

  useEffect(() => {
    fetchMyFavorites()
  }, [])

  const fetchMyFavorites = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/favorites')
      setFavorites(response.data)
    } catch (err) {
      console.error('Error fetching favorites:', err)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (lessonId) => {
    try {
      await api.post(`/lessons/${lessonId}/save`, { userId: user._id })
      setFavorites(favorites.filter(f => f._id !== lessonId))
      toast.success('Removed from favorites')
    } catch (err) {
      toast.error('Failed to remove favorite')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const categories = ['all', ...new Set(favorites.map(f => f.category))]
  const tones = ['all', ...new Set(favorites.map(f => f.emotionalTone))]

  const filteredFavorites = favorites.filter(fav => {
    const categoryMatch = categoryFilter === 'all' || fav.category === categoryFilter
    const toneMatch = toneFilter === 'all' || fav.emotionalTone === toneFilter
    return categoryMatch && toneMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-base-content/70">Lessons you've saved for later</p>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-wrap gap-4">
              <div className="form-control flex-1 min-w-[200px]">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control flex-1 min-w-[200px]">
                <label className="label">
                  <span className="label-text font-semibold">Emotional Tone</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={toneFilter}
                  onChange={(e) => setToneFilter(e.target.value)}
                >
                  {tones.map(tone => (
                    <option key={tone} value={tone}>
                      {tone === 'all' ? 'All Tones' : tone}
                    </option>
                  ))}
                </select>
              </div>

              {(categoryFilter !== 'all' || toneFilter !== 'all') && (
                <div className="form-control flex-1 min-w-[200px] justify-end">
                  <button
                    onClick={() => {
                      setCategoryFilter('all')
                      setToneFilter('all')
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Favorites Table */}
        {filteredFavorites.length === 0 ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center py-16">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-2xl font-bold mb-2">No Favorites Yet</h3>
              <p className="text-base-content/60 mb-6">
                {favorites.length === 0 
                  ? 'Start saving lessons that inspire you'
                  : 'No favorites match your filters'
                }
              </p>
              <button 
                onClick={() => navigate('/public-lessons')}
                className="btn btn-primary"
              >
                Browse Lessons
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Tone</th>
                  <th>Stats</th>
                  <th>Saved On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFavorites.map((lesson) => (
                  <tr key={lesson._id}>
                    <td>
                      <div className="font-semibold max-w-xs truncate">{lesson.title}</div>
                      <div className="text-sm text-base-content/60 max-w-xs truncate">
                        {lesson.description}
                      </div>
                    </td>
                    <td className="text-sm">{lesson.authorName || lesson.author}</td>
                    <td>
                      <span className="badge badge-sm">{lesson.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline">{lesson.emotionalTone}</span>
                    </td>
                    <td>
                      <div className="text-xs space-y-1">
                        <div>❤️ {lesson.likesCount || 0}</div>
                        <div>🔖 {lesson.savedCount || 0}</div>
                        <div>👀 {lesson.viewCount || 0}</div>
                      </div>
                    </td>
                    <td className="text-sm">{formatDate(lesson.savedAt || lesson.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/lessons/${lesson._id}`)}
                          className="btn btn-xs btn-primary"
                          title="View Details"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(lesson._id)}
                          className="btn btn-xs btn-error"
                          title="Remove from Favorites"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-6 text-center text-sm text-base-content/60">
          Showing {filteredFavorites.length} of {favorites.length} favorites
        </div>
      </div>
    </div>
  )
}
