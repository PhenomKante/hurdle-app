import type { CheckInInsert } from '../../types/database'

interface Props {
  data: Partial<CheckInInsert>
  onChange: (updates: Partial<CheckInInsert>) => void
}

export function WinsSection({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">🏆 Wins & Growth</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Acknowledge progress, no matter how small.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What went well this week?
        </label>
        <textarea
          value={data.what_went_well || ''}
          onChange={e => onChange({ what_went_well: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What are you proud of?
        </label>
        <textarea
          value={data.proud_of || ''}
          onChange={e => onChange({ proud_of: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Where did you see God show up?
        </label>
        <textarea
          value={data.god_showed_up || ''}
          onChange={e => onChange({ god_showed_up: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What's one thing you did differently this week that helped?
        </label>
        <textarea
          value={data.what_helped || ''}
          onChange={e => onChange({ what_helped: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>
    </div>
  )
}
