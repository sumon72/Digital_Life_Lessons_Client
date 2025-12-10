import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function ReportedLessons() {
  const navigate = useNavigate()
  const [reportedLessons, setReportedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showReportsModal, setShowReportsModal] = useState(false)

  useEffect(() => {
    fetchReportedLessons()
  }, [])

  const fetchReportedLessons = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/reported-lessons')
      setReportedLessons(response.data)
    } catch (err) {
      console.error('Error fetching reported lessons:', err)
      toast.error('Failed to load reported lessons')
    } finally {
      setLoading(false)
    }
  }

  const handleViewReports = async (lessonId) => {
    try {
      const response = await api.get(`/admin/lessons/${lessonId}/reports`)
      setSelectedLesson(response.data)
      setShowReportsModal(true)
    } catch (err) {
      console.error('Error fetching report details:', err)
      toast.error('Failed to load report details')
    }
  }

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    const result = await Swal.fire({
      title: 'Delete Reported Lesson?',
      html: `<div>
        <p>Are you sure you want to delete this lesson?</p>
        <p class="font-semibold mt-2">"${lessonTitle}"</p>
        <p class="text-sm text-gray-600 mt-2">This action cannot be undone and all associated reports will be removed.</p>
      </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/lessons/${lessonId}`)
        toast.success('Lesson deleted successfully')
        setShowReportsModal(false)
        fetchReportedLessons() // Refresh list
      } catch (err) {
        console.error('Error deleting lesson:', err)
        toast.error(err.response?.data?.message || 'Failed to delete lesson')
      }
    }
  }

  const handleIgnoreReports = async (lessonId) => {
    const result = await Swal.fire({
      title: 'Ignore All Reports?',
      text: 'This will dismiss all reports for this lesson. The lesson will remain published.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, ignore reports',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await api.put(`/admin/lessons/${lessonId}/ignore-reports`)
        toast.success('Reports dismissed successfully')
        setShowReportsModal(false)
        fetchReportedLessons() // Refresh list
      } catch (err) {
        console.error('Error ignoring reports:', err)
        toast.error('Failed to dismiss reports')
      }
    }
  }

  const handleViewLesson = (lessonId) => {
    navigate(`/lesson/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Reported Lessons Table */}
      <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">
              Flagged Lessons ({reportedLessons.length})
            </h2>

            {reportedLessons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold mb-2">All Clear!</h3>
                <p className="text-base-content/60">
                  No lessons have been reported at this time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Report Count</th>
                      <th>Latest Report</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedLessons.map((item) => (
                      <tr key={item._id} className="hover">
                        <td>
                          <div className="font-semibold max-w-xs truncate">
                            {item.lesson.title}
                          </div>
                          <div className="text-xs text-base-content/60">
                            Posted on {new Date(item.lesson.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar placeholder">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-content text-xs">
                                <span>{item.lesson.author?.displayName?.[0] || 'U'}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {item.lesson.author?.displayName || 'Anonymous'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-sm">
                            {item.lesson.category}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-error badge-lg">
                            {item.reportCount} {item.reportCount === 1 ? 'Report' : 'Reports'}
                          </span>
                        </td>
                        <td>
                          <div className="text-sm">
                            {new Date(item.latestReportDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewReports(item.lesson._id)}
                              className="btn btn-sm btn-info"
                              title="View all reports"
                            >
                              📋 View Reports
                            </button>
                            <button
                              onClick={() => handleViewLesson(item.lesson._id)}
                              className="btn btn-sm btn-ghost"
                              title="View lesson"
                            >
                              👁️
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

        {/* Reports Detail Modal */}
        {showReportsModal && selectedLesson && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">
                Reports for "{selectedLesson.lesson.title}"
              </h3>

              {/* Lesson Info */}
              <div className="bg-base-200 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold">Author:</span>{' '}
                    {selectedLesson.lesson.author?.displayName || 'Anonymous'}
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span>{' '}
                    {selectedLesson.lesson.category}
                  </div>
                  <div>
                    <span className="font-semibold">Posted:</span>{' '}
                    {new Date(selectedLesson.lesson.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Total Reports:</span>{' '}
                    <span className="badge badge-error">{selectedLesson.reports.length}</span>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {selectedLesson.reports.map((report, index) => (
                  <div key={report._id} className="card bg-base-200 shadow">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-content">
                              <span className="text-xs">
                                {report.reportedBy?.displayName?.[0] || 'U'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {report.reportedBy?.displayName || 'Anonymous'}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {report.reportedBy?.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-base-content/60">
                          {new Date(report.reportedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-error badge-sm">
                          {report.reason}
                        </span>
                      </div>
                      {report.additionalInfo && (
                        <p className="text-sm mt-2 text-base-content/80">
                          "{report.additionalInfo}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="modal-action flex gap-3">
                <button
                  onClick={() => handleDeleteLesson(selectedLesson.lesson._id, selectedLesson.lesson.title)}
                  className="btn btn-error gap-2"
                >
                  <span>🗑️</span>
                  <span>Delete Lesson</span>
                </button>
                <button
                  onClick={() => handleIgnoreReports(selectedLesson.lesson._id)}
                  className="btn btn-ghost gap-2"
                >
                  <span>👁️</span>
                  <span>Ignore Reports</span>
                </button>
                <button
                  onClick={() => handleViewLesson(selectedLesson.lesson._id)}
                  className="btn btn-primary gap-2"
                >
                  <span>📖</span>
                  <span>View Lesson</span>
                </button>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="btn"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setShowReportsModal(false)}></div>
          </div>
        )}
    </div>
  )
}
