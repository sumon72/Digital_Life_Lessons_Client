import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Navbar() {
  const [theme, setTheme] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, loading, userPlan } = useUser()

  useEffect(() => {
    const htmlElement = document.documentElement
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    htmlElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    htmlElement.setAttribute('data-theme', newTheme)
    // Notify other components on the page about theme change
    try {
      window.dispatchEvent(new CustomEvent('app-theme-changed', { detail: newTheme }))
    } catch (e) {
      // ignore if dispatch fails
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navBg = theme === 'light' ? 'bg-white text-neutral-900' : 'bg-slate-900 text-slate-100'
  const linkHover = theme === 'light' ? 'hover:bg-neutral-100' : 'hover:bg-slate-800'
  const textColor = theme === 'light' ? 'text-neutral-900' : 'text-slate-100'
  const subtleText = theme === 'light' ? 'text-neutral-700' : 'text-slate-300'
  const avatarBorder = theme === 'light' ? 'border-gray-200 hover:border-gray-300' : 'border-slate-700 hover:border-slate-600'
  const avatarInner = theme === 'light' ? 'bg-gray-100 text-neutral-900' : 'bg-slate-800 text-slate-100'
  const dropdownBg = theme === 'light' ? 'bg-white border border-gray-100' : 'bg-slate-900 border border-slate-700'
  const loginBtnClass = theme === 'light'
    ? 'btn btn-ghost btn-sm h-10 font-semibold text-neutral-900 hover:bg-neutral-100'
    : 'btn btn-ghost btn-sm h-10 font-semibold text-slate-100 hover:bg-slate-800'
  const signupBtnClass = theme === 'light'
    ? 'btn btn-sm h-10 font-semibold bg-primary text-white hover:bg-primary-focus'
    : 'btn btn-sm h-10 font-semibold bg-primary/90 text-white hover:bg-primary-focus'
  const themeBtnClass = theme === 'light'
    ? 'relative inline-flex items-center justify-between w-24 px-3 py-2 rounded-full border border-gray-200 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
    : 'relative inline-flex items-center justify-between w-24 px-3 py-2 rounded-full border border-slate-700 bg-slate-900/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'

  const isAuthed = isAuthenticated || !!user
  const baseLinkClass = `font-semibold ${textColor} ${linkHover}`
  const navLinks = [
    { to: '/', label: 'Home', show: true },
    { to: '/dashboard/add-lesson', label: 'Add Lesson', show: isAuthed },
    { to: '/dashboard/my-lessons', label: 'My Lessons', show: isAuthed },
    { to: '/public-lessons', label: 'Public Lessons', show: true },
    { to: '/pricing', label: userPlan?.isPremium ? 'Pricing' : 'Upgrade', show: isAuthed },
    { to: '/dashboard', label: 'Dashboard', show: isAuthed }
  ].filter(link => link.show)

  return (
    <nav className={`navbar ${navBg} shadow-lg sticky top-0 z-50 justify-between h-20`}>
      {/* Left: Logo */}
      <Link to="/" className={`btn btn-ghost normal-case text-2xl font-bold ${textColor} ${linkHover}`}>
        📚 Digital Life Lessons
      </Link>

      {/* Center: Menu (hidden on small screens) */}
      <ul className="menu menu-horizontal px-1 gap-2 absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
        {navLinks.map(link => (
          <li key={link.to}>
            <Link to={link.to} className={baseLinkClass}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right: Auth & Theme Toggle + Mobile menu toggle */}
      <div className="flex gap-3 items-center">
        {loading ? (
          <span className={`loading loading-spinner loading-sm ${textColor}`}></span>
        ) : isAuthenticated ? (
          <>
            {/* Avatar dropdown - hidden on mobile */}
            <div className="dropdown dropdown-end hidden md:block">
              <div tabIndex={0} className={`btn btn-ghost btn-circle avatar w-12 h-12 border-2 ${avatarBorder}`}>
                <div className={`w-10 rounded-full ${avatarInner} flex items-center justify-center overflow-hidden`}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user?.displayName} />
                  ) : (
                    <span className="font-bold text-lg">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className={`dropdown-content z-[1] menu p-2 shadow rounded-xl w-56 ${dropdownBg}`}
              >
                <li className="menu-title">
                  <span className="font-bold text-base">{user?.displayName || user?.email}</span>
                </li>
                {userPlan?.isPremium ? (
                  <li><span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 inline-block">Premium ⭐</span></li>
                ) : ("")}
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
            <>
            <Link to="/login" className={loginBtnClass}>Login</Link>
            <Link to="/register" className={signupBtnClass}>Sign Up</Link>
          </>
        )}
        
        <button
          onClick={toggleTheme}
          className={themeBtnClass}
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          aria-pressed={theme === 'dark'}
        >
          <span className={`flex items-center gap-1 text-xs font-semibold ${theme === 'light' ? 'text-amber-600' : 'text-slate-200'}`}>
            <span className="text-lg">☀️</span>
          </span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${theme === 'dark' ? 'text-amber-200' : 'text-slate-500'}`}>
            <span className="text-lg">🌙</span> 
          </span>
          <span
            className={`absolute inset-y-1 w-11 rounded-full shadow-sm transition-all duration-200 ${theme === 'light' ? 'left-1 bg-amber-100' : 'left-12 bg-slate-700'}`}
            aria-hidden="true"
          ></span>
        </button>

        {/* Mobile hamburger (shows right-side collapsed menu) */}
        <button
          className={`btn btn-ghost md:hidden ${textColor}`}
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile right-side collapsed panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <div className={`${dropdownBg} absolute right-0 top-0 h-full w-72 p-4 flex flex-col shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">Menu</span>
              <button className="btn btn-ghost" onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            <ul className="menu gap-1">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={baseLinkClass} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                </li>
              ))}
              
              {/* Profile & Logout for authenticated users on mobile */}
              {isAuthenticated && (
                <>
                  <div className="divider my-2"></div>
                  <li>
                    <Link to="/profile" className={baseLinkClass} onClick={() => setMobileOpen(false)}>
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <button 
                      className={baseLinkClass} 
                      onClick={() => { 
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      🚪 Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}
