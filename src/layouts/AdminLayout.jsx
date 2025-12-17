import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function AdminLayout({ children }) {
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawer, setMobileDrawer] = useState(false)
  const location = useLocation()
  const { user } = useUser()

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

  const isAdmin = user?.role === 'admin'

  const navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard/admin', adminOnly: true },
    { icon: '👥', label: 'Manage Users', path: '/dashboard/admin/users', adminOnly: true },
    { icon: '📚', label: 'Manage Lessons', path: '/dashboard/admin/lessons', adminOnly: true },
    { icon: '🚩', label: 'Reported Lessons', path: '/dashboard/admin/reported', adminOnly: true },
    // { icon: '⚙️', label: 'Settings', path: '/dashboard/admin/settings', adminOnly: true }
  ]

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin)

  const isActive = (path) => {
    if (path === '/dashboard/admin') return location.pathname === '/dashboard/admin'
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className={`flex h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Sidebar (desktop) */}
      <aside className={`${sidebarBg} ${sidebarBorder} border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} shadow-md hidden md:block`}>
        <div className={`flex items-center justify-between h-16 px-4 ${isDark ? 'border-slate-700' : 'border-gray-200'} border-b`}>
          <Link to="#" className={`font-semibold ${sidebarText}`}>
            {sidebarOpen ? '📚 Admin Dashboard' : '📚'}
          </Link>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className={`btn btn-ghost btn-xs ${isDark ? 'text-slate-100' : 'text-gray-700'}`}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-3">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive(item.path)
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

      {/* Mobile drawer trigger */}
      <div className="md:hidden fixed">
        <button className="btn btn-ghost" onClick={() => setMobileDrawer(true)} aria-label="Open admin menu">➡️</button>
      </div>

      {/* Mobile drawer */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDrawer(false)} />
          <div className={`${sidebarBg} ${sidebarBorder} absolute left-0 top-0 h-full w-72 shadow-xl`}>
            <div className={`flex items-center justify-between h-16 px-4 ${isDark ? 'border-slate-700' : 'border-gray-200'} border-b`}>
              <span className={`font-semibold ${sidebarText}`}>📚 Admin</span>
              <button className="btn btn-ghost" onClick={() => setMobileDrawer(false)}>✕</button>
            </div>
            <nav className="mt-6 space-y-2 px-3">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive(item.path)
                      ? activeBg
                      : `${sidebarText} ${inactiveBg}`
                    }`}
                  onClick={() => setMobileDrawer(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

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
