import { useState } from 'react'
import type { Scripture, ScriptureTheme } from '../../types/database'

interface ScriptureSelectorProps {
  scriptures: Scripture[]
  onSelect: (scriptureId: string) => Promise<{ error: Error | null } | { error: unknown }>
  onClose: () => void
  assigning: boolean
  isLocked?: boolean // If true, this is a new assignment that will be locked
}

const themeColors = {
  identity: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
  freedom: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
  strength: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20',
  renewal: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
}

const themeBadgeColors = {
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

const themes: ScriptureTheme[] = ['identity', 'freedom', 'strength', 'renewal']

export function ScriptureSelector({ scriptures, onSelect, onClose, assigning, isLocked = true }: ScriptureSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ScriptureTheme | 'all'>('all')
  const [selectedScripture, setSelectedScripture] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const filteredScriptures = selectedTheme === 'all' 
    ? scriptures 
    : scriptures.filter(s => s.theme === selectedTheme)

  const handleAssignClick = () => {
    if (selectedScripture && isLocked) {
      setShowConfirmation(true)
    } else if (selectedScripture) {
      handleConfirmAssign()
    }
  }

  const handleConfirmAssign = async () => {
    if (selectedScripture) {
      await onSelect(selectedScripture)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Assign Weekly Scripture
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {/* Theme Filter */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTheme === 'all'
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            {themes.map(theme => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTheme === theme
                    ? themeBadgeColors[theme]
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {themeIcons[theme]} {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scripture List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredScriptures.map(scripture => (
            <button
              key={scripture.id}
              onClick={() => setSelectedScripture(scripture.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedScripture === scripture.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : `border-transparent hover:${themeColors[scripture.theme]}`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${themeBadgeColors[scripture.theme]}`}>
                      {themeIcons[scripture.theme]} {scripture.theme}
                    </span>
                    {scripture.is_key_verse && (
                      <span className="text-yellow-500 text-xs">⭐ Key Verse</span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 truncate">
                    {scripture.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {scripture.reference}
                  </p>
                </div>
                {selectedScripture === scripture.id && (
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignClick}
            disabled={!selectedScripture || assigning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {assigning ? 'Assigning...' : 'Assign Scripture'}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 max-w-sm shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Confirm Assignment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Once assigned, this scripture <strong>cannot be changed</strong> for the rest of the week. Are you sure you want to proceed?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirmAssign}
                    disabled={assigning}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {assigning ? 'Assigning...' : 'Yes, Assign'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
