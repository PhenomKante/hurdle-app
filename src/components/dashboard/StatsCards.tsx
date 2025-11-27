import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
  daysSinceLastCheckIn: number | null
}

export function StatsCards({ checkIns, daysSinceLastCheckIn }: Props) {
  // Calculate streak (consecutive check-ins without acting on urges)
  let streak = 0
  for (const checkIn of checkIns) {
    if (checkIn.acted_on_urges) break
    streak++
  }

  // Calculate averages for recent check-ins (last 5)
  const recent = checkIns.slice(0, 5)
  const avgEmotional = recent.length > 0
    ? (recent.reduce((sum, c) => sum + (c.rating_emotional || 0), 0) / recent.length).toFixed(1)
    : '—'
  const avgSpiritual = recent.length > 0
    ? (recent.reduce((sum, c) => sum + (c.rating_spiritual || 0), 0) / recent.length).toFixed(1)
    : '—'

  // Scripture reading consistency
  const scriptureCount = checkIns.filter(c => c.scripture_reading).length
  const scripturePercent = checkIns.length > 0
    ? Math.round((scriptureCount / checkIns.length) * 100)
    : 0

  const stats = [
    { value: checkIns.length, label: 'Total Check-Ins', color: 'text-indigo-600 dark:text-indigo-400', emoji: '' },
    { value: `${streak} 🔥`, label: 'Clean Streak', color: 'text-green-600 dark:text-green-400', emoji: '' },
    { value: daysSinceLastCheckIn ?? '—', label: 'Days Since', color: daysSinceLastCheckIn && daysSinceLastCheckIn >= 3 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400', emoji: '' },
    { value: avgEmotional, label: 'Avg Emotional', color: 'text-purple-600 dark:text-purple-400', emoji: '' },
    { value: avgSpiritual, label: 'Avg Spiritual', color: 'text-emerald-600 dark:text-emerald-400', emoji: '' },
    { value: `${scripturePercent}%`, label: 'Scripture', color: 'text-blue-600 dark:text-blue-400', emoji: '' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className={`text-xl sm:text-2xl font-bold ${stat.color} truncate`}>
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
