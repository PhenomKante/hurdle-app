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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">🏆 Wins & Growth</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Wins */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Recent Victories</h3>
          {recentWins.length > 0 ? (
            <div className="space-y-3">
              {recentWins.map(win => (
                <div key={win.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">
                    {new Date(win.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {win.what_went_well && (
                    <p className="text-sm text-green-800 dark:text-green-200 mb-1">✨ {win.what_went_well}</p>
                  )}
                  {win.proud_of && (
                    <p className="text-sm text-green-800 dark:text-green-200 mb-1">💪 {win.proud_of}</p>
                  )}
                  {win.god_showed_up && (
                    <p className="text-sm text-green-800 dark:text-green-200">🙏 {win.god_showed_up}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No wins recorded yet. Keep going!</p>
          )}
        </div>

        {/* What's Working */}
        <div className="space-y-4">
          {/* Top Coping Strategies */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Top Coping Strategies</h3>
            {topStrategies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topStrategies.map(([strategy, count]) => (
                  <span 
                    key={strategy}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                  >
                    {strategy} ({count}x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No strategies recorded yet</p>
            )}
          </div>

          {/* What Helped */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">What's Helped</h3>
            {helpfulThings.length > 0 ? (
              <div className="space-y-2">
                {helpfulThings.map((thing, i) => (
                  <div key={i} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
                    💡 {thing}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm">Keep tracking what helps!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
