import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function MyLessons() {
  const { user, userPlan } = useUser()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, public, private

  useEffect(() => {
    fetchMyLessons()
  }, [])

  const fetchMyLessons = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/user/lessons')
      setLessons(response.data)
    } catch (err) {
      console.error('Error fetching lessons:', err)
      toast.error('Failed to load your lessons')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (lessonId) => {
    const result = await Swal.fire({
      title: 'Delete Lesson?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/lessons/${lessonId}`)
        setLessons(lessons.filter(l => l._id !== lessonId))
        toast.success('Lesson deleted successfully')
      } catch (err) {
        toast.error('Failed to delete lesson')
      }
    }
  }

  const handleTogglePrivacy = async (lessonId, currentPrivacy) => {
    try {
      const newPrivacy = currentPrivacy === 'public' ? 'private' : 'public'
      await api.put(`/lessons/${lessonId}`, { privacy: newPrivacy })
      setLessons(lessons.map(l => 
        l._id === lessonId ? { ...l, privacy: newPrivacy } : l
      ))
      toast.success(`Lesson is now ${newPrivacy}`)
    } catch (err) {
      toast.error('Failed to update privacy')
    }
  }

  const handleToggleAccessLevel = async (lessonId, currentLevel) => {
    if (!userPlan?.isPremium) {
      toast.error('Upgrade to Premium to create premium lessons')
      navigate('/pricing')
      return
    }

    try {
      const newLevel = currentLevel === 'free' ? 'premium' : 'free'
      await api.put(`/lessons/${lessonId}`, { accessLevel: newLevel })
      setLessons(prev => prev.map(l => 
        l._id === lessonId ? { ...l, accessLevel: newLevel } : l
      ))
      toast.success(`Lesson access level updated to ${newLevel}`)
    } catch (err) {
      toast.error('Failed to update access level')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'all') return true
    return lesson.privacy === filter
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Lessons</h1>
            <p className="text-base-content/70">Manage all your life lessons</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/add-lesson')}
            className="btn btn-primary gap-2"
          >
            <span>➕</span>
            <span>Add New Lesson</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({lessons.length})
          </button>
          <button 
            className={`tab ${filter === 'public' ? 'tab-active' : ''}`}
            onClick={() => setFilter('public')}
          >
            Public ({lessons.filter(l => l.privacy === 'public').length})
          </button>
          <button 
            className={`tab ${filter === 'private' ? 'tab-active' : ''}`}
            onClick={() => setFilter('private')}
          >
            Private ({lessons.filter(l => l.privacy === 'private').length})
          </button>
        </div>

        {/* Lessons Table */}
        {filteredLessons.length === 0 ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">No Lessons Found</h3>
              <p className="text-base-content/60 mb-6">
                Start creating your life lessons to share your wisdom
              </p>
              <button 
                onClick={() => navigate('/dashboard/add-lesson')}
                className="btn btn-primary"
              >
                Create Your First Lesson
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Tone</th>
                  <th>Privacy</th>
                  <th>Access</th>
                  <th>Stats</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.map((lesson) => (
                  <tr key={lesson._id}>
                    <td>
                      <div className="font-semibold max-w-xs truncate">{lesson.title}</div>
                      <div className="text-sm text-base-content/60 max-w-xs truncate">
                        {lesson.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm">{lesson.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline">{lesson.emotionalTone}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePrivacy(lesson._id, lesson.privacy)}
                        className={`badge ${lesson.privacy === 'public' ? 'badge-success' : 'badge-ghost'} cursor-pointer`}
                      >
                        {lesson.privacy === 'public' ? '🌍 Public' : '🔒 Private'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAccessLevel(lesson._id, lesson.accessLevel)}
                        className={`badge ${lesson.accessLevel === 'premium' ? 'badge-warning' : 'badge-info'} cursor-pointer`}
                      >
                        {lesson.accessLevel === 'premium' ? '⭐ Premium' : '🆓 Free'}
                      </button>
                    </td>
                    <td>
                      <div className="text-xs space-y-1">
                        <div>❤️ {lesson.likesCount || 0}</div>
                        <div>🔖 {lesson.savedCount || 0}</div>
                        <div>👀 {lesson.viewCount || 0}</div>
                      </div>
                    </td>
                    <td className="text-sm">{formatDate(lesson.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/lesson/${lesson._id}`)}
                          className="btn btn-xs btn-info"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/edit-lesson/${lesson._id}`)}
                          className="btn btn-xs btn-warning"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="btn btn-xs btn-error"
                          title="Delete"
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
      </div>
    </div>
  )
}
