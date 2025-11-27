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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{checkIns.length}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Check-Ins</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{streak} 🔥</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Clean Streak</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className={`text-2xl font-bold ${daysSinceLastCheckIn && daysSinceLastCheckIn >= 3 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
          {daysSinceLastCheckIn ?? '—'}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Days Since Check-In</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgEmotional}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Emotional</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{avgSpiritual}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Spiritual</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{scripturePercent}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Scripture Reading</div>
      </div>
    </div>
  )
}
