import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function UpcomingChallenges({ checkIns }: Props) {
  // Get the most recent check-in with upcoming challenges or goals
  const lastCheckIn = checkIns[0]
  
  const hasContent = lastCheckIn && (
    lastCheckIn.upcoming_challenges ||
    lastCheckIn.planned_boundaries ||
    lastCheckIn.weekly_goal ||
    lastCheckIn.support_needed
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">🎯 Looking Ahead</h2>
      
      {!hasContent ? (
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Complete a check-in to set goals and identify challenges
        </p>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {/* Weekly Goal */}
          {lastCheckIn.weekly_goal && (
            <div className="p-2.5 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500 transition-transform hover:scale-[1.01]">
              <div className="text-[10px] sm:text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-0.5 sm:mb-1">Weekly Goal</div>
              <p className="text-xs sm:text-base text-indigo-900 dark:text-indigo-200 line-clamp-3">{lastCheckIn.weekly_goal}</p>
            </div>
          )}

          {/* Upcoming Challenges */}
          {lastCheckIn.upcoming_challenges && (
            <div className="p-2.5 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 transition-transform hover:scale-[1.01]">
              <div className="text-[10px] sm:text-xs font-medium text-amber-600 dark:text-amber-400 mb-0.5 sm:mb-1">Upcoming Challenges</div>
              <p className="text-xs sm:text-base text-amber-900 dark:text-amber-200 line-clamp-3">{lastCheckIn.upcoming_challenges}</p>
            </div>
          )}

          {/* Planned Boundaries */}
          {lastCheckIn.planned_boundaries && (
            <div className="p-2.5 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 transition-transform hover:scale-[1.01]">
              <div className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400 mb-0.5 sm:mb-1">Planned Boundaries</div>
              <p className="text-xs sm:text-base text-green-900 dark:text-green-200 line-clamp-3">{lastCheckIn.planned_boundaries}</p>
            </div>
          )}

          {/* Support Needed */}
          {lastCheckIn.support_needed && (
            <div className="p-2.5 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 transition-transform hover:scale-[1.01]">
              <div className="text-[10px] sm:text-xs font-medium text-purple-600 dark:text-purple-400 mb-0.5 sm:mb-1">Support Needed</div>
              <p className="text-xs sm:text-base text-purple-900 dark:text-purple-200 line-clamp-3">{lastCheckIn.support_needed}</p>
            </div>
          )}

          <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-right pt-1">
            From {new Date(lastCheckIn.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      )}
    </div>
  )
}
