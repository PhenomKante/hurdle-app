import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePartnership } from '../hooks/usePartnership'
import { useScripture } from '../hooks/useScripture'
import { ScriptureSelector } from '../components/scripture/ScriptureSelector'
import type { ScriptureTheme } from '../types/database'

const themeColors: Record<ScriptureTheme, string> = {
  identity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  freedom: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  strength: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  renewal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
}

const themeIcons: Record<ScriptureTheme, string> = {
  identity: '👤',
  freedom: '🕊️',
  strength: '💪',
  renewal: '🔄'
}

export function Scripture() {
  const { user } = useAuth()
  const { partnership, loading: partnershipLoading } = usePartnership()
  const { 
    scriptures, 
    currentWeekScripture, 
    loading, 
    assigning,
    weekNumber,
    assignScripture,
    updateProgress 
  } = useScripture(partnership?.id, partnership?.created_at || undefined)

  const [showSelector, setShowSelector] = useState(false)
  const [reflectionNotes, setReflectionNotes] = useState(currentWeekScripture?.progress?.reflection_notes || '')
  const [saving, setSaving] = useState(false)

  const isPartner = user && partnership && user.id === partnership.partner_id
  const isFriend = user && partnership && user.id === partnership.friend_id
  const scripture = currentWeekScripture?.scripture
  const progress = currentWeekScripture?.progress
  
  // Friend can only save reflection once (when notes exist, it's locked)
  const hasReflection = !!progress?.reflection_notes
  const isReflectionLocked = hasReflection

  const handleMarkAsRead = async () => {
    setSaving(true)
    await updateProgress(true, reflectionNotes)
    setSaving(false)
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    await updateProgress(progress?.is_read || false, reflectionNotes)
    setSaving(false)
  }

  if (partnershipLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!partnership) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-5xl sm:text-6xl mb-4">📖</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Weekly Scripture
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
          Set up a partnership to access weekly scriptures.
        </p>
        <Link
          to="/settings"
          className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Set Up Partnership
        </Link>
      </div>
    )
  }

  // No scripture assigned
  if (!scripture) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Week {weekNumber} Scripture
          </h2>
          {isPartner ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a scripture for your friend to meditate on this week.
              </p>
              <button
                onClick={() => setShowSelector(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Assign Scripture
              </button>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No scripture set yet by partner.
            </p>
          )}
        </div>

        {showSelector && (
          <ScriptureSelector
            scriptures={scriptures}
            onSelect={assignScripture}
            onClose={() => setShowSelector(false)}
            assigning={assigning}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            Week {weekNumber} Scripture
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress?.is_read ? '✓ Completed' : 'In Progress'}
          </p>
        </div>
        {isPartner && (
          <span className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1">
            🔒 Locked for this week
          </span>
        )}
      </div>

      {/* Scripture Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Theme Header */}
        <div className={`px-6 py-3 ${themeColors[scripture.theme]}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{themeIcons[scripture.theme]}</span>
            <span className="font-medium capitalize">{scripture.theme}</span>
            {scripture.is_key_verse && <span className="ml-auto">⭐ Key Verse</span>}
          </div>
        </div>

        <div className="p-6">
          {/* Title & Reference */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {scripture.title}
          </h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
            {scripture.reference} (NKJV)
          </p>

          {/* Full Verse Text */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">
              "{scripture.verse_text}"
            </p>
          </div>

          {/* Reflection Question */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              💭 Reflection Question
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {scripture.reflection_question}
            </p>
          </div>

          {/* Progress Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {isFriend ? 'Your Response' : "Friend's Response"}
            </h3>

            {/* Mark as Read - Only Friend can mark */}
            <div className="flex items-center gap-3 mb-4">
              {isFriend ? (
                <button
                  onClick={handleMarkAsRead}
                  disabled={saving || progress?.is_read}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    progress?.is_read
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } disabled:opacity-50`}
                >
                  {progress?.is_read ? '✓ Marked as Read' : 'Mark as Read'}
                </button>
              ) : (
                <span className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  progress?.is_read
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {progress?.is_read ? '✓ Read by friend' : 'Not yet read'}
                </span>
              )}
              {progress?.read_at && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(progress.read_at).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Reflection Notes - Only Friend can add, once per week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reflection Notes {isFriend && !isReflectionLocked && '(one-time submission)'}
              </label>
              
              {isFriend && !isReflectionLocked ? (
                <>
                  <textarea
                    value={reflectionNotes}
                    onChange={(e) => setReflectionNotes(e.target.value)}
                    placeholder="Write your thoughts, prayers, or reflections here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={saving || !reflectionNotes.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
                    >
                      {saving ? 'Saving...' : 'Submit Reflection'}
                    </button>
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      ⚠️ Cannot be edited after submission
                    </span>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  {progress?.reflection_notes ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {progress.reflection_notes}
                    </p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 italic">
                      {isFriend ? 'No reflection added yet.' : 'Friend has not added a reflection yet.'}
                    </p>
                  )}
                  {isFriend && isReflectionLocked && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                      🔒 Reflection submitted for this week
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSelector && (
        <ScriptureSelector
          scriptures={scriptures}
          onSelect={assignScripture}
          onClose={() => setShowSelector(false)}
          assigning={assigning}
        />
      )}
    </div>
  )
}
