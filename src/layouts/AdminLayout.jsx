import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function AdminLayout({ children }) {
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

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

  const isDark = theme === 'dark'
  const sidebarBg = isDark ? 'bg-slate-900' : 'bg-white'
  const sidebarBorder = isDark ? 'border-slate-700' : 'border-gray-200'
  const sidebarText = isDark ? 'text-slate-100' : 'text-neutral-900'
  const activeBg = isDark ? 'bg-slate-800 text-primary' : 'bg-gray-100 text-primary'
  const inactiveBg = isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📚', label: 'Manage Lessons', path: '/dashboard/lessons' },
    { icon: '👥', label: 'Manage Users', path: '/dashboard/users' },
    { icon: '📈', label: 'Analytics', path: '/dashboard/analytics' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' }
  ]

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`flex h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarBg} ${sidebarBorder} border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} shadow-md`}>
        {/* Logo */}
        {/* <div className={`flex items-center justify-center h-20 ${isDark ? 'border-slate-700' : 'border-gray-200'} border-b`}>
          <Link to="/" className={`text-2xl font-bold ${sidebarText}`}>
            {sidebarOpen ? '📚 DLL' : '📚'}
          </Link>
        </div> */}

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive(item.path)
                  ? activeBg
                  : `${sidebarText} ${inactiveBg}`
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl shadow-md p-6`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
