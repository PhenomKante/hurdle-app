import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePartnership } from '../hooks/usePartnership'
import { useDarkMode } from '../hooks/useDarkMode'

export function SettingsPage() {
  const { profile, user, signOut } = useAuth()
  const { partnership, createPartnership, refetch } = usePartnership()
  const { isDark, toggle } = useDarkMode()
  const [partnerCode, setPartnerCode] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleCreatePartnership(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setMessage('')

    if (profile?.role === 'partner') {
      setInviteCode(user.id)
      setMessage('Share this code with your friend!')
    } else {
      const { error } = await createPartnership(partnerCode)
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('Partnership created!')
        refetch()
      }
    }
    setLoading(false)
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const roleDisplay = profile?.role === 'partner' ? 'Accountability Partner' : 'Friend'
  const roleIcon = profile?.role === 'partner' ? '🤝' : '💪'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold">{profile?.full_name || 'User'}</h2>
              <div className="flex items-center gap-2 mt-1 text-white/80">
                <span>{roleIcon}</span>
                <span className="text-sm">{roleDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">✉️</span>
              <span className="text-gray-500 dark:text-gray-400">Email</span>
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-100">{user?.email}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-500 dark:text-gray-400">Member since</span>
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              }) : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">🔑</span>
              <span className="text-gray-500 dark:text-gray-400">User ID</span>
            </div>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {user?.id}
            </span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎨</span>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Appearance</h2>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isDark ? '🌙' : '☀️'}</span>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-100">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isDark ? 'Easy on the eyes' : 'Bright and clear'}
              </div>
            </div>
          </div>
          <button
            onClick={toggle}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              isDark ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                isDark ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Partnership */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🤝</span>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Partnership</h2>
        </div>
        
        {partnership ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                <span>✓</span>
                <span>Active Partnership</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                You're connected and ready to track progress together.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    🤝
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Partner</div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {partnership.partner?.full_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    💪
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Friend</div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {partnership.friend?.full_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                    📅
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connected since</div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {partnership.created_at 
                        ? new Date(partnership.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreatePartnership} className="space-y-4">
            {profile?.role === 'partner' ? (
              <>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-medium mb-2">
                    <span>💡</span>
                    <span>How to connect</span>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Generate an invite code below and share it with your friend. They'll enter it in their app to connect with you.
                  </p>
                </div>

                {inviteCode && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your invite code:</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-100 break-all">
                        {inviteCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(inviteCode)}
                        className="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        {copied ? '✓' : '📋'}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">Copied to clipboard!</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-medium mb-2">
                    <span>💡</span>
                    <span>Connect with your partner</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Ask your accountability partner for their invite code and paste it below to connect.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={e => setPartnerCode(e.target.value)}
                    placeholder="Paste your partner's invite code"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </>
            )}

            {message && (
              <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${
                message.startsWith('Error') 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' 
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              }`}>
                <span>{message.startsWith('Error') ? '⚠️' : '✓'}</span>
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (profile?.role === 'friend' && !partnerCode.trim())}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing...
                </span>
              ) : profile?.role === 'partner' ? (
                'Generate Invite Code'
              ) : (
                'Join Partnership'
              )}
            </button>
          </form>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">⚙️</span>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account</h2>
        </div>
        
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
        <p>Hurdle v1.0</p>
        <p className="mt-1">Your accountability journey, one check-in at a time.</p>
      </div>
    </div>
  )
}
