import { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { Link } from 'react-router-dom'

export default function ManageLessons() {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'How to Navigate Tough Conversations', author: 'A. Rivera', status: 'published', saved: 124, date: '2025-12-08' },
    { id: 2, title: 'Money Mindset for Young Adults', author: 'S. Lee', status: 'published', saved: 98, date: '2025-12-07' },
    { id: 3, title: 'Setting Boundaries Without Guilt', author: 'M. Khan', status: 'draft', saved: 0, date: '2025-12-06' },
    { id: 4, title: 'The Art of Forgiveness', author: 'J. Smith', status: 'published', saved: 156, date: '2025-12-05' }
  ])

  const [filter, setFilter] = useState('all')

  const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.status === filter)

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter(l => l.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Manage Lessons</h2>
        <Link to="/dashboard/lessons/new" className="btn btn-primary">
          ➕ New Lesson
        </Link>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({lessons.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'published'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Published ({lessons.filter(l => l.status === 'published').length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'draft'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Draft ({lessons.filter(l => l.status === 'draft').length})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Title</th>
              <th className="px-6 py-3 text-left font-semibold">Author</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Saved</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLessons.map(lesson => (
              <tr key={lesson.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{lesson.title}</td>
                <td className="px-6 py-4">{lesson.author}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lesson.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {lesson.status}
                  </span>
                </td>
                <td className="px-6 py-4">{lesson.saved}</td>
                <td className="px-6 py-4 text-gray-500">{lesson.date}</td>
                <td className="px-6 py-4 flex gap-2">
                  <Link to={`/dashboard/lessons/${lesson.id}/edit`} className="btn btn-sm btn-outline">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
