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
  const [theme, setTheme] = useState('light')

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

      useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
      }, [])

      useEffect(() => {
        const handleThemeChange = (e) => {
          setTheme(e.detail || localStorage.getItem('theme') || 'light')
        }
        window.addEventListener('app-theme-changed', handleThemeChange)
        return () => window.removeEventListener('app-theme-changed', handleThemeChange)
      }, [])

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

  const isDark = theme === 'dark'
  const pageBg = isDark
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100'
    : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
  const badgeSoft = isDark
    ? 'bg-white/5 border border-white/10 text-primary-200'
    : 'bg-primary/10 border border-primary/20 text-primary-700'
  const surfaceSubtle = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-slate-100'
    : 'rounded-2xl border border-slate-200 bg-white shadow text-slate-900'
  const surfaceTable = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-slate-100'
    : 'rounded-2xl border border-slate-200 bg-white shadow text-slate-900'
  const tableHeadBg = isDark ? 'bg-white/5' : 'bg-slate-100'
  const mutedText = isDark ? 'text-slate-200/75' : 'text-slate-600'
  const softerText = isDark ? 'text-slate-200/80' : 'text-slate-700'
  const accentPill = isDark ? 'bg-white/10 border border-white/10' : 'bg-primary/10 border border-primary/20 text-primary-700'

  if (planLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className={`${mutedText}`}>Loading pricing information...</p>
        </div>
      </div>
    )
  }

  // If already premium, show premium badge instead
  if (userPlan?.isPremium) {
    return (
      <div className={`min-h-screen ${pageBg} py-14 px-4 md:px-10 lg:px-16`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm uppercase tracking-[0.18em] ${badgeSoft}`}>Premium Active</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-3">Thank you for going Premium</h1>
            <p className={`text-lg ${softerText}`}>You already have lifetime access to everything. Head back to your dashboard to create and publish without limits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${surfaceSubtle} shadow-2xl p-8`}>
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-semibold mb-2">Premium Member</h2>
              <p className={`${softerText} mb-6`}>Unlimited lessons, ad-free reading, priority placement, analytics, and priority support.</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-900 dark:text-slate-200/90">
                <span className={`px-3 py-1 rounded-full ${accentPill}`}>Unlimited publishing</span>
                <span className={`px-3 py-1 rounded-full ${accentPill}`}>Priority listing</span>
                <span className={`px-3 py-1 rounded-full ${accentPill}`}>Advanced analytics</span>
                <span className={`px-3 py-1 rounded-full ${accentPill}`}>Priority support</span>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/80 to-primary text-primary-content shadow-2xl p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] mb-2">Lifetime</div>
              <h3 className="text-3xl font-bold mb-2">You’re all set</h3>
              <p className="opacity-90 mb-6">Enjoy creating, collaborating, and sharing without any limits.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn bg-white text-primary border-0 hover:bg-slate-100 font-semibold"
              >
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen ${pageBg} py-14 px-4 md:px-10 lg:px-16`}>
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] ${badgeSoft}`}>Premium • Lifetime</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-3">Own your lessons forever</h1>
          <p className={`text-lg ${mutedText} max-w-2xl mx-auto`}>
            Upgrade once, create without limits. Premium unlocks unlimited lessons, ad-free reading, priority placement, and analytics.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.1fr] gap-8 mb-12">
          {/* Free Plan */}
          <div className={`relative overflow-hidden ${surfaceSubtle} shadow-xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            <div className="p-8 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-sm uppercase tracking-[0.14em] ${mutedText}`}>Starter</p>
                  <h2 className="text-2xl font-semibold">Free Plan</h2>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${accentPill}`}>Current</span>
              </div>
              <p className={`${mutedText} mb-6`}>Perfect to explore and publish your first lessons.</p>
              <div className="mb-6">
                <div className="text-4xl font-bold">৳0</div>
                <p className={`text-sm ${mutedText}`}>Forever free</p>
              </div>
              <div className="space-y-3 text-sm flex-1">
                <div className="flex items-center gap-2"><span className="text-lg">✓</span><span>Up to 3 lessons per month</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">✓</span><span>Basic lesson creation</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">✓</span><span>Community access</span></div>
              </div>
              <button className="btn btn-outline btn-block mt-8" disabled>Current Plan</button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/90 via-primary to-amber-400/90 text-primary-content shadow-2xl">
            <div className="absolute inset-0 opacity-25 pointer-events-none" style={{background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 32%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.28), transparent 30%)'}}></div>
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.14em]">Lifetime</p>
                  <h2 className="text-3xl font-bold">Premium Plan</h2>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-white/20 border border-white/30">Recommended</span>
              </div>
              <p className="opacity-90 mb-6">Everything you need to publish, grow, and monetize your lessons with confidence.</p>
              <div className="mb-6">
                <div className="text-5xl font-extrabold">৳1,500</div>
                <p className="text-sm opacity-80">One-time • Lifetime access</p>
              </div>
              <button
                onClick={handleUpgradeClick}
                disabled={loading}
                className="btn bg-white text-primary font-bold border-0 shadow-lg hover:bg-amber-50 mb-6"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Unlimited lessons</span></div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Premium lesson creation</span></div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Ad-free experience</span></div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Priority listing</span></div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Advanced analytics</span></div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><span className="text-lg">✨</span><span>Priority support</span></div>
              </div>
              <p className="text-xs opacity-80 mt-4">Pay once. No subscriptions. Lifetime ownership.</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className={`${surfaceTable} overflow-hidden`}>
          <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'} flex items-center justify-between`}>
            <div>
              <h2 className="text-2xl font-bold">Feature comparison</h2>
              <p className={`${mutedText} text-sm`}>Know exactly what you get with Premium.</p>
            </div>
            <span className={`hidden md:inline-flex px-3 py-1 rounded-full text-xs tracking-[0.16em] ${accentPill}`}>Free vs Premium</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={tableHeadBg}>
                <tr>
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Free</th>
                  <th className="text-center p-4 font-bold">Premium</th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'divide-white/10' : 'divide-slate-200'}`}>
                {FEATURES.map((feature, idx) => (
                  <tr key={idx} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition`}>
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className={`p-4 text-center ${mutedText}`}>{feature.free}</td>
                    <td className="p-4 text-center font-semibold text-emerald-400">{feature.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-8">Questions, answered.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${surfaceSubtle} p-6 text-left`}>
              <h3 className="text-lg font-semibold mb-2">Is it really lifetime?</h3>
              <p className={`text-sm ${mutedText}`}>Yes. One payment unlocks Premium forever. No renewals, no hidden fees.</p>
            </div>
            <div className={`${surfaceSubtle} p-6 text-left`}>
              <h3 className="text-lg font-semibold mb-2">Is checkout secure?</h3>
              <p className={`text-sm ${mutedText}`}>Stripe handles payments end-to-end. We never store your card details.</p>
            </div>
            <div className={`${surfaceSubtle} p-6 text-left`}>
              <h3 className="text-lg font-semibold mb-2">Need help?</h3>
              <p className={`text-sm ${mutedText}`}>Email support@digitallifelessons.com — we respond with priority for Premium members.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
