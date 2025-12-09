import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function PaymentCancel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const [countdown, setCountdown] = useState(10)

  const reason = searchParams.get('reason') || 'cancelled'

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Auto-redirect after 10 seconds
    const timer = setInterval(() => {
      setCountdown(c => c - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      navigate('/pricing')
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [user, navigate])

  const getMessage = () => {
    switch (reason) {
      case 'failed':
        return 'Your payment could not be processed. Please check your payment details and try again.'
      case 'expired':
        return 'Your payment session has expired. Please start a new checkout.'
      case 'cancelled':
      default:
        return 'Your payment was cancelled. No charges were made to your account.'
    }
  }

  const getIcon = () => {
    return reason === 'failed' ? '⚠️' : '❌'
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">{getIcon()}</div>
          
          <h1 className="card-title justify-center text-2xl mb-2">
            {reason === 'failed' ? 'Payment Failed' : 'Payment Cancelled'}
          </h1>
          
          <p className="text-base-content/70 mb-4">
            {getMessage()}
          </p>

          <div className="divider"></div>

          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-base-content/60">
              Redirecting to pricing in <span className="font-bold text-primary">{countdown}</span> seconds...
            </p>
          </div>

          <div className="card-actions flex flex-col gap-3 justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="btn btn-primary"
            >
              Back to Pricing
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
            >
              Go to Dashboard
            </button>
          </div>

          <p className="text-xs text-base-content/50 mt-4">
            If you continue to experience issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
