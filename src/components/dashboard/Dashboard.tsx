import { Link } from 'react-router-dom'
import { usePartnership } from '../../hooks/usePartnership'
import { useCheckIns } from '../../hooks/useCheckIns'
import { TrendChart } from './TrendChart'

export function Dashboard() {
  const { partnership, loading: partnershipLoading } = usePartnership()
  const { checkIns, loading: checkInsLoading } = useCheckIns(partnership?.id)

  if (partnershipLoading || checkInsLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  if (!partnership) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Hurdle</h2>
        <p className="text-gray-600 mb-6">You need to set up a partnership to get started.</p>
        <Link
          to="/settings"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Set Up Partnership
        </Link>
      </div>
    )
  }

  const lastCheckIn = checkIns[0]
  const daysSinceLastCheckIn = lastCheckIn
    ? Math.floor((Date.now() - new Date(lastCheckIn.check_in_date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const checkInsDue = daysSinceLastCheckIn === null || daysSinceLastCheckIn >= 3

  // Calculate streak (consecutive check-ins without acting on urges)
  let streak = 0
  for (const checkIn of checkIns) {
    if (checkIn.acted_on_urges) break
    streak++
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Partnership with {partnership.friend?.full_name || partnership.partner?.full_name}
          </p>
        </div>
        {checkInsDue && (
          <Link
            to="/check-in"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 animate-pulse"
          >
            New Check-In Due!
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-indigo-600">{checkIns.length}</div>
          <div className="text-gray-600">Total Check-Ins</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-green-600">{streak}</div>
          <div className="text-gray-600">Current Streak 🔥</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-amber-600">
            {daysSinceLastCheckIn ?? '—'}
          </div>
          <div className="text-gray-600">Days Since Last Check-In</div>
        </div>
      </div>

      {/* Trend Chart */}
      {checkIns.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trends Over Time</h2>
          <TrendChart checkIns={checkIns} />
        </div>
      )}

      {/* Recent Check-Ins */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Check-Ins</h2>
        {checkIns.length === 0 ? (
          <p className="text-gray-500">No check-ins yet. Start your first one!</p>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 5).map(checkIn => (
              <Link
                key={checkIn.id}
                to={`/check-in/${checkIn.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">
                      {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      Emotional: {checkIn.rating_emotional} | Spiritual: {checkIn.rating_spiritual} | Stress: {checkIn.rating_stress}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {checkIn.acted_on_urges ? (
                      <span className="text-orange-500">⚠️</span>
                    ) : (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
