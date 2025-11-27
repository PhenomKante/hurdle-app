import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function BattleStatus({ checkIns }: Props) {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">⚔️ Battle Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urge Level Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Urge Levels Over Time</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={urgeData} layout="vertical">
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" width={50} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
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

        {/* Victory Stats */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Victory Rate</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${actedPercent}%` }}
                />
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{actedPercent}%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {cleanCount} clean / {checkIns.length} total check-ins
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{cleanCount}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Victories</div>
            </div>
            <div className="flex-1 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{actedCount}</div>
              <div className="text-xs text-orange-700 dark:text-orange-300">Setbacks</div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Last Check-In Urge Level</div>
            <div className={`text-lg font-semibold capitalize ${
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
