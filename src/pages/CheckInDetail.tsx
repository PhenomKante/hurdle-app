import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePartnership } from '../hooks/usePartnership'
import { useCheckIns } from '../hooks/useCheckIns'
import { isWithinCurrentWeek } from '../lib/dateUtils'

export function CheckInDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { partnership } = usePartnership()
  const { checkIns, loading } = useCheckIns(partnership?.id)
  
  const checkIn = checkIns.find(c => c.id === id)
  const isFriend = user && partnership && user.id === partnership.friend_id

  // Find previous and next check-ins for navigation
  const currentIndex = checkIns.findIndex(c => c.id === id)
  const prevCheckIn = currentIndex > 0 ? checkIns[currentIndex - 1] : null
  const nextCheckIn = currentIndex < checkIns.length - 1 ? checkIns[currentIndex + 1] : null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading check-in...</p>
      </div>
    )
  }

  if (!checkIn) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Check-in not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This check-in may have been deleted or doesn't exist.</p>
        <Link 
          to="/history" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          ← Back to History
        </Link>
      </div>
    )
  }

  const isCurrentWeek = isWithinCurrentWeek(checkIn.check_in_date)
  const haltFactors = [
    { key: 'halt_hungry', label: 'Hungry', icon: '🍽️', active: checkIn.halt_hungry },
    { key: 'halt_angry', label: 'Angry/Anxious', icon: '😤', active: checkIn.halt_angry },
    { key: 'halt_lonely', label: 'Lonely', icon: '😔', active: checkIn.halt_lonely },
    { key: 'halt_tired', label: 'Tired', icon: '😴', active: checkIn.halt_tired },
  ]
  const activeHALT = haltFactors.filter(h => h.active)

  const getRatingInfo = (rating: number | null, type: 'emotional' | 'spiritual' | 'stress') => {
    if (!rating) return { color: 'gray', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' }
    
    if (type === 'stress') {
      if (rating <= 3) return { color: 'green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Low' }
      if (rating <= 6) return { color: 'yellow', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'Moderate' }
      return { color: 'red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'High' }
    }
    
    if (rating >= 7) return { color: 'green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Great' }
    if (rating >= 4) return { color: 'yellow', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'Okay' }
    return { color: 'red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Low' }
  }

  const emotionalInfo = getRatingInfo(checkIn.rating_emotional, 'emotional')
  const spiritualInfo = getRatingInfo(checkIn.rating_spiritual, 'spiritual')
  const stressInfo = getRatingInfo(checkIn.rating_stress, 'stress')

  const getUrgeInfo = (level: string | null) => {
    switch (level) {
      case 'none': return { icon: '😌', label: 'None', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' }
      case 'some': return { icon: '😐', label: 'Some', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' }
      case 'strong': return { icon: '😰', label: 'Strong', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' }
      default: return { icon: '❓', label: 'Unknown', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' }
    }
  }

  const urgeInfo = getUrgeInfo(checkIn.urge_level)

  const Section = ({ title, icon, children, accent = 'indigo' }: { 
    title: string
    icon: string
    children: React.ReactNode
    accent?: 'indigo' | 'purple' | 'red' | 'amber' | 'green' | 'blue'
  }) => {
    const accentColors = {
      indigo: 'border-indigo-200 dark:border-indigo-800',
      purple: 'border-purple-200 dark:border-purple-800',
      red: 'border-red-200 dark:border-red-800',
      amber: 'border-amber-200 dark:border-amber-800',
      green: 'border-green-200 dark:border-green-800',
      blue: 'border-blue-200 dark:border-blue-800',
    }
    
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border-l-4 ${accentColors[accent]}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    )
  }

  const Field = ({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }
    
    return (
      <div className={`py-3 ${highlight ? 'px-4 -mx-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg' : ''}`}>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{value}</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className={`px-6 py-4 ${checkIn.acted_on_urges ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
          <div className="flex items-center justify-between">
            <Link 
              to="/history" 
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              ← History
            </Link>
            <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium">
              {checkIn.acted_on_urges ? '⚡ Struggled' : '✓ Victory'}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                {isCurrentWeek && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                    This week
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Check-in #{checkIns.length - currentIndex} of {checkIns.length}
                </span>
              </div>
            </div>
            
            {isFriend && isCurrentWeek && (
              <button
                onClick={() => navigate(`/check-in/${checkIn.id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ✏️ Edit
              </button>
            )}
            {isFriend && !isCurrentWeek && (
              <span className="flex items-center gap-1 px-3 py-2 text-gray-400 dark:text-gray-500 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg">
                🔒 Locked
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className={`p-3 rounded-lg text-center ${emotionalInfo.bg}`}>
              <div className={`text-2xl font-bold ${emotionalInfo.text}`}>{checkIn.rating_emotional || '—'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Emotional</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${spiritualInfo.bg}`}>
              <div className={`text-2xl font-bold ${spiritualInfo.text}`}>{checkIn.rating_spiritual || '—'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Spiritual</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${stressInfo.bg}`}>
              <div className={`text-2xl font-bold ${stressInfo.text}`}>{checkIn.rating_stress || '—'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Stress</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${urgeInfo.bg}`}>
              <div className="text-2xl">{urgeInfo.icon}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{urgeInfo.label} urges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heart Check */}
      <Section title="Heart Check" icon="💜" accent="purple">
        <div className="space-y-1">
          <Field label="What's been weighing on you?" value={checkIn.weighing_on_mind} highlight />
          <Field label="Connection with God" value={checkIn.god_connection} />
          
          <div className="py-3">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Scripture Reading</div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              checkIn.scripture_reading 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {checkIn.scripture_reading ? '📖 Yes' : '📖 No'}
            </div>
          </div>
          
          <Field label="Scripture Notes" value={checkIn.scripture_notes} />
        </div>
      </Section>

      {/* The Battle */}
      <Section title="The Battle" icon="⚔️" accent="red">
        <div className="space-y-1">
          <div className="py-3">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Battle Status</div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${urgeInfo.bg} ${urgeInfo.text}`}>
                {urgeInfo.icon} {urgeInfo.label} urges
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                checkIn.acted_on_urges 
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}>
                {checkIn.acted_on_urges ? '⚡ Acted on urges' : '✓ Stayed strong'}
              </span>
            </div>
          </div>

          <Field label="When/what happened" value={checkIn.trigger_preceding_events} highlight />
          <Field label="Details" value={checkIn.urge_details} />
          
          {checkIn.coping_strategies && checkIn.coping_strategies.length > 0 && (
            <div className="py-3">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Coping Strategies Used</div>
              <div className="flex flex-wrap gap-2">
                {checkIn.coping_strategies.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Field label="Anything hiding" value={checkIn.anything_hiding} />
        </div>
      </Section>

      {/* Triggers & Patterns */}
      <Section title="Triggers & Patterns" icon="🔍" accent="amber">
        <div className="space-y-1">
          <Field label="Main stress points" value={checkIn.stress_points} highlight />
          
          <div className="py-3">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">HALT Factors</div>
            {activeHALT.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeHALT.map(h => (
                  <span key={h.key} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
                    {h.icon} {h.label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm inline-block">
                ✓ None reported
              </span>
            )}
          </div>
          
          <Field label="Close calls" value={checkIn.close_calls} />
        </div>
      </Section>

      {/* Wins & Growth */}
      <Section title="Wins & Growth" icon="🏆" accent="green">
        <div className="space-y-1">
          <Field label="What went well" value={checkIn.what_went_well} highlight />
          <Field label="Proud of" value={checkIn.proud_of} />
          <Field label="Where God showed up" value={checkIn.god_showed_up} />
          <Field label="What helped" value={checkIn.what_helped} />
        </div>
      </Section>

      {/* Next Week */}
      <Section title="Looking Ahead" icon="📅" accent="blue">
        <div className="space-y-1">
          {checkIn.weekly_goal && (
            <div className="py-3 px-4 -mx-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">🎯 Weekly Goal</div>
              <div className="text-gray-800 dark:text-gray-100 font-medium">{checkIn.weekly_goal}</div>
            </div>
          )}
          <Field label="Upcoming challenges" value={checkIn.upcoming_challenges} />
          <Field label="Planned boundaries" value={checkIn.planned_boundaries} />
          <Field label="Support needed" value={checkIn.support_needed} />
        </div>
      </Section>

      {/* Navigation */}
      <div className="flex items-center justify-between py-4">
        {prevCheckIn ? (
          <Link
            to={`/check-in/${prevCheckIn.id}`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            ← Newer
          </Link>
        ) : (
          <div />
        )}
        
        <Link
          to="/history"
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          All Check-Ins
        </Link>
        
        {nextCheckIn ? (
          <Link
            to={`/check-in/${nextCheckIn.id}`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Older →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Timestamp */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
        Created {checkIn.created_at ? new Date(checkIn.created_at).toLocaleString() : '—'}
        {checkIn.updated_at && checkIn.updated_at !== checkIn.created_at && (
          <> · Updated {new Date(checkIn.updated_at).toLocaleString()}</>
        )}
      </div>
    </div>
  )
}
