import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Partnership, Profile } from '../types/database'
import { useAuth } from './useAuth'

interface PartnershipWithProfiles extends Partnership {
  partner: Profile | null
  friend: Profile | null
}

export function usePartnership() {
  const { user } = useAuth()
  const [partnership, setPartnership] = useState<PartnershipWithProfiles | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPartnership()
    }
  }, [user])

  async function fetchPartnership() {
    if (!user) return

    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`partner_id.eq.${user.id},friend_id.eq.${user.id}`)
      .maybeSingle()

    if (error) {
      console.error('Error fetching partnership:', error)
      setLoading(false)
      return
    }

    if (data) {
      const [partnerRes, friendRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.partner_id).single(),
        supabase.from('profiles').select('*').eq('id', data.friend_id).single()
      ])
      
      setPartnership({
        ...data,
        partner: partnerRes.data,
        friend: friendRes.data
      })
    } else {
      setPartnership(null)
    }
    setLoading(false)
  }

  async function createPartnership(partnerId: string) {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase.from('partnerships').insert({
      partner_id: partnerId,
      friend_id: user.id
    })

    if (!error) {
      await fetchPartnership()
    }

    return { error }
  }

  return { partnership, loading, createPartnership, refetch: fetchPartnership }
}
