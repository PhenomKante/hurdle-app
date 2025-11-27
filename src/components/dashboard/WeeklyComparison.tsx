import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function WeeklyComparison({ checkIns }: Props) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  // Split check-ins into this week and last week
  const thisWeek = checkIns.filter(c => new Date(c.check_in_date) >= oneWeekAgo)
  const lastWeek = checkIns.filter(c => {
    const date = new Date(c.check_in_date)
    return date >= twoWeeksAgo && date < oneWeekAgo
  })

  const calcAvg = (arr: CheckIn[], field: keyof CheckIn) => {
    const values = arr.map(c => c[field] as number | null).filter(v => v !== null) as number[]
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null
  }

  const metrics = [
    { 
      label: 'Emotional', 
      thisWeek: calcAvg(thisWeek, 'rating_emotional'),
      lastWeek: calcAvg(lastWeek, 'rating_emotional'),
      color: 'purple',
      higherIsBetter: true
    },
    { 
      label: 'Spiritual', 
      thisWeek: calcAvg(thisWeek, 'rating_spiritual'),
      lastWeek: calcAvg(lastWeek, 'rating_spiritual'),
      color: 'emerald',
      higherIsBetter: true
    },
    { 
      label: 'Stress', 
      thisWeek: calcAvg(thisWeek, 'rating_stress'),
      lastWeek: calcAvg(lastWeek, 'rating_stress'),
      color: 'amber',
      higherIsBetter: false
    },
  ]

  // Calculate urge improvement
  const thisWeekUrges = thisWeek.filter(c => c.urge_level === 'strong' || c.urge_level === 'some').length
  const lastWeekUrges = lastWeek.filter(c => c.urge_level === 'strong' || c.urge_level === 'some').length

  // Calculate acted on urges
  const thisWeekActed = thisWeek.filter(c => c.acted_on_urges).length
  const lastWeekActed = lastWeek.filter(c => c.acted_on_urges).length

  const hasData = thisWeek.length > 0 || lastWeek.length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">📊 Weekly Comparison</h2>
      
      {!hasData ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6 sm:py-8">Need more check-ins to compare weeks</p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Rating Comparisons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {metrics.map(metric => {
              const diff = metric.thisWeek !== null && metric.lastWeek !== null
                ? metric.thisWeek - metric.lastWeek
                : null
              const improved = diff !== null && (metric.higherIsBetter ? diff > 0 : diff < 0)
              const declined = diff !== null && (metric.higherIsBetter ? diff < 0 : diff > 0)
              
              return (
                <div key={metric.label} className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-transform hover:scale-[1.02]">
                  <div className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 truncate">{metric.label}</div>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <span className={`text-lg sm:text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>
                      {metric.thisWeek?.toFixed(1) ?? '—'}
                    </span>
                    {diff !== null && (
                      <span className={`text-[10px] sm:text-sm font-medium ${
                        improved ? 'text-green-600 dark:text-green-400' : declined ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                      }`}>
                        {improved ? '↑' : declined ? '↓' : '→'}
                        {Math.abs(diff).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 sm:mt-1 truncate">
                    Last: {metric.lastWeek?.toFixed(1) ?? '—'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Battle Comparison */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-transform hover:scale-[1.02]">
              <div className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">Urges This Week</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{thisWeekUrges}</span>
                {lastWeek.length > 0 && (
                  <span className={`text-[10px] sm:text-sm ${thisWeekUrges < lastWeekUrges ? 'text-green-600 dark:text-green-400' : thisWeekUrges > lastWeekUrges ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                    {thisWeekUrges < lastWeekUrges ? '↓' : thisWeekUrges > lastWeekUrges ? '↑' : '→'}
                    <span className="hidden sm:inline"> vs {lastWeekUrges} last</span>
                    <span className="sm:hidden"> {lastWeekUrges}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-transform hover:scale-[1.02]">
              <div className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">Setbacks This Week</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{thisWeekActed}</span>
                {lastWeek.length > 0 && (
                  <span className={`text-[10px] sm:text-sm ${thisWeekActed < lastWeekActed ? 'text-green-600 dark:text-green-400' : thisWeekActed > lastWeekActed ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                    {thisWeekActed < lastWeekActed ? '↓' : thisWeekActed > lastWeekActed ? '↑' : '→'}
                    <span className="hidden sm:inline"> vs {lastWeekActed} last</span>
                    <span className="sm:hidden"> {lastWeekActed}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Check-in Count */}
          <div className="text-center text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">
            {thisWeek.length} check-in{thisWeek.length !== 1 ? 's' : ''} this week
            {lastWeek.length > 0 && ` • ${lastWeek.length} last week`}
          </div>
        </div>
      )}
    </div>
  )
}
