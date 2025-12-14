import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { getSwalThemeConfig } from '../utils/sweetAlertTheme'

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

  const handleRemoveFavorite = async (lessonId, lessonTitle) => {
    const result = await Swal.fire({
      title: 'Remove from Favorites?',
      text: `Are you sure you want to remove "${lessonTitle}" from your favorites?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      ...getSwalThemeConfig()
    })

    if (!result.isConfirmed) return

    const loadingToast = toast.loading('Removing from favorites...')
    try {
      await api.post(`/lessons/${lessonId}/save`, { userId: user._id })
      setFavorites(favorites.filter(f => f._id !== lessonId))
      toast.success('Removed from favorites', { id: loadingToast })
    } catch (err) {
      toast.error('Failed to remove favorite', { id: loadingToast })
    }
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>🔖</span>
              <span>My Favorites</span>
            </h1>
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
              <thead className="bg-base-200">
                <tr>
                  <th className="font-bold">Image</th>
                  <th className="font-bold">Title & Description</th>
                  <th className="font-bold">Author</th>
                  <th className="font-bold">Category</th>
                  <th className="font-bold">Tone</th>
                  <th className="font-bold">Stats</th>
                  <th className="font-bold">Saved On</th>
                  <th className="font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFavorites.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-base-200/50 transition">
                    <td className="w-20">
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
                        <div className="w-16 h-16 bg-gradient-to-br from-base-200 to-base-300 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-2xl">📚</span>
                        </div>
                      )}
                    </td>
                    <td className="max-w-xs">
                      <div className="font-semibold truncate">{lesson.title}</div>
                      <div className="text-sm text-base-content/60 truncate">
                        {lesson.description}
                      </div>
                    </td>
                    <td className="text-sm">
                      <div className="font-medium">{lesson.author?.displayName || lesson.authorName || 'Unknown'}</div>
                      {lesson.author?.email && (
                        <div className="text-xs text-base-content/50">{lesson.author.email}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-sm">{lesson.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline">{lesson.emotionalTone}</span>
                    </td>
                    <td>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          <span>❤️</span>
                          <span className="font-medium">{formatNumber(lesson.likesCount || 0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🔖</span>
                          <span className="font-medium">{formatNumber(lesson.savedCount || 0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👀</span>
                          <span className="font-medium">{formatNumber(lesson.viewCount || 0)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {formatDate(lesson.savedAt || lesson.createdAt)}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/lesson/${lesson._id}`)}
                          className="btn btn-sm btn-primary gap-1"
                          title="View Lesson Details"
                        >
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(lesson._id, lesson.title)}
                          className="btn btn-sm btn-outline btn-error gap-1"
                          title="Remove from Favorites"
                        >
                          <span>🗑️</span>
                          <span>Remove</span>
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
    </>
  )
}
