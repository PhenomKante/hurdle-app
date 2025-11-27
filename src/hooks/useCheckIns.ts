import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { CheckIn, CheckInInsert } from '../types/database'

export function useCheckIns(partnershipId: string | undefined) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (partnershipId) {
      fetchCheckIns()
    } else {
      // No partnership, so no check-ins to load
      setCheckIns([])
      setLoading(false)
    }
  }, [partnershipId])

  async function fetchCheckIns() {
    if (!partnershipId) return

    const { data } = await supabase
      .from('check_ins')
      .select('*')
      .eq('partnership_id', partnershipId)
      .order('check_in_date', { ascending: false })

    setCheckIns(data || [])
    setLoading(false)
  }

  async function createCheckIn(checkIn: CheckInInsert) {
    const { data, error } = await supabase
      .from('check_ins')
      .insert(checkIn)
      .select()
      .single()

    if (!error && data) {
      setCheckIns(prev => [data, ...prev])
    }

    return { data, error }
  }

  async function updateCheckIn(id: string, updates: Partial<CheckInInsert>) {
    const { data, error } = await supabase
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setCheckIns(prev => prev.map(c => c.id === id ? data : c))
    }

    return { data, error }
  }

  async function deleteCheckIn(id: string) {
    const { error } = await supabase
      .from('check_ins')
      .delete()
      .eq('id', id)

    if (!error) {
      setCheckIns(prev => prev.filter(c => c.id !== id))
    }

    return { error }
  }

  return { checkIns, loading, createCheckIn, updateCheckIn, deleteCheckIn, refetch: fetchCheckIns }
}
