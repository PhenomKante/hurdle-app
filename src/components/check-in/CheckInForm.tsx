import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePartnership } from '../../hooks/usePartnership'
import { useCheckIns } from '../../hooks/useCheckIns'
import { isWithinCurrentWeek } from '../../lib/dateUtils'
import { HeartCheck } from './HeartCheck'
import { BattleSection } from './BattleSection'
import { TriggersSection } from './TriggersSection'
import { WinsSection } from './WinsSection'
import { NextWeekSection } from './NextWeekSection'
import type { CheckInInsert } from '../../types/database'

const STEPS = ['Heart Check', 'The Battle', 'Triggers', 'Wins', 'Next Week']

const DEFAULT_FORM_DATA: Partial<CheckInInsert> = {
  rating_emotional: 5,
  rating_spiritual: 5,
  rating_stress: 5,
  scripture_reading: false,
  urge_level: 'none',
  acted_on_urges: false,
  halt_hungry: false,
  halt_angry: false,
  halt_lonely: false,
  halt_tired: false,
  coping_strategies: [],
}

export function CheckInForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const { partnership } = usePartnership()
  const { checkIns, currentWeekCheckIn, createCheckIn, updateCheckIn } = useCheckIns(partnership?.id)
  
  const isEditMode = Boolean(id)
  const existingCheckIn = isEditMode ? checkIns.find(c => c.id === id) : null

  // Redirect to edit mode if trying to create new but one already exists this week
  useEffect(() => {
    if (!isEditMode && currentWeekCheckIn) {
      navigate(`/check-in/${currentWeekCheckIn.id}/edit`, { replace: true })
    }
  }, [isEditMode, currentWeekCheckIn, navigate])
  
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CheckInInsert>>(DEFAULT_FORM_DATA)

  useEffect(() => {
    if (isEditMode && existingCheckIn) {
      setFormData({
        rating_emotional: existingCheckIn.rating_emotional,
        rating_spiritual: existingCheckIn.rating_spiritual,
        rating_stress: existingCheckIn.rating_stress,
        weighing_on_mind: existingCheckIn.weighing_on_mind,
        god_connection: existingCheckIn.god_connection,
        scripture_reading: existingCheckIn.scripture_reading,
        scripture_notes: existingCheckIn.scripture_notes,
        urge_level: existingCheckIn.urge_level,
        acted_on_urges: existingCheckIn.acted_on_urges,
        urge_details: existingCheckIn.urge_details,
        trigger_preceding_events: existingCheckIn.trigger_preceding_events,
        coping_strategies: existingCheckIn.coping_strategies || [],
        anything_hiding: existingCheckIn.anything_hiding,
        stress_points: existingCheckIn.stress_points,
        halt_hungry: existingCheckIn.halt_hungry,
        halt_angry: existingCheckIn.halt_angry,
        halt_lonely: existingCheckIn.halt_lonely,
        halt_tired: existingCheckIn.halt_tired,
        close_calls: existingCheckIn.close_calls,
        what_went_well: existingCheckIn.what_went_well,
        proud_of: existingCheckIn.proud_of,
        god_showed_up: existingCheckIn.god_showed_up,
        what_helped: existingCheckIn.what_helped,
        upcoming_challenges: existingCheckIn.upcoming_challenges,
        planned_boundaries: existingCheckIn.planned_boundaries,
        weekly_goal: existingCheckIn.weekly_goal,
        support_needed: existingCheckIn.support_needed,
      })
    }
  }, [isEditMode, existingCheckIn])

  function updateForm(updates: Partial<CheckInInsert>) {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  async function handleSubmit() {
    if (!partnership || !user) return
    
    setSaving(true)
    
    if (isEditMode && id) {
      const { error } = await updateCheckIn(id, formData)
      if (!error) {
        navigate(`/check-in/${id}`)
      }
    } else {
      const { error } = await createCheckIn({
        ...formData,
        partnership_id: partnership.id,
        created_by: user.id,
      } as CheckInInsert)
      if (!error) {
        navigate('/')
      }
    }
    
    setSaving(false)
  }

  if (!partnership) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">You need to set up a partnership first.</p>
      </div>
    )
  }

  // Only friends can create/edit check-ins
  const isFriend = user && user.id === partnership.friend_id
  if (!isFriend) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Only the friend can create and edit check-ins.
        </p>
        <Link
          to="/"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  // Block editing locked check-ins (older than current week)
  if (isEditMode && existingCheckIn && !isWithinCurrentWeek(existingCheckIn.check_in_date)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          🔒 This check-in is locked and cannot be edited.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Check-ins can only be edited within the same week they were created.
        </p>
        <Link
          to={`/check-in/${id}`}
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to check-in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`text-xs sm:text-sm ${i === step ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className="h-2 bg-indigo-600 rounded-full transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        {step === 0 && <HeartCheck data={formData} onChange={updateForm} />}
        {step === 1 && <BattleSection data={formData} onChange={updateForm} />}
        {step === 2 && <TriggersSection data={formData} onChange={updateForm} />}
        {step === 3 && <WinsSection data={formData} onChange={updateForm} />}
        {step === 4 && <NextWeekSection data={formData} onChange={updateForm} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30"
        >
          ← Back
        </button>
        
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save Changes ✓' : 'Complete Check-In ✓'}
          </button>
        )}
      </div>
    </div>
  )
}
