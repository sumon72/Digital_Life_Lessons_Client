import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Navbar() {
  const [theme, setTheme] = useState('light')
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
    ? `btn btn-ghost btn-circle w-12 h-12 border border-gray-200 ${textColor} hover:bg-neutral-100 transition transform duration-200`
    : `btn btn-ghost btn-circle w-12 h-12 border border-slate-700 ${textColor} hover:bg-slate-800 transition transform duration-200`

  return (
    <nav className={`navbar ${navBg} shadow-lg sticky top-0 z-50 justify-between h-20`}>
      {/* Left: Logo */}
      <Link to="/" className={`btn btn-ghost normal-case text-2xl font-bold ${textColor} ${linkHover}`}>
        📚 Digital Life Lessons
      </Link>

      {/* Center: Menu */}
      <ul className="menu menu-horizontal px-1 gap-2 absolute left-1/2 transform -translate-x-1/2">
        <li><Link to="/" className={`font-semibold ${textColor} ${linkHover}`}>Home</Link></li>
        <li><Link to="/public-lessons" className={`font-semibold ${textColor} ${linkHover}`}>Public Lessons</Link></li>
        <li><Link to="/pricing" className={`font-semibold ${textColor} ${linkHover}`}>Pricing</Link></li>
        <li><Link to="/dashboard" className={`font-semibold ${textColor} ${linkHover}`}>Dashboard</Link></li>
      </ul>

      {/* Right: Auth & Theme Toggle */}
      <div className="flex gap-3 items-center">
        {loading ? (
          <span className={`loading loading-spinner loading-sm ${textColor}`}></span>
        ) : isAuthenticated ? (
          <>
            <div className="dropdown dropdown-end">
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
          {theme === 'light' ? (
            <svg className={`w-6 h-6 ${theme === 'light' ? 'rotate-0' : 'rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 9 9 0 0120.354 15.354z" />
            </svg>
          ) : (
            <svg className={`w-6 h-6 ${theme === 'dark' ? 'rotate-0' : 'rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}
