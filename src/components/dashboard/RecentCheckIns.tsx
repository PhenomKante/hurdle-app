import { Link } from 'react-router-dom'
import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function RecentCheckIns({ checkIns }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">📋 Recent Check-Ins</h2>
        {checkIns.length > 5 && (
          <Link to="/history" className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View All →
          </Link>
        )}
      </div>
      
      {checkIns.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6 sm:py-8">No check-ins yet. Start your first one!</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {checkIns.slice(0, 5).map(checkIn => (
            <Link
              key={checkIn.id}
              to={`/check-in/${checkIn.id}`}
              className="block p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all active:scale-[0.99]"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100">
                      {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {checkIn.acted_on_urges ? (
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                        Tough Week
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                        Strong Week
                      </span>
                    )}
                  </div>
                  
                  {/* Ratings */}
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-xs sm:text-sm">
                    <span className="text-purple-600 dark:text-purple-400">
                      😊 {checkIn.rating_emotional ?? '—'}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      🙏 {checkIn.rating_spiritual ?? '—'}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      😰 {checkIn.rating_stress ?? '—'}
                    </span>
                  </div>

                  {/* Urge Level */}
                  <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    Urge: 
                    <span className={`ml-1 font-medium ${
                      checkIn.urge_level === 'none' ? 'text-green-600 dark:text-green-400' :
                      checkIn.urge_level === 'some' ? 'text-amber-600 dark:text-amber-400' :
                      checkIn.urge_level === 'strong' ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {checkIn.urge_level || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* HALT indicators */}
                <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-end max-w-[60px] sm:max-w-none text-sm sm:text-base">
                  {checkIn.halt_hungry && <span title="Hungry">🍽️</span>}
                  {checkIn.halt_angry && <span title="Angry">😤</span>}
                  {checkIn.halt_lonely && <span title="Lonely">😔</span>}
                  {checkIn.halt_tired && <span title="Tired">😴</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
