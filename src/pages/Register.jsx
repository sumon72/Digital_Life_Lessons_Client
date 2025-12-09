import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useUser } from '../context/UserContext'
import GoogleLoginButton from '../components/GoogleLoginButton'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useUser()

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with name
      await updateProfile(result.user, {
        displayName: name,
      })

      const token = await result.user.getIdToken()
      localStorage.setItem('authToken', token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-primary-content text-center">Create Account</h1>
            <p className="text-primary-content/80 text-center mt-2">Join Digital Life Lessons today</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 sm:px-10">
            {error && (
              <div className="alert alert-error mb-6 shadow-sm">
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

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered focus:input-primary transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered focus:input-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered focus:input-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered focus:input-primary transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="divider my-6 font-semibold text-base-content/70">OR</div>

            <GoogleLoginButton />

            <div className="mt-8 pt-6 border-t border-base-300">
              <p className="text-center text-base-content/70">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-base-content/50 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
