import { Link } from 'react-router-dom'
import type { Scripture, ScriptureProgress } from '../../types/database'

interface ScriptureCardProps {
  scripture: Scripture | null
  progress: ScriptureProgress | null
  weekNumber: number
  isPartner: boolean
  isLocked?: boolean
  onAssignClick?: () => void
  loading?: boolean
}

const themeColors = {
  identity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  freedom: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  strength: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  renewal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
}

const themeIcons = {
  identity: '👤',
  freedom: '🕊️',
  strength: '💪',
  renewal: '🔄'
}

export function ScriptureCard({ scripture, progress, weekNumber, isPartner, isLocked, onAssignClick, loading }: ScriptureCardProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    )
  }

  // No scripture assigned yet
  if (!scripture) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
            📖 Weekly Scripture
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Week {weekNumber}</span>
        </div>
        
        {isPartner ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              No scripture assigned for this week yet.
            </p>
            <button
              onClick={onAssignClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Assign Scripture
            </button>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
            No scripture set yet by partner.
          </p>
        )}
      </div>
    )
  }

  const isRead = progress?.is_read || false

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          📖 Weekly Scripture
        </h3>
        <div className="flex items-center gap-2">
          {isRead && (
            <span className="text-green-600 dark:text-green-400 text-sm">✓ Read</span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">Week {weekNumber}</span>
        </div>
      </div>

      {/* Theme Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${themeColors[scripture.theme]}`}>
          {themeIcons[scripture.theme]} {scripture.theme.charAt(0).toUpperCase() + scripture.theme.slice(1)}
          {scripture.is_key_verse && ' ⭐'}
        </span>
      </div>

      {/* Scripture Title & Reference */}
      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">
        {scripture.title}
      </h4>
      <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
        {scripture.reference}
      </p>

      {/* Verse Preview */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 italic">
        "{scripture.verse_text.substring(0, 150)}..."
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/scripture"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
        >
          Read Full Scripture →
        </Link>
        
        {isPartner && isLocked && (
          <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
            🔒 Locked for this week
          </span>
        )}
      </div>
    </div>
  )
}
