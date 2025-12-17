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
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'
    : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900'
  const badgeSoft = isDark
    ? 'bg-primary/20 border border-primary/40 text-primary-100'
    : 'bg-primary/10 border border-primary/30 text-primary-700'
  const surfaceSubtle = isDark
    ? 'rounded-3xl border border-white/10 bg-white/5 backdrop-blur text-slate-100 shadow-xl'
    : 'rounded-3xl border border-slate-200 bg-white/80 backdrop-blur shadow-xl text-slate-900'
  const surfaceTable = isDark
    ? 'rounded-3xl border border-white/10 bg-white/5 backdrop-blur text-slate-100 shadow-xl'
    : 'rounded-3xl border border-slate-200 bg-white/80 backdrop-blur shadow-xl text-slate-900'
  const tableHeadBg = isDark ? 'bg-white/10' : 'bg-slate-100'
  const mutedText = isDark ? 'text-slate-300/80' : 'text-slate-600'
  const softerText = isDark ? 'text-slate-200/90' : 'text-slate-700'
  const accentPill = isDark ? 'bg-white/10 border border-white/20 text-white' : 'bg-primary/10 border border-primary/30 text-primary-700'

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
    <main className={`min-h-screen ${pageBg} py-16 px-4 md:px-8 lg:px-16 flex items-center`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold ${badgeSoft} mb-4`}>🎁 Premium Membership</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Own Your Legacy<br/>Forever</h1>
          <p className={`text-lg ${softerText} max-w-3xl mx-auto leading-relaxed`}>
            Upgrade once, create unlimited. Unlock premium features and join an elite community of knowledge-sharers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-center">
          {/* Free Plan */}
          <div className={`group ${surfaceSubtle} overflow-hidden transition-all duration-500 hover:shadow-2xl`}>
            <div className="p-10 flex flex-col h-full">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-bold ${mutedText}`}>Get Started</p>
                    <h2 className="text-3xl font-bold mt-2">Free Plan</h2>
                  </div>
                  <span className={`px-4 py-2 text-xs rounded-full font-semibold ${accentPill}`}>✓ Current</span>
                </div>
                <p className={`${mutedText} text-sm leading-relaxed`}>Perfect for exploring and sharing your first stories.</p>
              </div>

              <div className="mb-10">
                <div className="text-5xl font-bold mb-1">Free</div>
                <p className={`text-sm ${mutedText}`}>Forever free, always available</p>
              </div>

              <div className="space-y-4 flex-1 mb-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span><span className="font-medium">Up to 3 lessons per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span><span className="font-medium">Basic lesson creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span><span className="font-medium">Community access</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <span className="text-2xl">✗</span><span className="font-medium">Ad-free experience</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <span className="text-2xl">✗</span><span className="font-medium">Priority placement</span>
                </div>
              </div>

              <button className="btn btn-outline w-full font-bold" disabled>
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Plan - FEATURED */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-500 -z-10"></div>
            <div className="relative rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/95 via-primary/90 to-secondary/90 text-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3), transparent 32%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.25), transparent 30%)'}}></div>
              
              <div className="p-10 relative z-10 flex flex-col h-full">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-white/80">Lifetime Access</p>
                      <h2 className="text-3xl font-bold mt-2">Premium Plan</h2>
                    </div>
                    <span className="px-4 py-2 text-xs rounded-full font-semibold bg-white/20 border border-white/40 backdrop-blur">⭐ Recommended</span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">Create unlimited lessons and unlock your full potential.</p>
                </div>

                <div className="mb-10">
                  <div className="text-6xl font-extrabold mb-2">৳1,500</div>
                  <p className="text-sm text-white/80">One-time payment • Lifetime ownership</p>
                </div>

                <button
                  onClick={handleUpgradeClick}
                  disabled={loading}
                  className="btn bg-white text-primary font-bold border-0 w-full mb-8 shadow-lg hover:shadow-xl hover:scale-105 transition h-12 text-base"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    '🚀 Upgrade to Premium'
                  )}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>✨</span><span>Unlimited lessons</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>🎨</span><span>Premium tools</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>📈</span><span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>🎯</span><span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>👑</span><span>Premium badge</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 font-medium text-sm">
                    <span>🔒</span><span>Ad-free always</span>
                  </div>
                </div>

                <p className="text-xs text-white/70">✓ Secure Stripe payment • ✓ No subscriptions • ✓ Money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className={`${surfaceTable} overflow-hidden transition-all duration-500 hover:shadow-2xl`}>
          <div className={`p-8 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <h2 className="text-3xl font-bold mb-2">Complete Feature Comparison</h2>
            <p className={`${mutedText} text-sm`}>See exactly what you'll unlock with Premium membership.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={tableHeadBg}>
                <tr>
                  <th className="text-left p-6 font-bold">Feature</th>
                  <th className="text-center p-6 font-bold">Free Plan</th>
                  <th className="text-center p-6 font-bold bg-primary/10">Premium Plan</th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'divide-white/5' : 'divide-slate-200'} divide-y`}>
                {FEATURES.map((feature, idx) => (
                  <tr key={idx} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition`}>
                    <td className="p-6 font-semibold">{feature.name}</td>
                    <td className={`p-6 text-center ${feature.free === '❌' ? 'opacity-40' : 'font-semibold'}`}>{feature.free}</td>
                    <td className="p-6 text-center font-bold text-secondary bg-primary/5">{feature.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Got Questions?</h2>
          <p className={`${softerText} mb-12 max-w-2xl mx-auto`}>Everything you need to know about Premium membership</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${surfaceSubtle} p-8 text-left hover:shadow-lg transition-all duration-300`}>
              <h3 className="text-lg font-bold mb-3">💎 Truly Lifetime?</h3>
              <p className={`text-sm ${mutedText}`}>Yes. Pay once, create forever. No hidden charges, no recurring fees. Your Premium membership is permanent.</p>
            </div>
            <div className={`${surfaceSubtle} p-8 text-left hover:shadow-lg transition-all duration-300`}>
              <h3 className="text-lg font-bold mb-3">🔒 Is it Safe?</h3>
              <p className={`text-sm ${mutedText}`}>Stripe handles all payments with bank-level encryption. Your card details never touch our servers.</p>
            </div>
            <div className={`${surfaceSubtle} p-8 text-left hover:shadow-lg transition-all duration-300`}>
              <h3 className="text-lg font-bold mb-3">💬 Need Support?</h3>
              <p className={`text-sm ${mutedText}`}>Email support@digitallifelessons.com. Premium members get priority responses within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


