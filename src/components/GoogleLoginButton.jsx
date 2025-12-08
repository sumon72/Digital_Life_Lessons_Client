import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../config/firebase'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Get the ID token for backend authentication
      const token = await result.user.getIdToken()
      localStorage.setItem('authToken', token)
      
      // Redirect to dashboard or home
      navigate('/dashboard/my-lessons')
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google login cancelled')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please enable popups for this site.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="alert alert-error mb-4 text-sm">
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
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-2l2 2m0 0l2 2m-2-2l-2 2m2-2l2-2M9 9h.01M9 9l2 2m0 0l2-2m-2 2l-2-2"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-outline w-full gap-2"
      >
        <FcGoogle size={20} />
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Signing in...
          </>
        ) : (
          'Continue with Google'
        )}
      </button>
    </div>
  )
}
