import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { CheckIn } from '../../types/database'
import { useDarkMode } from '../../hooks/useDarkMode'

interface Props {
  checkIns: CheckIn[]
}

export function BattleStatus({ checkIns }: Props) {
  const { isDark } = useDarkMode()
  
  // Urge level distribution
  const urgeLevels = { none: 0, some: 0, strong: 0 }
  checkIns.forEach(c => {
    if (c.urge_level && c.urge_level in urgeLevels) {
      urgeLevels[c.urge_level as keyof typeof urgeLevels]++
    }
  })

  const urgeData = [
    { name: 'None', value: urgeLevels.none, color: '#10b981' },
    { name: 'Some', value: urgeLevels.some, color: '#f59e0b' },
    { name: 'Strong', value: urgeLevels.strong, color: '#ef4444' },
  ]

  // Acted on urges stats
  const actedCount = checkIns.filter(c => c.acted_on_urges).length
  const cleanCount = checkIns.filter(c => c.acted_on_urges === false).length
  const actedPercent = checkIns.length > 0 ? Math.round((cleanCount / checkIns.length) * 100) : 0

  // Recent battle status (last check-in)
  const lastCheckIn = checkIns[0]
  const lastUrgeLevel = lastCheckIn?.urge_level || 'unknown'

  const axisColor = isDark ? '#9ca3af' : '#6b7280'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">⚔️ Battle Status</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Urge Level Distribution */}
        <div className="order-2 sm:order-1">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Urge Levels Over Time</h3>
          <div className="h-[120px] sm:h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={urgeData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <XAxis type="number" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={45} stroke={axisColor} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {urgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strong Week Stats */}
        <div className="space-y-3 sm:space-y-4 order-1 sm:order-2">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Strong Week Rate</h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${actedPercent}%` }}
                />
              </div>
              <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 min-w-[3rem] text-right">{actedPercent}%</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
              {cleanCount} clean / {checkIns.length} total
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-transform hover:scale-[1.02]">
              <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{cleanCount}</div>
              <div className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">Strong Weeks</div>
            </div>
            <div className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg transition-transform hover:scale-[1.02]">
              <div className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">{actedCount}</div>
              <div className="text-[10px] sm:text-xs text-orange-700 dark:text-orange-300">Tough Weeks</div>
            </div>
          </div>

          <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Last Urge Level</div>
            <div className={`text-base sm:text-lg font-semibold capitalize ${
              lastUrgeLevel === 'none' ? 'text-green-600 dark:text-green-400' :
              lastUrgeLevel === 'some' ? 'text-amber-600 dark:text-amber-400' :
              lastUrgeLevel === 'strong' ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
            }`}>
              {lastUrgeLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
