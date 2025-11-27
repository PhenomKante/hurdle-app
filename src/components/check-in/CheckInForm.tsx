import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePartnership } from '../../hooks/usePartnership'
import { useCheckIns } from '../../hooks/useCheckIns'
import { HeartCheck } from './HeartCheck'
import { BattleSection } from './BattleSection'
import { TriggersSection } from './TriggersSection'
import { WinsSection } from './WinsSection'
import { NextWeekSection } from './NextWeekSection'
import type { CheckInInsert } from '../../types/database'

const STEPS = ['Heart Check', 'The Battle', 'Triggers', 'Wins', 'Next Week']

export function CheckInForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { partnership } = usePartnership()
  const { createCheckIn } = useCheckIns(partnership?.id)
  
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CheckInInsert>>({
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
  })

  function updateForm(updates: Partial<CheckInInsert>) {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  async function handleSubmit() {
    if (!partnership || !user) return
    
    setSaving(true)
    const { error } = await createCheckIn({
      ...formData,
      partnership_id: partnership.id,
      created_by: user.id,
    } as CheckInInsert)

    if (!error) {
      navigate('/')
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
            {saving ? 'Saving...' : 'Complete Check-In ✓'}
          </button>
        )}
      </div>
    </div>
  )
}
