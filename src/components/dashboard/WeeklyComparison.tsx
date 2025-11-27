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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">📊 Weekly Comparison</h2>
      
      {!hasData ? (
        <p className="text-gray-400 dark:text-gray-500 text-center py-8">Need more check-ins to compare weeks</p>
      ) : (
        <div className="space-y-6">
          {/* Rating Comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map(metric => {
              const diff = metric.thisWeek !== null && metric.lastWeek !== null
                ? metric.thisWeek - metric.lastWeek
                : null
              const improved = diff !== null && (metric.higherIsBetter ? diff > 0 : diff < 0)
              const declined = diff !== null && (metric.higherIsBetter ? diff < 0 : diff > 0)
              
              return (
                <div key={metric.label} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.label}</div>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>
                      {metric.thisWeek?.toFixed(1) ?? '—'}
                    </span>
                    {diff !== null && (
                      <span className={`text-sm font-medium ${
                        improved ? 'text-green-600 dark:text-green-400' : declined ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                      }`}>
                        {improved ? '↑' : declined ? '↓' : '→'}
                        {Math.abs(diff).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Last week: {metric.lastWeek?.toFixed(1) ?? '—'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Battle Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Urges This Week</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{thisWeekUrges}</span>
                {lastWeek.length > 0 && (
                  <span className={`text-sm ${thisWeekUrges < lastWeekUrges ? 'text-green-600 dark:text-green-400' : thisWeekUrges > lastWeekUrges ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                    {thisWeekUrges < lastWeekUrges ? '↓' : thisWeekUrges > lastWeekUrges ? '↑' : '→'}
                    vs {lastWeekUrges} last week
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Setbacks This Week</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{thisWeekActed}</span>
                {lastWeek.length > 0 && (
                  <span className={`text-sm ${thisWeekActed < lastWeekActed ? 'text-green-600 dark:text-green-400' : thisWeekActed > lastWeekActed ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                    {thisWeekActed < lastWeekActed ? '↓' : thisWeekActed > lastWeekActed ? '↑' : '→'}
                    vs {lastWeekActed} last week
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Check-in Count */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {thisWeek.length} check-in{thisWeek.length !== 1 ? 's' : ''} this week
            {lastWeek.length > 0 && ` • ${lastWeek.length} last week`}
          </div>
        </div>
      )}
    </div>
  )
}
