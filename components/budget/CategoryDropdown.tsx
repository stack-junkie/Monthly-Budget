'use client'

import { useState } from 'react'

interface CategoryDropdownProps {
  type: 'Income' | 'Expense'
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  allowCustom?: boolean
}

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance', 
  'Investment',
  'Other Income'
]

const EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Healthcare',
  'Entertainment',
  'Other Expense'
]

export function CategoryDropdown({ 
  type, 
  value, 
  onChange, 
  className = '',
  disabled = false,
  allowCustom = false 
}: CategoryDropdownProps) {
  const [customValue, setCustomValue] = useState('')
  
  const categories = type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const otherValue = type === 'Income' ? 'Other Income' : 'Other Expense'
  
  const isCustomSelected = allowCustom && value === otherValue
  
  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === otherValue && allowCustom) {
      onChange(selectedValue)
      setCustomValue('')
    } else {
      onChange(selectedValue)
    }
  }

  const handleCustomChange = (customCategory: string) => {
    setCustomValue(customCategory)
    onChange(customCategory)
  }

  const baseClassName = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`

  return (
    <div className="space-y-2">
      <select
        value={isCustomSelected ? otherValue : value}
        onChange={(e) => handleSelectChange(e.target.value)}
        disabled={disabled}
        className={baseClassName}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      
      {isCustomSelected && allowCustom && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="Enter custom category"
          className={baseClassName}
          disabled={disabled}
        />
      )}
    </div>
  )
}