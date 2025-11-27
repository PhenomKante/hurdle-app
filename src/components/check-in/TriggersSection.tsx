import type { CheckInInsert } from '../../types/database'

interface Props {
  data: Partial<CheckInInsert>
  onChange: (updates: Partial<CheckInInsert>) => void
}

export function TriggersSection({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">🔍 Triggers & Patterns</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Help identify what's driving the struggle.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What were your biggest stress points this week?
        </label>
        <textarea
          value={data.stress_points || ''}
          onChange={e => onChange({ stress_points: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Using HALT, were any of these factors present during temptation?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'halt_hungry', label: 'Hungry', emoji: '🍽️' },
            { key: 'halt_angry', label: 'Angry / Anxious', emoji: '😤' },
            { key: 'halt_lonely', label: 'Lonely', emoji: '😔' },
            { key: 'halt_tired', label: 'Tired', emoji: '😴' },
          ].map(({ key, label, emoji }) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ [key]: !data[key as keyof typeof data] })}
              className={`p-4 rounded-lg border-2 text-left transition ${
                data[key as keyof typeof data]
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <div className={`font-medium ${data[key as keyof typeof data] ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Were there any "close calls"—moments where you almost gave in but didn't?
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Celebrate these! They show growth. 🎉</p>
        <textarea
          value={data.close_calls || ''}
          onChange={e => onChange({ close_calls: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>
    </div>
  )
}
