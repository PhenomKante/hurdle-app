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
      Emotional: c.rating_emotional ?? undefined,
      Spiritual: c.rating_spiritual ?? undefined,
      Stress: c.rating_stress ?? undefined,
    }))

  const axisColor = isDark ? '#9ca3af' : '#6b7280'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#f9fafb' : '#1f2937'

  return (
    <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] relative overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            stroke={axisColor} 
            tick={{ fill: axisColor, fontSize: 11 }}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[1, 10]} 
            stroke={axisColor} 
            tick={{ fill: axisColor, fontSize: 11 }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: textColor,
              fontSize: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: textColor, fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ color: textColor, fontSize: '12px', paddingTop: '8px' }}
            iconSize={10}
          />
          <Line type="monotone" dataKey="Emotional" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 5 }} connectNulls strokeOpacity={0.9} />
          <Line type="monotone" dataKey="Spiritual" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 5 }} connectNulls strokeOpacity={0.9} />
          <Line type="monotone" dataKey="Stress" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 5 }} connectNulls strokeOpacity={0.9} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
