import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/api'
import { useUser } from '../context/UserContext'

// Removed local samples; use DB-only data for contributors and most-saved

function HeroSlider() {
  const slides = [
    {
      title: 'Share What Matters',
      desc: 'Turn your life lessons into lasting guides for others.',
      cta: { to: '/dashboard/add-lesson', label: '✨ Share a Lesson' },
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.85) 0%, rgba(139, 92, 246, 0.75) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
      bgSize: 'cover',
      bgPos: 'center'
    },
    {
      title: 'Learn from Community',
      desc: 'Discover practical advice written by people like you.',
      cta: { to: '/public-lessons', label: '🔍 Explore Lessons' },
      bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.85) 0%, rgba(59, 130, 246, 0.75) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
      bgSize: 'cover',
      bgPos: 'center'
    },
    {
      title: 'Preserve Wisdom',
      desc: 'Keep meaningful stories and make them easy to find.',
      cta: { to: '/register', label: '🚀 Join Community' },
      bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.85) 0%, rgba(79, 70, 229, 0.75) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
      bgSize: 'cover',
      bgPos: 'center'
    }
  ]

  const [index, setIndex] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(timer.current)
  }, [])

  return (
    <section className="relative w-full overflow-hidden rounded-3xl shadow-2xl h-96 group">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: slides[index].bg,
          backgroundSize: slides[index].bgSize,
          backgroundPosition: slides[index].bgPos,
          transition: 'background-image 0.7s ease-in-out'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-xl leading-tight">{slides[index].title}</h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">{slides[index].desc}</p>
          <div className="mt-8">
            <Link to={slides[index].cta.to} className="btn btn-gradient h-12 px-8 text-white font-semibold border-0 shadow-lg hover:shadow-2xl hover:scale-105">
              {slides[index].cta.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button aria-label="Previous" onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)} className="btn btn-circle btn-lg bg-white/20 border-0 text-white hover:bg-white/40 backdrop-blur transition-all">◀</button>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button aria-label="Next" onClick={() => setIndex(i => (i + 1) % slides.length)} className="btn btn-circle btn-lg bg-white/20 border-0 text-white hover:bg-white/40 backdrop-blur transition-all">▶</button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white shadow-lg' : 'w-3 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [contributors, setContributors] = useState([])
  const [mostSaved, setMostSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    let mounted = true
    async function fetchAll() {
      try {
        const [featuredRes, contributorsRes, mostSavedRes] = await Promise.allSettled([
          api.get('/lessons?status=published'),
          api.get('/contributors/top-week'),
          api.get('/lessons/most-saved')
        ])

        if (!mounted) return

        if (featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value.data)) {
          const list = (featuredRes.value.data || [])
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 3)
          setFeatured(list)
        } else {
          setFeatured([])
        }

        if (contributorsRes.status === 'fulfilled' && Array.isArray(contributorsRes.value.data)) {
          setContributors(contributorsRes.value.data || [])
        } else {
          setContributors([])
        }

        if (mostSavedRes.status === 'fulfilled' && Array.isArray(mostSavedRes.value.data)) {
          setMostSaved((mostSavedRes.value.data || []).slice(0, 3))
        } else {
          setMostSaved([])
        }
      } catch (e) {
        console.error('Error fetching lessons:', e)
        setFeatured([])
        setContributors([])
        setMostSaved([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  return (
    <main className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Slider */}
      <section className="px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <HeroSlider />
      </section>

      {/* Featured Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gradient">Featured Life Lessons</h3>
            </div>
            {user?.role === 'admin' && (
              <Link to="/dashboard/admin/lessons" className="text-sm text-primary underline hover:no-underline transition">→ Manage (admin)</Link>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-72 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.map(f => {
                const authorLabel = f.authorName || f.author?.displayName || f.authorEmail || f.author || 'Unknown Author'
                const desc = f.description || f.content || f.excerpt || ''
                const id = f._id || f.id
                return (
                  <article key={id} className="group glass-card-light dark:glass-card overflow-hidden hover:scale-105 transform transition-all duration-300">
                    <div className="p-8 h-full flex flex-col">
                      <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition">{f.title}</h4>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 flex-1 leading-relaxed">{desc}</p>
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">By {authorLabel}</div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20">{f.status || 'published'}</span>
                      </div>
                      <div className="mt-6">
                        <Link to={`/lesson/${id}`} className="btn btn-sm border-0 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg font-semibold w-full">Read Lesson →</Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Learning Matters Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 dark:from-primary/10 dark:via-secondary/10 dark:to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest mb-3">Why It Matters</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learning From Life Experiences</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Real stories. Real lessons. Real impact.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Real Experience', desc: 'Lessons rooted in real events — practical and actionable.' },
              { icon: '⏱️', title: 'Time-Saving', desc: 'Avoid mistakes by learning from others\' experiences.' },
              { icon: '💡', title: 'Empathy & Context', desc: 'Understand the human side behind decisions.' },
              { icon: '🏛️', title: 'Legacy', desc: 'Preserve valuable knowledge for future generations.' }
            ].map((item, i) => (
              <div key={i} className="group glass-card-light dark:glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4 group-hover:animate-float">{item.icon}</div>
                <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest mb-3">Community Heroes</p>
            <h2 className="text-3xl md:text-4xl font-bold">Top Contributors This Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {contributors.length > 0 ? contributors.map((c, i) => (
              <div key={c.userId || `contributor-${i}`} className="group glass-card-light dark:glass-card p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-white flex-shrink-0 group-hover:shadow-lg overflow-hidden">
                  {c.photoURL ? (
                    <img src={c.photoURL} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{c.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{c.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{c.contributions} contributions</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-slate-500">No contributors yet</div>
            )}
          </div>
        </div>
      </section>

      {/* Most Saved Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest mb-3">Popular Content</p>
            <h2 className="text-3xl md:text-4xl font-bold">Most Saved Lessons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mostSaved.length > 0 ? mostSaved.map((m, i) => {
              const mid = m._id || m.id
              const saved = m.savedCount ?? m.saved ?? 0
              return (
                <div key={mid} className="group glass-card-light dark:glass-card p-8 hover:scale-105 transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition">{m.title}</h4>
                    <div className="text-2xl">❤️</div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold mb-6">Saved {saved} times</p>
                  <Link to={`/lesson/${mid}`} className="btn btn-sm border-0 bg-slate-200 dark:bg-slate-700 hover:bg-primary hover:text-white text-slate-900 dark:text-slate-100 font-semibold mt-auto">
                    View Lesson →
                  </Link>
                </div>
              )
            }) : (
              <div className="col-span-full text-center py-12 text-slate-500">No saved lessons yet</div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
