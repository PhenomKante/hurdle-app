import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onToggle: () => void
}

export function SignupForm({ onToggle }: Props) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'partner' | 'friend'>('partner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password, fullName, role)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-5xl">✓</div>
        <h2 className="text-xl font-bold">Check your email!</h2>
        <p className="text-gray-600">We sent you a confirmation link to verify your account.</p>
        <button onClick={onToggle} className="text-indigo-600 hover:underline">
          Back to login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          minLength={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am...</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('partner')}
            className={`p-3 rounded-lg border-2 text-center transition ${
              role === 'partner' 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Accountability Partner</div>
            <div className="text-xs text-gray-500">Supporting a friend</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('friend')}
            className={`p-3 rounded-lg border-2 text-center transition ${
              role === 'friend' 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Friend</div>
            <div className="text-xs text-gray-500">On my journey</div>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={onToggle} className="text-indigo-600 hover:underline">
          Sign in
        </button>
      </p>
    </form>
  )
}
