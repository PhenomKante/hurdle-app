import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePartnership } from '../hooks/usePartnership'
import { useCheckIns } from '../hooks/useCheckIns'
import { isWithinCurrentWeek } from '../lib/dateUtils'
import type { CheckIn } from '../types/database'

type FilterType = 'all' | 'victories' | 'struggles'
type SortType = 'newest' | 'oldest'

export function HistoryPage() {
  const { user } = useAuth()
  const { partnership } = usePartnership()
  const { checkIns, loading, deleteCheckIn } = useCheckIns(partnership?.id)
  
  const isFriend = user && partnership && user.id === partnership.friend_id
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteCheckIn(id)
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  // Filter and sort check-ins
  const filteredCheckIns = useMemo(() => {
    let result = [...checkIns]

    // Apply filter
    if (filter === 'victories') {
      result = result.filter(c => !c.acted_on_urges)
    } else if (filter === 'struggles') {
      result = result.filter(c => c.acted_on_urges)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.weekly_goal?.toLowerCase().includes(query) ||
        c.what_went_well?.toLowerCase().includes(query) ||
        c.proud_of?.toLowerCase().includes(query) ||
        c.weighing_on_mind?.toLowerCase().includes(query)
      )
    }

    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.check_in_date).getTime()
      const dateB = new Date(b.check_in_date).getTime()
      return sort === 'newest' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [checkIns, filter, sort, searchQuery])

  // Stats
  const stats = useMemo(() => {
    const victories = checkIns.filter(c => !c.acted_on_urges).length
    const total = checkIns.length
    const avgEmotional = total > 0 
      ? Math.round(checkIns.reduce((sum, c) => sum + (c.rating_emotional || 0), 0) / total * 10) / 10
      : 0
    return { victories, total, avgEmotional }
  }, [checkIns])

  const getUrgeIcon = (level: string | null) => {
    switch (level) {
      case 'none': return { icon: '😌', color: 'text-green-500' }
      case 'some': return { icon: '😐', color: 'text-yellow-500' }
      case 'strong': return { icon: '😰', color: 'text-red-500' }
      default: return { icon: '❓', color: 'text-gray-400' }
    }
  }

  const getRatingColor = (rating: number | null, type: 'emotional' | 'spiritual' | 'stress') => {
    if (!rating) return 'bg-gray-200 dark:bg-gray-700'
    if (type === 'stress') {
      // For stress, lower is better
      if (rating <= 3) return 'bg-green-500'
      if (rating <= 6) return 'bg-yellow-500'
      return 'bg-red-500'
    }
    // For emotional/spiritual, higher is better
    if (rating >= 7) return 'bg-green-500'
    if (rating >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getHALTCount = (checkIn: CheckIn) => {
    return [checkIn.halt_hungry, checkIn.halt_angry, checkIn.halt_lonely, checkIn.halt_tired]
      .filter(Boolean).length
  }

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading your journey...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Check-In History</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {checkIns.length} check-in{checkIns.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <Link
          to="/check-in"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <span>✏️</span>
          New Check-In
        </Link>
      </div>

      {checkIns.length > 0 && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.victories}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Victories</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Check-Ins</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.avgEmotional}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Emotional</div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search goals, wins, thoughts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter & Sort */}
            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {(['all', 'victories', 'struggles'] as FilterType[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      filter === f
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {f === 'all' ? '📋 All' : f === 'victories' ? '✓ Victories' : '⚡ Struggles'}
                  </button>
                ))}
              </div>

              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortType)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Check-In List */}
      {filteredCheckIns.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-5xl mb-4">{checkIns.length === 0 ? '📝' : '🔍'}</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
            {checkIns.length === 0 ? 'No check-ins yet' : 'No matches found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {checkIns.length === 0 
              ? 'Start tracking your journey by creating your first check-in.'
              : 'Try adjusting your filters or search terms.'}
          </p>
          {checkIns.length === 0 && (
            <Link
              to="/check-in"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <span>✏️</span>
              Start Your First Check-In
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCheckIns.map(checkIn => {
            const urge = getUrgeIcon(checkIn.urge_level)
            const haltCount = getHALTCount(checkIn)
            const isCurrentWeek = isWithinCurrentWeek(checkIn.check_in_date)
            
            return (
              <div
                key={checkIn.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex">
                  {/* Status indicator */}
                  <div className={`w-1.5 ${checkIn.acted_on_urges ? 'bg-orange-400' : 'bg-green-400'}`} />
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <Link to={`/check-in/${checkIn.id}`} className="flex-1 min-w-0">
                        {/* Date & Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {new Date(checkIn.check_in_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeDate(checkIn.check_in_date)}
                          </span>
                          {isCurrentWeek && (
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                              This week
                            </span>
                          )}
                        </div>

                        {/* Rating bars */}
                        <div className="flex gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-16">Emotional</span>
                            <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getRatingColor(checkIn.rating_emotional, 'emotional')} transition-all`}
                                style={{ width: `${(checkIn.rating_emotional || 0) * 10}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{checkIn.rating_emotional}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-16">Spiritual</span>
                            <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getRatingColor(checkIn.rating_spiritual, 'spiritual')} transition-all`}
                                style={{ width: `${(checkIn.rating_spiritual || 0) * 10}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{checkIn.rating_spiritual}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-16">Stress</span>
                            <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getRatingColor(checkIn.rating_stress, 'stress')} transition-all`}
                                style={{ width: `${(checkIn.rating_stress || 0) * 10}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{checkIn.rating_stress}</span>
                          </div>
                        </div>

                        {/* Quick info pills */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            checkIn.acted_on_urges 
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                            {checkIn.acted_on_urges ? '⚡ Struggled' : '✓ Victory'}
                          </span>
                          
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
                            <span className={urge.color}>{urge.icon}</span>
                            {checkIn.urge_level || 'No'} urges
                          </span>

                          {haltCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                              ⚠️ {haltCount} HALT
                            </span>
                          )}

                          {checkIn.scripture_reading && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              📖 Scripture
                            </span>
                          )}
                        </div>

                        {/* Goal preview */}
                        {checkIn.weekly_goal && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 truncate">
                            🎯 {checkIn.weekly_goal}
                          </div>
                        )}
                      </Link>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Link
                          to={`/check-in/${checkIn.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          →
                        </Link>

                        {isFriend && isCurrentWeek ? (
                          confirmDeleteId === checkIn.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(checkIn.id)}
                                disabled={deletingId === checkIn.id}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {deletingId === checkIn.id ? '...' : '✓'}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(checkIn.id)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )
                        ) : isFriend ? (
                          <span className="p-2 text-gray-300 dark:text-gray-600" title="Locked - can only delete current week">
                            🔒
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer hint */}
      {filteredCheckIns.length > 0 && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          Click any check-in to view full details
        </p>
      )}
    </div>
  )
}
