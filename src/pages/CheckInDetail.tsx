import { useParams, Link } from 'react-router-dom'
import { usePartnership } from '../hooks/usePartnership'
import { useCheckIns } from '../hooks/useCheckIns'

export function CheckInDetailPage() {
  const { id } = useParams()
  const { partnership } = usePartnership()
  const { checkIns } = useCheckIns(partnership?.id)
  
  const checkIn = checkIns.find(c => c.id === id)

  if (!checkIn) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Check-in not found.</p>
        <Link to="/history" className="text-indigo-600 hover:underline">
          Back to history
        </Link>
      </div>
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  )

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="py-2 border-b border-gray-100 last:border-0">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-gray-800">{value || '—'}</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/history" className="text-indigo-600 hover:underline text-sm">
            ← Back to history
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h1>
        </div>
        {checkIn.acted_on_urges ? (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
            Struggled
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Victory ✓
          </span>
        )}
      </div>

      <Section title="💜 Heart Check">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{checkIn.rating_emotional}</div>
            <div className="text-sm text-gray-600">Emotional</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{checkIn.rating_spiritual}</div>
            <div className="text-sm text-gray-600">Spiritual</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{checkIn.rating_stress}</div>
            <div className="text-sm text-gray-600">Stress</div>
          </div>
        </div>
        <Field label="What's been weighing on you?" value={checkIn.weighing_on_mind} />
        <Field label="Connection with God" value={checkIn.god_connection} />
        <Field label="Scripture reading" value={checkIn.scripture_reading ? 'Yes ✓' : 'No'} />
        {checkIn.scripture_notes && <Field label="Scripture notes" value={checkIn.scripture_notes} />}
      </Section>

      <Section title="⚔️ The Battle">
        <Field label="Urge level" value={
          <span className={`capitalize ${
            checkIn.urge_level === 'strong' ? 'text-red-600' : 
            checkIn.urge_level === 'some' ? 'text-amber-600' : 'text-green-600'
          }`}>
            {checkIn.urge_level}
          </span>
        } />
        <Field label="Acted on urges" value={checkIn.acted_on_urges ? 'Yes' : 'No'} />
        {checkIn.trigger_preceding_events && (
          <Field label="When/what happened" value={checkIn.trigger_preceding_events} />
        )}
        {checkIn.urge_details && <Field label="Details" value={checkIn.urge_details} />}
        {checkIn.coping_strategies && checkIn.coping_strategies.length > 0 && (
          <Field label="Coping strategies used" value={
            <ul className="list-disc list-inside">
              {checkIn.coping_strategies.map(s => <li key={s}>{s}</li>)}
            </ul>
          } />
        )}
        {checkIn.anything_hiding && <Field label="Anything hiding" value={checkIn.anything_hiding} />}
      </Section>

      <Section title="🔍 Triggers & Patterns">
        <Field label="Stress points" value={checkIn.stress_points} />
        <Field label="HALT factors" value={
          <div className="flex gap-2 flex-wrap">
            {checkIn.halt_hungry && <span className="px-2 py-1 bg-gray-100 rounded">🍽️ Hungry</span>}
            {checkIn.halt_angry && <span className="px-2 py-1 bg-gray-100 rounded">😤 Angry/Anxious</span>}
            {checkIn.halt_lonely && <span className="px-2 py-1 bg-gray-100 rounded">😔 Lonely</span>}
            {checkIn.halt_tired && <span className="px-2 py-1 bg-gray-100 rounded">😴 Tired</span>}
            {!checkIn.halt_hungry && !checkIn.halt_angry && !checkIn.halt_lonely && !checkIn.halt_tired && 'None'}
          </div>
        } />
        <Field label="Close calls" value={checkIn.close_calls} />
      </Section>

      <Section title="🏆 Wins & Growth">
        <Field label="What went well" value={checkIn.what_went_well} />
        <Field label="Proud of" value={checkIn.proud_of} />
        <Field label="God showed up" value={checkIn.god_showed_up} />
        <Field label="What helped" value={checkIn.what_helped} />
      </Section>

      <Section title="📅 Next Week">
        <Field label="Upcoming challenges" value={checkIn.upcoming_challenges} />
        <Field label="Planned boundaries" value={checkIn.planned_boundaries} />
        <Field label="Weekly goal" value={checkIn.weekly_goal} />
        <Field label="Support needed" value={checkIn.support_needed} />
      </Section>
    </div>
  )
}
