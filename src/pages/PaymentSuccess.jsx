import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, refreshUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    verifyPayment()
  }, [user, sessionId])

  const verifyPayment = async () => {
    try {
      if (!sessionId) {
        throw new Error('No session ID found')
      }

      // Verify payment with backend
      const response = await api.post('/payment/verify-payment', { sessionId })

      if (response.data?.success) {
        setSuccess(true)
        // Refresh user data to get updated isPremium status
        setTimeout(() => {
          if (refreshUser) {
            refreshUser()
          }
          toast.success('🎉 Welcome to Premium!')
        }, 500)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (err) {
      console.error('Error verifying payment:', err)
      toast.error('Payment verification failed')
      setTimeout(() => {
        navigate('/payment/cancel?reason=failed')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (!success) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="card-title justify-center text-2xl mb-2">Verification Failed</h1>
            <p className="text-base-content/70 mb-6">
              We couldn't verify your payment. Please contact support.
            </p>
            <div className="card-actions justify-center">
              <button
                onClick={() => navigate('/pricing')}
                className="btn btn-primary"
              >
                Back to Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          
          <h1 className="card-title justify-center text-2xl mb-2">Payment Successful!</h1>
          
          <p className="text-base-content/70 mb-6">
            Thank you for upgrading to Premium! You now have access to all premium features.
          </p>

          <div className="bg-success/10 border border-success rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-success mb-2">✅ Premium Activated</p>
            <p className="text-xs text-base-content/70">
              Your account has been upgraded with lifetime access to all premium features.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-left">
              <span className="text-lg">✨</span>
              <span className="text-sm">Unlimited lesson creation</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <span className="text-lg">✨</span>
              <span className="text-sm">Ad-free experience</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <span className="text-lg">✨</span>
              <span className="text-sm">Priority support</span>
            </div>
          </div>

          <div className="card-actions flex flex-col gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="btn btn-outline"
            >
              View Premium Benefits
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
