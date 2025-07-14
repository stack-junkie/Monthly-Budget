'use client'

import type { BudgetRow } from '../../types/budget'

interface SummaryDashboardProps {
  data: BudgetRow[]
}

export function SummaryDashboard({ data }: SummaryDashboardProps) {
  // Calculate totals
  const totalIncome = data
    .filter(item => item.type === 'Income')
    .reduce((sum, item) => sum + (item.amount || 0), 0)

  const totalExpenses = data
    .filter(item => item.type === 'Expense')
    .reduce((sum, item) => sum + (item.amount || 0), 0)

  const remainingBudget = totalIncome - totalExpenses

  // Calculate category breakdowns
  const incomeCategories = data
    .filter(item => item.type === 'Income')
    .reduce((acc, item) => {
      const category = item.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + (item.amount || 0)
      return acc
    }, {} as Record<string, number>)

  const expenseCategories = data
    .filter(item => item.type === 'Expense')
    .reduce((acc, item) => {
      const category = item.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + (item.amount || 0)
      return acc
    }, {} as Record<string, number>)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getRemainingBudgetColor = () => {
    if (remainingBudget > 0) return 'text-green-600'
    if (remainingBudget < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="p-6 bg-card dark:bg-card rounded-lg shadow-lg border" data-testid="summary-dashboard">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Budget Summary</h2>
      
      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300" data-testid="total-income">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-800 dark:text-red-300" data-testid="total-expenses">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Remaining Budget</h3>
          <p className={`text-2xl font-bold ${getRemainingBudgetColor()}`} data-testid="remaining-budget">
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Income Categories</h3>
          <div className="space-y-2">
            {Object.entries(incomeCategories).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}:</span>
                <span className="font-medium text-green-700">{formatCurrency(amount)}</span>
              </div>
            ))}
            {Object.keys(incomeCategories).length === 0 && (
              <p className="text-gray-500 italic">No income categories</p>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Expense Categories</h3>
          <div className="space-y-2">
            {Object.entries(expenseCategories).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}:</span>
                <span className="font-medium text-red-700">{formatCurrency(amount)}</span>
              </div>
            ))}
            {Object.keys(expenseCategories).length === 0 && (
              <p className="text-gray-500 italic">No expense categories</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}