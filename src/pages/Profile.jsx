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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
        <div className="text-center">
          <p className="text-xl mb-4 font-semibold">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-8 sm:px-10"></div>

          {/* Content */}
          <div className="px-8 sm:px-10 pb-8">
            {error && (
              <div className="alert alert-error mb-6 shadow-md -mt-8 relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4v2m0 4v2m0-16v2m9 0v2m0 4v2m0 4v2m0-16v2"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-6 shadow-md -mt-8 relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
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
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
              <div className="avatar mb-6">
                <div className="w-40 rounded-full border-4 border-base-100 bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-5xl overflow-hidden shadow-lg">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold">{name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content">{name || 'User Profile'}</h1>
              <p className="text-base-content/60 mt-1">{email}</p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6 mt-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="input input-bordered focus:input-primary transition-all text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Email Address</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered bg-base-200 text-base"
                    value={email}
                    disabled
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg text-base-content">Profile Picture URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"
                    className="input input-bordered focus:input-primary transition-all text-base"
                    value={photoURLInput}
                    onChange={(e) => setPhotoURLInput(e.target.value)}
                    disabled={loading}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">Paste an image URL from any source (try: dicebear.com for avatars)</span>
                  </label>
                </div>
              </div>

              <div className="form-control pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating Profile...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>

            {/* Account Info */}
            <div className="divider my-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-base-200/50 rounded-lg p-6">
              <div>
                <p className="text-base-content/60 text-xs font-semibold uppercase tracking-wide">Account Created</p>
                <p className="text-base-content font-semibold mt-1">
                  {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-base-content/60 text-xs font-semibold uppercase tracking-wide">Last Sign-in</p>
                <p className="text-base-content font-semibold mt-1">
                  {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
