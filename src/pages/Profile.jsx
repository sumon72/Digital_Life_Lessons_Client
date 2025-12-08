import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Profile() {
  const { user } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [photoURLInput, setPhotoURLInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.displayName || '')
      setEmail(user.email || '')
      setPhotoURL(user.photoURL || '')
      setPhotoURLInput(user.photoURL || '')
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updates = {
        displayName: name,
      }

      // Update photo URL if it's different and not empty
      if (photoURLInput && photoURLInput !== photoURL) {
        // Validate URL by trying to load it
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('Invalid image URL or image not accessible'))
          img.src = photoURLInput
        })
        updates.photoURL = photoURLInput
      }

      await updateProfile(auth.currentUser, updates)
      
      // Update local state if photo URL was changed
      if (updates.photoURL) {
        setPhotoURL(photoURLInput)
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-8">My Profile</h1>

            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-2l2 2m0 0l2 2m-2-2l-2 2m2-2l2-2M9 9h.01M9 9l2 2m0 0l2-2m-2 2l-2-2"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl overflow-hidden">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={email}
                  disabled
                  title="Email cannot be changed"
                />
                <label className="label">
                  <span className="label-text-alt">Email cannot be changed</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">User ID</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={user.uid}
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Profile Picture URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered"
                  value={photoURLInput}
                  onChange={(e) => setPhotoURLInput(e.target.value)}
                  disabled={loading}
                />
                <label className="label">
                  <span className="label-text-alt">Paste an image URL from any source</span>
                </label>
              </div>

              <div className="form-control pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>

            {/* Account Info */}
            <div className="divider mt-8"></div>
            <div className="text-sm text-base-content/60">
              <p>Account created: {user.metadata?.creationTime && new Date(user.metadata.creationTime).toLocaleDateString()}</p>
              <p>Last sign-in: {user.metadata?.lastSignInTime && new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
