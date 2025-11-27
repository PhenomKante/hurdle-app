interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  lowLabel?: string
  highLabel?: string
}

export function RatingSlider({ label, value, onChange, lowLabel = 'Low', highLabel = 'High' }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}
