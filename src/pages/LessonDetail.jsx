import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchLesson()
  }, [id])

  const fetchLesson = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/lessons/${id}`)
      setLesson(response.data)
      // Check if lesson is saved by user (implement if you have save functionality)
      setSaved(false)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch lesson'
      setError(errorMsg)
      console.error('Error fetching lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const loadingToast = toast.loading('Saving lesson...')
      // Implement save functionality if you have a save endpoint
      // await api.post(`/lessons/${id}/save`)
      setSaved(true)
      toast.success('Lesson saved!', { id: loadingToast })
    } catch (err) {
      toast.error('Failed to save lesson', { id: loadingToast })
    }
  }

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
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-base-200 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-6"
        >
          ← Back
        </button>

        {/* Lesson Card */}
        <article className="card bg-base-100 shadow-xl mb-8">
          {/* Header Section */}
          <div className="card-body border-b border-base-300">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="card-title text-3xl md:text-4xl mb-4">{lesson.title}</h1>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">By:</span>
                    <span>{lesson.author || 'Unknown Author'}</span>
                  </div>
                  
                  {lesson.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Published:</span>
                      <span>
                        {new Date(lesson.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {lesson.viewCount && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Views:</span>
                      <span>{lesson.viewCount}</span>
                    </div>
                  )}
                  
                  {lesson.status && (
                    <div className="badge badge-lg badge-primary">
                      {lesson.status.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap md:flex-col">
                <button
                  onClick={handleSave}
                  className={`btn btn-outline gap-2 ${saved ? 'btn-active' : ''}`}
                  disabled={saved}
                >
                  {saved ? (
                    <>
                      <span>✓</span>
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <span>♡</span>
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button className="btn btn-outline gap-2">
                  <span>↗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="card-body">
            <div className="prose prose-sm md:prose-base max-w-none">
              {/* Render content with proper formatting */}
              <div className="leading-relaxed text-base-content whitespace-pre-wrap">
                {lesson.content}
              </div>
            </div>

            {/* Footer Section */}
            <div className="border-t border-base-300 mt-8 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-bold text-lg">
                      {(lesson.author || 'A').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">{lesson.author || 'Unknown Author'}</div>
                    <div className="text-sm text-base-content/60">Lesson Author</div>
                  </div>
                </div>

                {/* Related Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button className="btn btn-outline btn-sm gap-1">
                    <span>👍</span>
                    <span>Helpful</span>
                  </button>
                  <button className="btn btn-outline btn-sm gap-1">
                    <span>💬</span>
                    <span>Comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Lessons Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">More Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/" className="card bg-base-100 shadow hover:shadow-md transition">
              <div className="card-body">
                <h3 className="card-title text-base">Explore More</h3>
                <p className="text-sm text-base-content/70">Discover more life lessons from our community</p>
                <div className="card-actions">
                  <button className="btn btn-outline btn-sm">Browse</button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
