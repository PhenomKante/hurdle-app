import { useState, useEffect } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for dark mode preference
    const stored = localStorage.getItem('hurdle-dark-mode')
    if (stored !== null) {
      setIsDark(stored === 'true')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Hurdle</h1>
          <p className="text-gray-600 dark:text-gray-400">Accountability check-in tracker</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggle={() => setIsLogin(true)} />
          )}
        </div>

        {/* Dark mode toggle */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsDark(!isDark)
              localStorage.setItem('hurdle-dark-mode', String(!isDark))
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </div>
    </div>
  )
}
