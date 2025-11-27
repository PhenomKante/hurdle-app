import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { CheckIn } from '../../types/database'
import { useDarkMode } from '../../hooks/useDarkMode'

interface Props {
  checkIns: CheckIn[]
}

export function HALTChart({ checkIns }: Props) {
  const { isDark } = useDarkMode()
  
  // Count HALT factors
  const haltCounts = {
    Hungry: checkIns.filter(c => c.halt_hungry).length,
    Angry: checkIns.filter(c => c.halt_angry).length,
    Lonely: checkIns.filter(c => c.halt_lonely).length,
    Tired: checkIns.filter(c => c.halt_tired).length,
  }

  const totalHalt = Object.values(haltCounts).reduce((a, b) => a + b, 0)

  const data = [
    { name: 'Hungry', value: haltCounts.Hungry, color: '#f97316' },
    { name: 'Angry', value: haltCounts.Angry, color: '#ef4444' },
    { name: 'Lonely', value: haltCounts.Lonely, color: '#8b5cf6' },
    { name: 'Tired', value: haltCounts.Tired, color: '#6366f1' },
  ].filter(d => d.value > 0)

  // Find most common trigger
  const mostCommon = Object.entries(haltCounts).sort((a, b) => b[1] - a[1])[0]

  // Recent HALT status (last check-in)
  const last = checkIns[0]
  const lastHalt = last ? [
    last.halt_hungry && 'Hungry',
    last.halt_angry && 'Angry',
    last.halt_lonely && 'Lonely',
    last.halt_tired && 'Tired',
  ].filter(Boolean) : []

  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">🛑 HALT Factors</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart */}
        <div className="order-2 sm:order-1">
          {totalHalt > 0 ? (
            <div className="h-[160px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[160px] sm:h-[200px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              No HALT factors recorded yet
            </div>
          )}
        </div>

        {/* HALT Breakdown */}
        <div className="space-y-2 sm:space-y-3 order-1 sm:order-2">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(haltCounts).map(([name, count]) => (
              <div key={name} className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">
                    {name === 'Hungry' && '🍽️'}
                    {name === 'Angry' && '😤'}
                    {name === 'Lonely' && '😔'}
                    {name === 'Tired' && '😴'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">{count}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mostCommon && mostCommon[1] > 0 && (
            <div className="p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300">Most Common Trigger</div>
              <div className="text-base sm:text-lg font-semibold text-amber-800 dark:text-amber-200">{mostCommon[0]}</div>
              <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">
                {Math.round((mostCommon[1] / checkIns.length) * 100)}% of check-ins
              </div>
            </div>
          )}

          {lastHalt.length > 0 && (
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">Last Check-In HALT</div>
              <div className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-200">{lastHalt.join(', ')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
