import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import { usePartnership } from '../../hooks/usePartnership'
import { useCheckIns } from '../../hooks/useCheckIns'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const { isDark, toggle } = useDarkMode()
  const { partnership } = usePartnership()
  const { currentWeekCheckIn } = useCheckIns(partnership?.id)

  // Dynamic check-in nav item based on whether one exists this week
  const checkInPath = currentWeekCheckIn 
    ? `/check-in/${currentWeekCheckIn.id}/edit` 
    : '/check-in'
  const checkInLabel = currentWeekCheckIn ? 'Edit Check-In' : 'New Check-In'

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: checkInPath, label: checkInLabel, icon: '✏️' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Hurdle
            </Link>
            
            <div className="flex items-center gap-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 text-sm ${
                    location.pathname === item.path 
                      ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-300">{profile?.full_name}</span>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
