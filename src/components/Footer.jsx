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

  return (
    <footer className={`footer footer-center p-6 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-neutral-900'}`}>
      <div>
        <p className="font-semibold">Digital Life Lessons © 2025</p>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Preserving Wisdom, Building Community</p>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-100' : 'text-neutral-700'}`}>Contact: <a href="mailto:info@digitallifelessons.com" className={`underline ${isDark ? 'text-slate-100' : 'text-neutral-800'}`}>info@digitallifelessons.com</a></p>
        <div className="flex gap-4 justify-center mt-3">
          <a href="#" className={`link link-hover ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Terms & Conditions</a>
          <a href="#" className={`link link-hover ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Privacy Policy</a>
          <a href="#" className={`link link-hover ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Contact</a>
        </div>
      </div>
    </footer>
  )
}
