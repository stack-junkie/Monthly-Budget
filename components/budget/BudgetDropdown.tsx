'use client'

import { useState } from 'react'
import { CustomOption } from '@/types/budget'

interface BudgetDropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  customOptions: CustomOption[]
  onAddCustomOption: (value: string) => void
  placeholder: string
  type: 'category' | 'item'
  className?: string
}

export function BudgetDropdown({
  value,
  onChange,
  options,
  customOptions,
  onAddCustomOption,
  placeholder,
  type,
  className = ''
}: BudgetDropdownProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newValue, setNewValue] = useState('')

  // Combine default options with custom options and sort alphabetically
  const allOptions = [
    ...options,
    ...customOptions.map(opt => opt.value)
  ].sort()

  const handleAddNew = () => {
    if (newValue.trim()) {
      onAddCustomOption(newValue.trim())
      setNewValue('')
      setShowAddForm(false)
      onChange(newValue.trim())
    }
  }

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === '__add_new__') {
      setShowAddForm(true)
    } else {
      onChange(selectedValue)
    }
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => handleSelectChange(e.target.value)}
        className={`w-full p-2 border rounded bg-background ${className}`}
        data-testid={`${type}-dropdown`}
      >
        <option value="">{placeholder}</option>
        {allOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="__add_new__" className="border-t font-semibold">
          Create new {type}...
        </option>
      </select>

      {/* Add New Popup */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Create New {type === 'category' ? 'Category' : 'Item'}
            </h3>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter ${type} name`}
              className="w-full p-2 border rounded mb-4 bg-background"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNew()
                if (e.key === 'Escape') setShowAddForm(false)
              }}
              data-testid={`new-${type}-input`}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                disabled={!newValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="add-button"
              >
                Add {type === 'category' ? 'Category' : 'Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}