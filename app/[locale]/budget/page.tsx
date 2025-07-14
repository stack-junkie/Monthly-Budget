'use client'

import { useState } from 'react'
import { SimpleBudgetTable } from '@/components/budget/SimpleBudgetTable'
import { ViewToggle } from '@/components/budget/ViewToggle'
import { SummaryDashboard } from '@/components/budget/SummaryDashboard'
import type { BudgetRow } from '@/types/budget'

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetRow[]>([
    {
      type: 'Income',
      category: 'Salary',
      item: 'Monthly Salary',
      description: 'Regular monthly income',
      date: '2024-01-01',
      amount: 5000,
      notes: 'Primary income source'
    },
    {
      type: 'Expense',
      category: 'Housing',
      item: 'Rent',
      description: 'Monthly rent payment',
      date: '2024-01-01',
      amount: 1500,
      notes: 'Due on 1st of month'
    }
  ])
  const [viewMode, setViewMode] = useState<'spreadsheet' | 'form'>('spreadsheet')

  const handleDataChange = (newData: BudgetRow[]) => {
    setBudgetData(newData)
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground text-center">
            Track your monthly income and expenses with smart categories and items
          </p>
        </div>

        {/* Summary Dashboard */}
        <div className="mb-8">
          <SummaryDashboard data={budgetData} />
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <ViewToggle 
            currentView={viewMode} 
            onViewChange={setViewMode} 
          />
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          {viewMode === 'spreadsheet' ? (
            <SimpleBudgetTable 
              data={budgetData} 
              onChange={handleDataChange} 
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <h3 className="text-lg font-semibold mb-2">Form View</h3>
              <p>Form-based budget entry interface coming soon!</p>
              <p className="text-sm mt-2">Switch to spreadsheet view to start managing your budget.</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-muted/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How to Use</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Categories & Items:</strong> Use dropdowns or create new ones with the popup form</li>
            <li>• <strong>Export:</strong> Download your budget as CSV or Excel file</li>
            <li>• <strong>Smart Sorting:</strong> Custom categories and items are sorted alphabetically</li>
            <li>• <strong>Live Updates:</strong> Summary dashboard calculates totals in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  )
}