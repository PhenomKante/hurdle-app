import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function TriggerPatterns({ checkIns }: Props) {
  // Aggregate trigger days
  const dayCounts: Record<string, number> = {}
  const timeCounts: Record<string, number> = {}
  const locationCounts: Record<string, number> = {}

  checkIns.forEach(c => {
    c.trigger_days?.forEach(day => {
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })
    c.trigger_times?.forEach(time => {
      timeCounts[time] = (timeCounts[time] || 0) + 1
    })
    c.trigger_locations?.forEach(loc => {
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    })
  })

  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])
  const sortedTimes = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])
  const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])

  const maxDayCount = Math.max(...Object.values(dayCounts), 1)
  const maxTimeCount = Math.max(...Object.values(timeCounts), 1)

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const allTimes = ['Morning', 'Afternoon', 'Evening', 'Night']

  const hasData = sortedDays.length > 0 || sortedTimes.length > 0 || sortedLocations.length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">📍 Trigger Patterns</h2>
      
      {!hasData ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6 sm:py-8">No trigger patterns recorded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Day Heatmap */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">High-Risk Days</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {allDays.map(day => {
                const count = dayCounts[day] || 0
                const intensity = count / maxDayCount
                return (
                  <div key={day} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 w-8 sm:w-12">{day.slice(0, 3)}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded h-4 sm:h-5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${intensity * 100}%`,
                          backgroundColor: intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 w-3 sm:w-4 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Time Heatmap */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">High-Risk Times</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {allTimes.map(time => {
                const count = timeCounts[time] || 0
                const intensity = count / maxTimeCount
                return (
                  <div key={time} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 w-14 sm:w-16">{time}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded h-4 sm:h-5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${intensity * 100}%`,
                          backgroundColor: intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 w-3 sm:w-4 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Locations */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">High-Risk Locations</h3>
            {sortedLocations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2">
                {sortedLocations.slice(0, 5).map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded transition-transform hover:scale-[1.01]">
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate mr-2">{location}</span>
                    <span className="text-[10px] sm:text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                      {count}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">No locations recorded</p>
            )}
          </div>
        </div>
      )}

      {/* Top Trigger Summary */}
      {(sortedDays.length > 0 || sortedTimes.length > 0) && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300 mb-1 sm:mb-2">⚠️ Watch Out For</h3>
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
            {sortedDays[0] && `${sortedDays[0][0]}s`}
            {sortedDays[0] && sortedTimes[0] && ' in the '}
            {sortedTimes[0] && sortedTimes[0][0].toLowerCase()}
            {sortedLocations[0] && ` at ${sortedLocations[0][0]}`}
            {' — these are your highest-risk patterns.'}
          </p>
        </div>
      )}
    </div>
  )
}
