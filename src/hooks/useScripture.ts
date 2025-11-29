import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Scripture, WeeklyScripture, ScriptureProgress } from '../types/database'
import { useAuth } from './useAuth'

export interface WeeklyScriptureWithDetails extends WeeklyScripture {
  scripture: Scripture
  progress: ScriptureProgress | null
}

export function useScripture(partnershipId: string | undefined, partnershipCreatedAt: string | undefined) {
  const { user } = useAuth()
  const [scriptures, setScriptures] = useState<Scripture[]>([])
  const [currentWeekScripture, setCurrentWeekScripture] = useState<WeeklyScriptureWithDetails | null>(null)
  const [scriptureHistory, setScriptureHistory] = useState<WeeklyScriptureWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)

  // Calculate week number based on partnership creation date
  const getWeekNumber = useCallback(() => {
    if (!partnershipCreatedAt) return 1
    const created = new Date(partnershipCreatedAt)
    const now = new Date()
    const createdMonday = getMonday(created)
    const currentMonday = getMonday(now)
    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    return Math.floor((currentMonday.getTime() - createdMonday.getTime()) / msPerWeek) + 1
  }, [partnershipCreatedAt])

  const getCurrentWeekMonday = useCallback(() => {
    return getMonday(new Date())
  }, [])

  // Fetch all scriptures for selector
  const fetchScriptures = useCallback(async () => {
    const { data, error } = await supabase
      .from('scriptures')
      .select('*')
      .order('day_number')
    
    if (!error && data) {
      setScriptures(data)
    }
  }, [])

  // Fetch current week's assigned scripture and history
  const fetchCurrentWeekScripture = useCallback(async () => {
    if (!partnershipId || !user) return

    const weekNumber = getWeekNumber()
    
    // Fetch all weekly scriptures for this partnership
    const { data: allWeeklyData, error: weeklyError } = await supabase
      .from('weekly_scriptures')
      .select('*, scripture:scriptures(*)')
      .eq('partnership_id', partnershipId)
      .order('week_number', { ascending: false })

    if (weeklyError) {
      console.error('Error fetching weekly scripture:', weeklyError)
      setLoading(false)
      return
    }

    if (allWeeklyData && allWeeklyData.length > 0) {
      // Fetch progress for all scriptures (for friend's progress)
      const weeklyIds = allWeeklyData.map(w => w.id)
      const { data: allProgressData } = await supabase
        .from('scripture_progress')
        .select('*')
        .in('weekly_scripture_id', weeklyIds)

      // Map progress to weekly scriptures
      const weeklyWithProgress = allWeeklyData.map(weekly => ({
        ...weekly,
        scripture: weekly.scripture as Scripture,
        progress: allProgressData?.find(p => p.weekly_scripture_id === weekly.id) || null
      }))

      // Current week
      const current = weeklyWithProgress.find(w => w.week_number === weekNumber)
      setCurrentWeekScripture(current || null)

      // History (past weeks only)
      const history = weeklyWithProgress.filter(w => w.week_number < weekNumber)
      setScriptureHistory(history)
    } else {
      setCurrentWeekScripture(null)
      setScriptureHistory([])
    }
    setLoading(false)
  }, [partnershipId, user, getWeekNumber])

  useEffect(() => {
    fetchScriptures()
  }, [fetchScriptures])

  useEffect(() => {
    if (partnershipId && user) {
      fetchCurrentWeekScripture()
    }
  }, [partnershipId, user, fetchCurrentWeekScripture])

  // Partner assigns scripture for current week
  const assignScripture = async (scriptureId: string) => {
    if (!partnershipId || !user) return { error: new Error('Not authenticated') }
    
    setAssigning(true)
    const weekNumber = getWeekNumber()
    const weekStartDate = getCurrentWeekMonday().toISOString().split('T')[0]

    const { error } = await supabase
      .from('weekly_scriptures')
      .upsert({
        partnership_id: partnershipId,
        scripture_id: scriptureId,
        week_number: weekNumber,
        week_start_date: weekStartDate,
        assigned_by: user.id
      }, { onConflict: 'partnership_id,week_number' })

    if (!error) {
      await fetchCurrentWeekScripture()
    }
    setAssigning(false)
    return { error }
  }

  // Friend marks scripture as read and adds notes
  const updateProgress = async (isRead: boolean, reflectionNotes?: string) => {
    if (!currentWeekScripture || !user) return { error: new Error('No scripture assigned') }

    const { error } = await supabase
      .from('scripture_progress')
      .upsert({
        weekly_scripture_id: currentWeekScripture.id,
        user_id: user.id,
        is_read: isRead,
        read_at: isRead ? new Date().toISOString() : null,
        reflection_notes: reflectionNotes || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'weekly_scripture_id,user_id' })

    if (!error) {
      await fetchCurrentWeekScripture()
    }
    return { error }
  }

  // Check if scripture is already assigned for current week (locked)
  const isCurrentWeekLocked = currentWeekScripture !== null

  return {
    scriptures,
    currentWeekScripture,
    scriptureHistory,
    loading,
    assigning,
    weekNumber: getWeekNumber(),
    isCurrentWeekLocked,
    assignScripture,
    updateProgress,
    refetch: fetchCurrentWeekScripture
  }
}

// Helper: Get Monday of a given date's week
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}
