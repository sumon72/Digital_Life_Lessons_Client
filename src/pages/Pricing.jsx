import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../config/api'
import toast from 'react-hot-toast'

const FEATURES = [
  { name: 'Lessons per Month', free: '3', premium: 'Unlimited' },
  { name: 'Premium Lesson Creation', free: '❌', premium: '✅' },
  { name: 'Ad-Free Experience', free: '❌', premium: '✅' },
  { name: 'Priority Listing', free: '❌', premium: '✅' },
  { name: 'Advanced Analytics', free: '❌', premium: '✅' },
  { name: 'Community Badge', free: '❌', premium: '✅ Premium ⭐' },
  { name: 'Support', free: 'Community', premium: 'Priority Email' },
  { name: 'Export Lessons', free: '❌', premium: '✅ PDF/Word' }
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, userPlan, refreshUser } = useUser()
  const [loading, setLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(true)

  useEffect(() => {
    // Refresh user plan from MongoDB when component mounts
    const verifyPlan = async () => {
      try {
        if (user && refreshUser) {
          await refreshUser()
        }
      } catch (err) {
        console.error('Error refreshing plan:', err)
      } finally {
        setPlanLoading(false)
      }
    }
    
    verifyPlan()
  }, [user?.email]) // Re-verify when user changes

  useEffect(() => {
    // Stop loading once userPlan is available
    if (userPlan !== null) {
      setPlanLoading(false)
    }
  }, [userPlan])

  const handleUpgradeClick = async () => {
    let loadingToast
    try {
      setLoading(true)
      loadingToast = toast.loading('Redirecting to Stripe...')

      // Call backend to create checkout session
      const response = await api.post('/payment/create-checkout-session', {
        email: user?.email,
        userId: user?._id
      })

      if (response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (err) {
      console.error('Error:', err)
      if (loadingToast) {
        toast.error(err.response?.data?.error || 'Failed to start checkout', { id: loadingToast })
      } else {
        toast.error(err.response?.data?.error || 'Failed to start checkout')
      }
    } finally {
      setLoading(false)
    }
  }

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-base-content/60">Loading pricing information...</p>
        </div>
      </div>
    )
  }

  // If already premium, show premium badge instead
  if (userPlan?.isPremium) {
    return (
      <div className="min-h-screen bg-base-200 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Thank You for Going Premium! ⭐
            </h1>
            <p className="text-xl text-base-content/70">
              You're enjoying all the premium features of Digital Life Lessons
            </p>
          </div>

          <div className="card bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
            <div className="card-body text-center text-primary-content">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="card-title justify-center text-2xl mb-4">Premium Member</h2>
              <p className="text-lg mb-6 opacity-90">
                Enjoy unlimited lessons, ad-free experience, priority support, and much more!
              </p>
              <div className="card-actions justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn bg-white text-primary border-0 hover:bg-gray-100"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Premium Features List */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">✅ Unlimited Lessons</h3>
                <p className="text-base-content/70">Create and share as many lessons as you want, whenever you want</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">✅ Ad-Free Experience</h3>
                <p className="text-base-content/70">Enjoy uninterrupted reading and learning</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">✅ Priority Support</h3>
                <p className="text-base-content/70">Get priority email support for all your questions</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">✅ Priority Listing</h3>
                <p className="text-base-content/70">Your lessons appear first in search results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Unlock unlimited potential. Upgrade to Premium and share your wisdom with the world
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="card bg-base-100 shadow-lg border-2 border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">Free Plan</h2>
              <p className="text-base-content/60 mb-6">Perfect for getting started</p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-base-content">৳0</div>
                <p className="text-sm text-base-content/60">Forever free</p>
              </div>

              <button className="btn btn-outline btn-block mb-6" disabled>
                Current Plan
              </button>

              <div className="space-y-3 flex-1">
                <p className="text-sm font-semibold text-base-content">Included:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Up to 3 lessons per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Basic lesson creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Community access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="card bg-gradient-to-br from-primary to-primary/80 shadow-2xl border-2 border-primary-focus transform scale-105 lg:scale-100">
            <div className="card-body text-primary-content">
              <div className="badge badge-lg badge-secondary mb-2">Recommended</div>
              <h2 className="card-title text-2xl mb-2">Premium Plan</h2>
              <p className="opacity-90 mb-6">Everything you need to thrive</p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold">৳1,500</div>
                <p className="text-sm opacity-75">One-time payment • Lifetime access</p>
              </div>

              <button
                onClick={handleUpgradeClick}
                disabled={loading}
                className="btn btn-lg btn-secondary border-0 mb-6 font-bold w-full"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  'Upgrade to Premium'
                )}
              </button>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Everything in Free, plus:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Unlimited lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Premium lesson creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Ad-free experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Priority listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span>Priority support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="card bg-base-100 shadow-lg overflow-hidden">
          <div className="card-body p-0">
            <h2 className="text-2xl font-bold p-6 border-b border-base-300">Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-left p-4 font-bold">Feature</th>
                    <th className="text-center p-4 font-bold">Free</th>
                    <th className="text-center p-4 font-bold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {FEATURES.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-base-200/50 transition">
                      <td className="p-4 font-medium text-base-content">{feature.name}</td>
                      <td className="p-4 text-center text-base-content/70">{feature.free}</td>
                      <td className="p-4 text-center font-semibold text-success">{feature.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-8">Have Questions?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">Can I cancel?</h3>
                <p className="text-sm text-base-content/70">
                  Premium is a one-time payment with lifetime access. No subscriptions, no cancellations needed.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">Is it secure?</h3>
                <p className="text-sm text-base-content/70">
                  We use Stripe for secure payment processing. Your payment information is never stored on our servers.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">Need help?</h3>
                <p className="text-sm text-base-content/70">
                  Contact our support team at support@digitallifelessons.com for any questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
