import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/api'
import { useUser } from '../context/UserContext'

const sampleFeatured = [
  { id: 1, title: 'How to Navigate Tough Conversations', excerpt: 'Practical methods to stay calm and be heard.', author: 'A. Rivera', saved: 124 },
  { id: 2, title: 'Money Mindset for Young Adults', excerpt: 'Build sustainable habits that grow with you.', author: 'S. Lee', saved: 98 },
  { id: 3, title: 'Setting Boundaries Without Guilt', excerpt: 'Simple rules to protect your time and energy.', author: 'M. Khan', saved: 86 }
]

const sampleContributors = [
  { id: 1, name: 'Alex Rivera', avatar: '', contributions: 12 },
  { id: 2, name: 'Sara Lee', avatar: '', contributions: 9 },
  { id: 3, name: 'Maya Khan', avatar: '', contributions: 7 }
]

const sampleMostSaved = [
  { id: 11, title: 'Mindful Mornings', saved: 420 },
  { id: 22, title: 'Career Pivot Guide', saved: 387 },
  { id: 33, title: 'Difficult Feedback', saved: 332 }
]

function HeroSlider() {
  const slides = [
    {
      title: 'Share What Matters',
      desc: 'Turn your life lessons into lasting guides for others.',
      cta: { to: '/dashboard/add-lesson', label: 'Share a Lesson' },
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(139, 92, 246, 0.7) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
      bgSize: 'cover',
      bgPos: 'center'
    },
    {
      title: 'Learn from Community',
      desc: 'Discover practical advice written by people like you.',
      cta: { to: '/public-lessons', label: 'Explore Lessons' },
      bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(59, 130, 246, 0.7) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
      bgSize: 'cover',
      bgPos: 'center'
    },
    {
      title: 'Preserve Wisdom',
      desc: 'Keep meaningful stories and make them easy to find.',
      cta: { to: '/register', label: 'Join the Community' },
      bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(79, 70, 229, 0.7) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")',
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
    <section className="relative w-full overflow-hidden rounded-xl shadow-md h-80">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: slides[index].bg,
          backgroundSize: slides[index].bgSize,
          backgroundPosition: slides[index].bgPos,
          transition: 'background-image 0.7s ease-in-out'
        }}
      />
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{slides[index].title}</h2>
          <p className="mt-3 text-base md:text-lg text-white/95 max-w-xl mx-auto leading-relaxed">{slides[index].desc}</p>
          <div className="mt-6">
            <Link to={slides[index].cta.to} className="btn bg-white text-primary font-semibold border-0 hover:bg-gray-100 shadow-md h-11 px-8">
              {slides[index].cta.label}
            </Link>
          </div>
        </div>
      </div>


      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <button aria-label="Previous" onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)} className="btn btn-circle btn-sm bg-white/20 border-0 text-white hover:bg-white/40 backdrop-blur">◀</button>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        <button aria-label="Next" onClick={() => setIndex(i => (i + 1) % slides.length)} className="btn btn-circle btn-sm bg-white/20 border-0 text-white hover:bg-white/40 backdrop-blur">▶</button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
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
          api.get('/lessons/featured'),
          api.get('/contributors/top-week'),
          api.get('/lessons/most-saved')
        ])

        if (!mounted) return

        if (featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value.data) && featuredRes.value.data.length > 0) {
          setFeatured(featuredRes.value.data.slice(0, 3))
        } else {
          setFeatured(sampleFeatured)
        }

        if (contributorsRes.status === 'fulfilled' && Array.isArray(contributorsRes.value.data) && contributorsRes.value.data.length > 0) {
          setContributors(contributorsRes.value.data)
        } else {
          setContributors(sampleContributors)
        }

        if (mostSavedRes.status === 'fulfilled' && Array.isArray(mostSavedRes.value.data) && mostSavedRes.value.data.length > 0) {
          setMostSaved(mostSavedRes.value.data.slice(0, 3))
        } else {
          setMostSaved(sampleMostSaved)
        }
      } catch (e) {
        console.error('Error fetching lessons:', e)
        setFeatured(sampleFeatured)
        setContributors(sampleContributors)
        setMostSaved(sampleMostSaved)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  return (
    <main className="space-y-12 px-4 md:px-8 lg:px-16 py-8">
      <HeroSlider />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Featured Life Lessons</h3>
          {user?.role === 'admin' && (
            <Link to="/dashboard/admin/lessons" className="text-sm text-primary underline">Manage lessons (admin)</Link>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="p-6 bg-base-100 rounded-lg shadow">Loading...</div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(f => (
              <article key={f._id} className="p-6 bg-base-100 rounded-lg shadow hover:shadow-md transition">
                <h4 className="text-lg font-semibold">{f.title}</h4>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{f.content}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-neutral-500">By {f.author}</div>
                  <div className="badge badge-sm">{f.status}</div>
                </div>
                <div className="mt-4">
                  <Link to={`/lessons/${f._id}`} className="btn btn-outline btn-sm">Read</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4">Why Learning From Life Matters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-base-100 rounded-lg shadow">
            <h4 className="font-semibold">Real Experience</h4>
            <p className="mt-2 text-sm text-neutral-600">Lessons are rooted in real events — practical and actionable.</p>
          </div>
          <div className="p-6 bg-base-100 rounded-lg shadow">
            <h4 className="font-semibold">Time-Saving</h4>
            <p className="mt-2 text-sm text-neutral-600">Avoid common mistakes by learning from others' stories.</p>
          </div>
          <div className="p-6 bg-base-100 rounded-lg shadow">
            <h4 className="font-semibold">Empathy & Context</h4>
            <p className="mt-2 text-sm text-neutral-600">Understand the human side behind decisions and outcomes.</p>
          </div>
          <div className="p-6 bg-base-100 rounded-lg shadow">
            <h4 className="font-semibold">Legacy</h4>
            <p className="mt-2 text-sm text-neutral-600">Preserve valuable knowledge for future readers.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Top Contributors This Week</h3>
          <Link to="/contributors" className="text-sm text-primary underline">See all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contributors.map(c => (
            <div key={c.id} className="p-4 bg-base-100 rounded-lg shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">{c.name?.charAt(0)}</div>
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-neutral-500">{c.contributions} contributions</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Most Saved Lessons</h3>
          <Link to="/lessons" className="text-sm text-primary underline">Browse all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mostSaved.map(m => (
            <div key={m.id} className="p-4 bg-base-100 rounded-lg shadow">
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-neutral-500 mt-2">Saved {m.saved} times</div>
              <div className="mt-3">
                <Link to={`/lessons/${m.id}`} className="btn btn-outline btn-sm">Open</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
