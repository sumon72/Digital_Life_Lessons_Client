import { useState, useEffect } from 'react'

export default function Navbar() {
  const [theme, setTheme] = useState('light')

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
  }

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50 justify-between">
      {/* Left: Logo */}
      <a href="/" className="btn btn-ghost normal-case text-xl font-bold">
        📚 DLL
      </a>

      {/* Center: Menu */}
      <ul className="menu menu-horizontal px-1 gap-2 absolute left-1/2 transform -translate-x-1/2">
        <li><a href="/">Home</a></li>
        <li><a href="/public-lessons">Public Lessons</a></li>
      </ul>

      {/* Right: Auth & Theme Toggle */}
      <div className="flex gap-2">
        <li className="list-none"><a href="/login" className="btn btn-ghost btn-sm">Login</a></li>
        <li className="list-none"><a href="/signup" className="btn btn-ghost btn-sm">Sign Up</a></li>
        <button
          onClick={toggleTheme}
          className="btn btn-square btn-ghost"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 9 9 0 0120.354 15.354z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}
