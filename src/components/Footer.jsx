import { useState, useEffect } from 'react'

export default function Footer() {
  const [theme, setTheme] = useState(() => {
    return (document.documentElement?.getAttribute('data-theme')) || localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    const onTheme = (e) => {
      const newTheme = e?.detail || (document.documentElement?.getAttribute('data-theme')) || localStorage.getItem('theme')
      setTheme(newTheme)
    }
    window.addEventListener('app-theme-changed', onTheme)
    return () => window.removeEventListener('app-theme-changed', onTheme)
  }, [])

  const isDark = theme === 'dark'
  const bgClass = isDark 
    ? 'bg-gradient-to-t from-slate-900 via-slate-900 to-slate-800 text-slate-100 border-t border-slate-700' 
    : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-t border-slate-200'
  const linkClass = isDark 
    ? 'hover:text-secondary transition-colors duration-200' 
    : 'hover:text-primary transition-colors duration-200'

  return (
    <footer className={`${bgClass} mt-24 py-12 md:py-16 px-4 md:px-8 lg:px-16`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              📚 Digital Life
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Preserving wisdom, building community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className={linkClass}>Home</a></li>
              <li><a href="/public-lessons" className={linkClass}>Lessons</a></li>
              <li><a href="/pricing" className={linkClass}>Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClass}>Blog</a></li>
              <li><a href="#" className={linkClass}>Community</a></li>
              <li><a href="#" className={linkClass}>Help Center</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClass}>Terms & Conditions</a></li>
              <li><a href="#" className={linkClass}>Privacy Policy</a></li>
              <li><a href="mailto:info@digitallifelessons.com" className={linkClass}>Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'} mb-8`}></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            © 2025 Digital Life Lessons. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-6 mt-6 md:mt-0">
            <a href="#" className={`text-2xl transition-transform duration-200 hover:scale-110`}>𝕏</a>
            <a href="#" className={`text-2xl transition-transform duration-200 hover:scale-110`}>f</a>
            <a href="#" className={`text-2xl transition-transform duration-200 hover:scale-110`}>in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
