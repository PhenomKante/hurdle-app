import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CheckIn } from '../../types/database'
import { useDarkMode } from '../../hooks/useDarkMode'

interface Props {
  checkIns: CheckIn[]
}

export function TrendChart({ checkIns }: Props) {
  const { isDark } = useDarkMode()

  const data = [...checkIns]
    .reverse()
    .slice(-10)
    .map(c => ({
      date: new Date(c.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Emotional: c.rating_emotional,
      Spiritual: c.rating_spiritual,
      Stress: c.rating_stress,
    }))

  const axisColor = isDark ? '#9ca3af' : '#6b7280'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#f9fafb' : '#1f2937'

  return (
    <div style={{ width: '100%', height: 300, position: 'relative', overflow: 'hidden' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="date" stroke={axisColor} tick={{ fill: axisColor }} />
          <YAxis domain={[1, 10]} stroke={axisColor} tick={{ fill: axisColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: textColor,
            }}
            labelStyle={{ color: textColor }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Line type="monotone" dataKey="Emotional" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
          <Line type="monotone" dataKey="Spiritual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
          <Line type="monotone" dataKey="Stress" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
