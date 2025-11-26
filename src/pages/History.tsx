import { Link } from 'react-router-dom'
import { usePartnership } from '../hooks/usePartnership'
import { useCheckIns } from '../hooks/useCheckIns'

export function HistoryPage() {
  const { partnership } = usePartnership()
  const { checkIns, loading } = useCheckIns(partnership?.id)

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Check-In History</h1>

      {checkIns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">No check-ins yet.</p>
          <Link
            to="/check-in"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start Your First Check-In
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {checkIns.map(checkIn => (
            <Link
              key={checkIn.id}
              to={`/check-in/${checkIn.id}`}
              className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-purple-600">Emotional: {checkIn.rating_emotional}/10</span>
                    <span className="text-green-600">Spiritual: {checkIn.rating_spiritual}/10</span>
                    <span className="text-amber-600">Stress: {checkIn.rating_stress}/10</span>
                  </div>

                  {checkIn.weekly_goal && (
                    <div className="mt-2 text-sm text-gray-600">
                      Goal: {checkIn.weekly_goal}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {checkIn.acted_on_urges ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      Struggled
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Victory ✓
                    </span>
                  )}
                  
                  {checkIn.urge_level === 'strong' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Strong urges
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
