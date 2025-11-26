import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CheckIn } from '../../types/database'

interface Props {
  checkIns: CheckIn[]
}

export function TrendChart({ checkIns }: Props) {
  const data = [...checkIns]
    .reverse()
    .slice(-10)
    .map(c => ({
      date: new Date(c.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Emotional: c.rating_emotional,
      Spiritual: c.rating_spiritual,
      Stress: c.rating_stress,
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[1, 10]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Emotional" stroke="#8b5cf6" strokeWidth={2} />
        <Line type="monotone" dataKey="Spiritual" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="Stress" stroke="#f59e0b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
