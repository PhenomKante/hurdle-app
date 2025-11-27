import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function WinsHighlight({ checkIns }: Props) {
  // Get recent wins (last 3 check-ins with wins content)
  const recentWins = checkIns
    .filter(c => c.what_went_well || c.proud_of || c.god_showed_up)
    .slice(0, 3)

  // Aggregate coping strategies that work
  const copingCounts: Record<string, number> = {}
  checkIns.forEach(c => {
    c.coping_strategies?.forEach(strategy => {
      copingCounts[strategy] = (copingCounts[strategy] || 0) + 1
    })
  })
  const topStrategies = Object.entries(copingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // What helped most (aggregate)
  const helpfulThings = checkIns
    .filter(c => c.what_helped)
    .map(c => c.what_helped)
    .slice(0, 3)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">🏆 Wins & Growth</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Wins */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Recent Victories</h3>
          {recentWins.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentWins.map(win => (
                <div key={win.id} className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 transition-transform hover:scale-[1.01]">
                  <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mb-1">
                    {new Date(win.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {win.what_went_well && (
                    <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 mb-1 line-clamp-2">✨ {win.what_went_well}</p>
                  )}
                  {win.proud_of && (
                    <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 mb-1 line-clamp-2">💪 {win.proud_of}</p>
                  )}
                  {win.god_showed_up && (
                    <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 line-clamp-2">🙏 {win.god_showed_up}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">No wins recorded yet. Keep going!</p>
          )}
        </div>

        {/* What's Working */}
        <div className="space-y-3 sm:space-y-4">
          {/* Top Coping Strategies */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Top Coping Strategies</h3>
            {topStrategies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {topStrategies.map(([strategy, count]) => (
                  <span 
                    key={strategy}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] sm:text-sm transition-transform hover:scale-105"
                  >
                    {strategy} ({count}x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">No strategies recorded yet</p>
            )}
          </div>

          {/* What Helped */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">What's Helped</h3>
            {helpfulThings.length > 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                {helpfulThings.map((thing, i) => (
                  <div key={i} className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs sm:text-sm text-blue-800 dark:text-blue-200 line-clamp-2">
                    💡 {thing}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Keep tracking what helps!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
