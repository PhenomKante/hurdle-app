import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePartnership } from '../hooks/usePartnership'
import { useCheckIns } from '../hooks/useCheckIns'
import { isWithinCurrentWeek } from '../lib/dateUtils'

export function HistoryPage() {
  const { partnership } = usePartnership()
  const { checkIns, loading, deleteCheckIn } = useCheckIns(partnership?.id)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteCheckIn(id)
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Check-In History</h1>

      {checkIns.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No check-ins yet.</p>
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
            <div
              key={checkIn.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition border border-transparent dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <Link to={`/check-in/${checkIn.id}`} className="flex-1">
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-purple-600 dark:text-purple-400">Emotional: {checkIn.rating_emotional}/10</span>
                    <span className="text-green-600 dark:text-green-400">Spiritual: {checkIn.rating_spiritual}/10</span>
                    <span className="text-amber-600 dark:text-amber-400">Stress: {checkIn.rating_stress}/10</span>
                  </div>

                  {checkIn.weekly_goal && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Goal: {checkIn.weekly_goal}
                    </div>
                  )}
                </Link>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end gap-1">
                    {checkIn.acted_on_urges ? (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded">
                        Struggled
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        Victory ✓
                      </span>
                    )}
                    
                    {checkIn.urge_level === 'strong' && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                        Strong urges
                      </span>
                    )}
                  </div>

                  {isWithinCurrentWeek(checkIn.check_in_date) ? (
                    confirmDeleteId === checkIn.id ? (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleDelete(checkIn.id)}
                          disabled={deletingId === checkIn.id}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === checkIn.id ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(checkIn.id)}
                        className="mt-2 px-3 py-1 text-red-600 dark:text-red-400 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        Delete
                      </button>
                    )
                  ) : (
                    <span className="mt-2 px-2 py-1 text-gray-400 dark:text-gray-500 text-xs">
                      🔒 Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
