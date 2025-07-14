'use client'

import { useState } from 'react'
import { BudgetRow, CustomOption } from '@/types/budget'
import { sanitizeSpreadsheetCell } from '@/utils/security'
import { exportToCSV, exportToExcel } from '@/utils/export'
import { BudgetDropdown } from './BudgetDropdown'

interface SimpleBudgetTableProps {
  data?: BudgetRow[]
  onChange?: (data: BudgetRow[]) => void
}

// Default budget categories
const DEFAULT_CATEGORIES = [
  // Income Categories
  'Salary', 'Business', 'Investments', 'Government', 'Other Income',
  // Expense Categories  
  'Housing', 'Transportation', 'Food & Dining', 'Utilities', 'Healthcare',
  'Personal Care', 'Entertainment', 'Savings', 'Debt Payments', 'Insurance',
  'Education', 'Childcare', 'Pets', 'Gifts & Donations', 'Miscellaneous'
]

// Default items by category
const DEFAULT_ITEMS: Record<string, string[]> = {
  // Income Categories
  'Salary': ['Base Salary', 'Overtime Pay', 'Bonus', 'Commission', 'Tips'],
  'Business': ['Revenue', 'Consulting', 'Freelance Work', 'Contract Work', 'Sales'],
  'Investments': ['Dividends', 'Interest', 'Capital Gains', 'Rental Income', 'Royalties'],
  'Government': ['Social Security', 'Unemployment', 'Tax Refund', 'Stimulus', 'Disability'],
  'Other Income': ['Gifts', 'Lottery', 'Side Hustle', 'Alimony', 'Child Support'],
  
  // Expense Categories
  'Housing': ['Rent', 'Mortgage', 'Property Tax', 'HOA Fees', 'Home Insurance', 'Maintenance', 'Utilities Deposit'],
  'Transportation': ['Gas', 'Car Payment', 'Car Insurance', 'Parking', 'Public Transit', 'Car Maintenance', 'Registration'],
  'Food & Dining': ['Groceries', 'Dining Out', 'Coffee & Snacks', 'Meal Delivery', 'Work Lunches', 'Alcohol'],
  'Utilities': ['Electric', 'Water', 'Internet', 'Phone', 'Cable TV', 'Trash', 'Security System'],
  'Healthcare': ['Health Insurance', 'Doctor Visits', 'Prescriptions', 'Dental', 'Vision', 'Mental Health'],
  'Personal Care': ['Haircuts', 'Cosmetics', 'Clothing', 'Gym Membership', 'Subscriptions'],
  'Entertainment': ['Movies', 'Streaming Services', 'Games', 'Hobbies', 'Concerts', 'Books'],
  'Savings': ['Emergency Fund', 'Retirement', 'Vacation Fund', 'Investment', 'Down Payment'],
  'Debt Payments': ['Credit Card', 'Student Loan', 'Personal Loan', 'Medical Debt'],
  'Insurance': ['Life Insurance', 'Disability Insurance', 'Umbrella Policy'],
  'Education': ['Tuition', 'Books', 'Courses', 'Training'],
  'Childcare': ['Daycare', 'Babysitting', 'School Supplies', 'Activities'],
  'Pets': ['Pet Food', 'Vet Bills', 'Pet Insurance', 'Grooming'],
  'Gifts & Donations': ['Birthday Gifts', 'Holiday Gifts', 'Charity', 'Tips'],
  'Miscellaneous': ['Bank Fees', 'Legal Fees', 'Tax Preparation', 'Other']
}

export function SimpleBudgetTable({ data = [], onChange }: SimpleBudgetTableProps) {
  const [tableData, setTableData] = useState<BudgetRow[]>(data)
  const [customCategories, setCustomCategories] = useState<CustomOption[]>([])
  const [customItems, setCustomItems] = useState<Record<string, CustomOption[]>>({})

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    exportToCSV(tableData, `budget-${timestamp}`)
  }

  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    exportToExcel(tableData, `budget-${timestamp}`)
  }

  const handleCellChange = (rowIndex: number, field: keyof BudgetRow, value: string | number) => {
    const newData = [...tableData]
    if (typeof value === 'string') {
      newData[rowIndex] = { ...newData[rowIndex], [field]: sanitizeSpreadsheetCell(value) }
    } else {
      newData[rowIndex] = { ...newData[rowIndex], [field]: value }
    }
    setTableData(newData)
    onChange?.(newData)
  }

  const addCustomCategory = (value: string) => {
    const newCategory: CustomOption = {
      id: Date.now().toString(),
      value,
      createdAt: new Date().toISOString()
    }
    setCustomCategories(prev => [...prev, newCategory])
  }

  const addCustomItem = (category: string, value: string) => {
    const newItem: CustomOption = {
      id: Date.now().toString(),
      value,
      createdAt: new Date().toISOString()
    }
    setCustomItems(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newItem]
    }))
  }

  const addRow = () => {
    const newRow: BudgetRow = {
      type: 'Income',
      category: '',
      item: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      notes: ''
    }
    const newData = [...tableData, newRow]
    setTableData(newData)
    onChange?.(newData)
  }

  const deleteRow = (rowIndex: number) => {
    const newData = tableData.filter((_, index) => index !== rowIndex)
    setTableData(newData)
    onChange?.(newData)
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          data-testid="export-csv-button"
        >
          Export CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          data-testid="export-excel-button"
        >
          Export Excel
        </button>
        <button
          onClick={addRow}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Add Row
        </button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left font-semibold">Type</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Item</th>
              <th className="p-3 text-left font-semibold">Description</th>
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-left font-semibold">Notes</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">
                  <select
                    value={row.type}
                    onChange={(e) => handleCellChange(rowIndex, 'type', e.target.value)}
                    className="w-full p-2 border rounded bg-background"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </td>
                <td className="p-3">
                  <BudgetDropdown
                    value={row.category}
                    onChange={(value) => handleCellChange(rowIndex, 'category', value)}
                    options={DEFAULT_CATEGORIES}
                    customOptions={customCategories}
                    onAddCustomOption={addCustomCategory}
                    placeholder="Select category"
                    type="category"
                  />
                </td>
                <td className="p-3">
                  <BudgetDropdown
                    value={row.item}
                    onChange={(value) => handleCellChange(rowIndex, 'item', value)}
                    options={DEFAULT_ITEMS[row.category] || []}
                    customOptions={customItems[row.category] || []}
                    onAddCustomOption={(value) => addCustomItem(row.category, value)}
                    placeholder="Select item"
                    type="item"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleCellChange(rowIndex, 'description', e.target.value)}
                    className="w-full p-2 border rounded bg-background"
                    placeholder="Description"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => handleCellChange(rowIndex, 'date', e.target.value)}
                    className="w-full p-2 border rounded bg-background"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) => handleCellChange(rowIndex, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded bg-background"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={row.notes}
                    onChange={(e) => handleCellChange(rowIndex, 'notes', e.target.value)}
                    className="w-full p-2 border rounded bg-background"
                    placeholder="Notes"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}