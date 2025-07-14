'use client'

interface ViewToggleProps {
  currentView: 'spreadsheet' | 'form'
  onViewChange: (view: 'spreadsheet' | 'form') => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewChange('spreadsheet')}
        className={`px-4 py-2 rounded transition-colors ${
          currentView === 'spreadsheet'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Spreadsheet View
      </button>
      <button
        onClick={() => onViewChange('form')}
        className={`px-4 py-2 rounded transition-colors ${
          currentView === 'form'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Form View
      </button>
    </div>
  )
}