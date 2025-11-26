import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePartnership } from '../hooks/usePartnership'

export function SettingsPage() {
  const { profile, user } = useAuth()
  const { partnership, createPartnership, refetch } = usePartnership()
  const [partnerCode, setPartnerCode] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleCreatePartnership(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setMessage('')

    if (profile?.role === 'partner') {
      // Partner generates their user ID as invite code
      setInviteCode(user.id)
      setMessage('Share this code with your friend!')
    } else {
      // Friend joins with partner's code (user ID)
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
        <div className="space-y-2">
          <div>
            <span className="text-gray-500">Name:</span>{' '}
            <span className="font-medium">{profile?.full_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Role:</span>{' '}
            <span className="font-medium capitalize">{profile?.role}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>{' '}
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Partnership */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Partnership</h2>
        
        {partnership ? (
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Partner:</span>{' '}
              <span className="font-medium">{partnership.partner?.full_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Friend:</span>{' '}
              <span className="font-medium">{partnership.friend?.full_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Since:</span>{' '}
              <span className="font-medium">
                {partnership.created_at ? new Date(partnership.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreatePartnership} className="space-y-4">
            {profile?.role === 'partner' ? (
              <>
                <p className="text-gray-600">
                  Generate an invite code to share with your friend.
                </p>
                {inviteCode && (
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Your invite code:</div>
                    <div className="font-mono text-lg text-indigo-600 break-all">{inviteCode}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600">
                  Enter the invite code from your accountability partner.
                </p>
                <input
                  type="text"
                  value={partnerCode}
                  onChange={e => setPartnerCode(e.target.value)}
                  placeholder="Paste invite code here"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </>
            )}

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : profile?.role === 'partner' ? 'Generate Code' : 'Join Partnership'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
