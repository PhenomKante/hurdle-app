import type { CheckInInsert } from '../../types/database'

interface Props {
  data: Partial<CheckInInsert>
  onChange: (updates: Partial<CheckInInsert>) => void
}

const GOAL_EXAMPLES = [
  'Text you immediately when I feel an urge',
  'No phone in the bedroom after 10pm',
  'Do the daily Scripture reading every day',
  'Exercise 3 times',
  'Journal when I feel stressed instead of numbing',
]

export function NextWeekSection({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">📅 Next Week</h3>
        <p className="text-sm text-gray-500">Plan and prepare for the week ahead.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What's coming up next week that might be challenging?
        </label>
        <p className="text-xs text-gray-500 mb-2">Stressful events, being alone, difficult days...</p>
        <textarea
          value={data.upcoming_challenges || ''}
          onChange={e => onChange({ upcoming_challenges: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What boundaries or strategies do you want to put in place?
        </label>
        <textarea
          value={data.planned_boundaries || ''}
          onChange={e => onChange({ planned_boundaries: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What's one specific goal for next week?
        </label>
        <p className="text-xs text-gray-500 mb-2">Keep it achievable—small wins build momentum.</p>
        <textarea
          value={data.weekly_goal || ''}
          onChange={e => onChange({ weekly_goal: e.target.value })}
          placeholder="e.g., Exercise 3 times this week"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={2}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {GOAL_EXAMPLES.map(example => (
            <button
              key={example}
              type="button"
              onClick={() => onChange({ weekly_goal: example })}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          How can I support you better this week?
        </label>
        <textarea
          value={data.support_needed || ''}
          onChange={e => onChange({ support_needed: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800 italic">
          "Two are better than one... If either of them falls down, one can help the other up."
          <span className="block mt-1 text-indigo-600">— Ecclesiastes 4:9-10</span>
        </p>
      </div>
    </div>
  )
}
