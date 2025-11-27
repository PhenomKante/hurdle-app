import type { CheckInInsert } from '../../types/database'

interface Props {
  data: Partial<CheckInInsert>
  onChange: (updates: Partial<CheckInInsert>) => void
}

const COPING_STRATEGIES = [
  'Texted/called accountability partner',
  'Prayed',
  'Left the situation / changed location',
  'Worship music / Scripture',
  'Exercise or physical activity',
  'Journaled',
  'Other',
]

export function BattleSection({ data, onChange }: Props) {
  function toggleStrategy(strategy: string) {
    const current = data.coping_strategies || []
    const updated = current.includes(strategy)
      ? current.filter(s => s !== strategy)
      : [...current, strategy]
    onChange({ coping_strategies: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">⚔️ The Battle</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Address the struggle directly, without shame.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Did you experience temptation or strong urges this week?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'some', 'strong'] as const).map(level => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ urge_level: level })}
              className={`p-3 rounded-lg border-2 text-center capitalize transition ${
                data.urge_level === level
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              {level === 'none' ? 'No significant urges' : level === 'some' ? 'Some, manageable' : 'Strong urges'}
            </button>
          ))}
        </div>
      </div>

      {data.urge_level !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              When did they happen? (days, times, what was happening before)
            </label>
            <textarea
              value={data.trigger_preceding_events || ''}
              onChange={e => onChange({ trigger_preceding_events: e.target.value })}
              placeholder="e.g., Tuesday night, after a stressful day at work, was home alone..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Did you act on any urges this week?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onChange({ acted_on_urges: false })}
                className={`flex-1 p-3 rounded-lg border-2 transition ${
                  data.acted_on_urges === false
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                No ✓
              </button>
              <button
                type="button"
                onClick={() => onChange({ acted_on_urges: true })}
                className={`flex-1 p-3 rounded-lg border-2 transition ${
                  data.acted_on_urges === true
                    ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {data.acted_on_urges && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Thank you for being honest. That took courage. 💛
              </p>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What happened? How did you feel afterward?
              </label>
              <textarea
                value={data.urge_details || ''}
                onChange={e => onChange({ urge_details: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What coping strategies did you use when tempted?
        </label>
        <div className="space-y-2">
          {COPING_STRATEGIES.map(strategy => (
            <label key={strategy} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.coping_strategies || []).includes(strategy)}
                onChange={() => toggleStrategy(strategy)}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{strategy}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Is there anything you're tempted to hide right now?
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">This question builds trust—answer honestly.</p>
        <textarea
          value={data.anything_hiding || ''}
          onChange={e => onChange({ anything_hiding: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={2}
        />
      </div>
    </div>
  )
}
