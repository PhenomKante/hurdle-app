import { RatingSlider } from '../shared/RatingSlider'
import type { CheckInInsert } from '../../types/database'

interface Props {
  data: Partial<CheckInInsert>
  onChange: (updates: Partial<CheckInInsert>) => void
}

export function HeartCheck({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">💜 Heart Check</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">How are you really doing this week?</p>
      </div>

      <div className="space-y-6">
        <RatingSlider
          label="Emotional"
          value={data.rating_emotional || 5}
          onChange={v => onChange({ rating_emotional: v })}
          lowLabel="Struggling"
          highLabel="Thriving"
        />

        <RatingSlider
          label="Spiritual"
          value={data.rating_spiritual || 5}
          onChange={v => onChange({ rating_spiritual: v })}
          lowLabel="Distant"
          highLabel="Connected"
        />

        <RatingSlider
          label="Stress Level"
          value={data.rating_stress || 5}
          onChange={v => onChange({ rating_stress: v })}
          lowLabel="Calm"
          highLabel="Overwhelmed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What's been weighing on you?
        </label>
        <textarea
          value={data.weighing_on_mind || ''}
          onChange={e => onChange({ weighing_on_mind: e.target.value })}
          placeholder="Work, relationships, health, finances..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          How have you been connecting with God this week?
        </label>
        <textarea
          value={data.god_connection || ''}
          onChange={e => onChange({ god_connection: e.target.value })}
          placeholder="Prayer, Scripture, worship, silence..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          rows={3}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="scripture"
          checked={data.scripture_reading || false}
          onChange={e => onChange({ scripture_reading: e.target.checked })}
          className="mt-1 h-4 w-4 text-indigo-600 rounded"
        />
        <label htmlFor="scripture" className="text-sm text-gray-700 dark:text-gray-300">
          I did the daily Scripture reading this week
        </label>
      </div>

      {data.scripture_reading && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What stood out to you?
          </label>
          <textarea
            value={data.scripture_notes || ''}
            onChange={e => onChange({ scripture_notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}
