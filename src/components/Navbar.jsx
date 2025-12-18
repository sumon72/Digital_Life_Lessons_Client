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
    if (savedTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    htmlElement.setAttribute('data-theme', newTheme)
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
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

  const navBg = theme === 'light' 
    ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 text-neutral-900' 
    : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700 text-slate-100'
  const linkHover = theme === 'light' ? 'hover:bg-slate-100 hover:text-primary' : 'hover:bg-slate-800 hover:text-secondary'
  const textColor = theme === 'light' ? 'text-neutral-900' : 'text-slate-100'
  const subtleText = theme === 'light' ? 'text-neutral-700' : 'text-slate-300'
  const avatarBorder = theme === 'light' ? 'border-gray-300 hover:border-primary ring-2 ring-primary/20' : 'border-slate-600 hover:border-secondary ring-2 ring-secondary/20'
  const avatarInner = theme === 'light' ? 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary' : 'bg-gradient-to-br from-primary/30 to-secondary/30 text-secondary'
  const dropdownBg = theme === 'light' 
    ? 'bg-white backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl' 
    : 'bg-slate-900 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl'
  const loginBtnClass = theme === 'light'
    ? 'btn btn-ghost btn-sm h-10 font-semibold text-neutral-900 hover:bg-slate-100 hover:text-primary transition-all duration-200'
    : 'btn btn-ghost btn-sm h-10 font-semibold text-slate-100 hover:bg-slate-800 hover:text-secondary transition-all duration-200'
  const signupBtnClass = theme === 'light'
    ? 'btn btn-sm h-10 font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-200 border-0'
    : 'btn btn-sm h-10 font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-200 border-0'
  const themeBtnClass = theme === 'light'
    ? 'relative inline-flex items-center justify-between w-24 px-3 py-2 rounded-full border border-slate-200 bg-white/90 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
    : 'relative inline-flex items-center justify-between w-24 px-3 py-2 rounded-full border border-slate-700 bg-slate-800/90 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'

  const isAuthed = isAuthenticated || !!user
  const isAdmin = user?.role === 'admin'
  const baseLinkClass = `font-semibold text-sm transition-all duration-200 px-3 py-2 rounded-lg ${textColor} ${linkHover}`
  const navLinks = [
    { to: '/', label: 'Home', show: true },
    { to: '/dashboard/add-lesson', label: 'Add Lesson', show: isAuthed && !isAdmin },
    { to: '/dashboard/my-lessons', label: 'My Lessons', show: isAuthed && !isAdmin },
    { to: '/public-lessons', label: 'Public Lessons', show: true },
    { to: '/pricing', label: userPlan?.isPremium ? 'Pricing' : 'Upgrade', show: isAuthed && !isAdmin },
    { to: '/dashboard', label: 'Dashboard', show: isAuthed }
  ].filter(link => link.show)

  return (
    <nav className={`navbar ${navBg} shadow-lg sticky top-0 z-50 justify-between h-20 px-4 md:px-8 lg:px-12 rounded-b-2xl`}>
      {/* Left: Logo - Modern Brand */}
      <Link to="/" className={`btn btn-ghost normal-case text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:bg-none ${textColor} gap-2`}>
        <span className="text-2xl">📚</span>
        <span className="hidden sm:inline">Digital Life Lessons</span>
      </Link>

      {/* Center: Menu (hidden on small screens) */}
      <ul className="menu menu-horizontal px-1 gap-1 absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
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
                className={`dropdown-content z-[1] menu p-2 shadow rounded-2xl w-56 ${dropdownBg}`}
              >
                <li className="menu-title">
                  <span className="font-bold text-base">{user?.displayName || user?.email}</span>
                </li>
                {userPlan?.isPremium ? (
                  <li><span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900`}>Premium ⭐</span></li>
                ) : ("")}
                <li><Link to="/profile">👤 Profile</Link></li>
                <li><button onClick={handleLogout}>🚪 Logout</button></li>
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
          <span className={`flex items-center gap-1 text-xs font-semibold ${theme === 'light' ? 'text-amber-600' : 'text-slate-400'}`}>
            <span className="text-lg">☀️</span>
          </span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-slate-500'}`}>
            <span className="text-lg">🌙</span> 
          </span>
          <span
            className={`absolute inset-y-1 w-11 rounded-full shadow-sm transition-all duration-200 ${theme === 'light' ? 'left-1 bg-amber-100' : 'left-12 bg-slate-600'}`}
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-900'} absolute right-0 top-0 h-full w-72 p-4 flex flex-col shadow-2xl rounded-l-3xl border-l ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
            <div className="flex items-center justify-between mb-6">
              <span className={`font-bold text-lg ${textColor}`}>Menu</span>
              <button className={`btn btn-ghost btn-sm rounded-lg ${textColor}`} onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            <ul className={`menu gap-2 flex-1 rounded-2xl p-1 border ${theme === 'light' ? 'bg-white/95 text-neutral-900 border-slate-200/80' : 'bg-slate-900/95 text-slate-100 border-slate-700'}`}>
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={`${baseLinkClass} rounded-xl`} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                </li>
              ))}
              
              {/* Profile & Logout for authenticated users on mobile */}
              {isAuthenticated && (
                <>
                  <div className="divider my-2"></div>
                  <li>
                    <Link to="/profile" className={`${baseLinkClass} rounded-xl`} onClick={() => setMobileOpen(false)}>
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <button 
                      className={`${baseLinkClass} rounded-xl`} 
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
