import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryDashboard } from './SummaryDashboard'
import type { BudgetRow } from '../../types/budget'

const mockBudgetData: BudgetRow[] = [
  {
    type: 'Income',
    category: 'Salary',
    name: 'Job',
    description: 'Monthly salary',
    dueDate: '2025-01-01',
    amount: 5000,
    notes: 'Regular income'
  },
  {
    type: 'Income',
    category: 'Freelance',
    name: 'Side project',
    description: 'Freelance work',
    dueDate: '2025-01-15',
    amount: 1200,
    notes: 'One-time project'
  },
  {
    type: 'Expense',
    category: 'Housing',
    name: 'Rent',
    description: 'Monthly rent',
    dueDate: '2025-01-01',
    amount: 1500,
    notes: 'Monthly expense'
  },
  {
    type: 'Expense',
    category: 'Food',
    name: 'Groceries',
    description: 'Weekly groceries',
    dueDate: '2025-01-05',
    amount: 150,
    notes: 'Weekly expense'
  },
  {
    type: 'Expense',
    category: 'Food',
    name: 'Dining out',
    description: 'Restaurant meals',
    dueDate: '2025-01-10',
    amount: 75,
    notes: 'Entertainment'
  }
]

describe('SummaryDashboard Component', () => {
  it('should render summary dashboard container', () => {
    render(<SummaryDashboard data={[]} />)
    
    const dashboard = screen.getByTestId('summary-dashboard')
    expect(dashboard).toBeInTheDocument()
  })

  it('should display total income correctly', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    const totalIncome = screen.getByTestId('total-income')
    expect(totalIncome).toHaveTextContent('$6,200.00')
  })

  it('should display total expenses correctly', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    const totalExpenses = screen.getByTestId('total-expenses')
    expect(totalExpenses).toHaveTextContent('$1,725.00')
  })

  it('should display remaining budget correctly', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    const remainingBudget = screen.getByTestId('remaining-budget')
    expect(remainingBudget).toHaveTextContent('$4,475.00')
  })

  it('should show positive remaining budget in green', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    const remainingBudget = screen.getByTestId('remaining-budget')
    expect(remainingBudget).toHaveClass('text-green-600')
  })

  it('should show negative remaining budget in red', () => {
    const negativeData: BudgetRow[] = [
      {
        type: 'Income',
        category: 'Salary',
        name: 'Job',
        description: 'Monthly salary',
        dueDate: '2025-01-01',
        amount: 1000,
        notes: 'Low income'
      },
      {
        type: 'Expense',
        category: 'Housing',
        name: 'Rent',
        description: 'Monthly rent',
        dueDate: '2025-01-01',
        amount: 1500,
        notes: 'High expense'
      }
    ]

    render(<SummaryDashboard data={negativeData} />)
    
    const remainingBudget = screen.getByTestId('remaining-budget')
    expect(remainingBudget).toHaveTextContent('-$500.00')
    expect(remainingBudget).toHaveClass('text-red-600')
  })

  it('should display category breakdown correctly', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    // Check income categories - text is split across elements
    expect(screen.getByText(/Salary/)).toBeInTheDocument()
    expect(screen.getByText('$5,000.00')).toBeInTheDocument()
    expect(screen.getByText(/Freelance/)).toBeInTheDocument()
    expect(screen.getByText('$1,200.00')).toBeInTheDocument()
    
    // Check expense categories
    expect(screen.getByText(/Housing/)).toBeInTheDocument()
    expect(screen.getByText('$1,500.00')).toBeInTheDocument()
    expect(screen.getByText(/Food/)).toBeInTheDocument()
    expect(screen.getByText('$225.00')).toBeInTheDocument()
  })

  it('should handle empty data gracefully', () => {
    render(<SummaryDashboard data={[]} />)
    
    expect(screen.getByTestId('total-income')).toHaveTextContent('$0.00')
    expect(screen.getByTestId('total-expenses')).toHaveTextContent('$0.00')
    expect(screen.getByTestId('remaining-budget')).toHaveTextContent('$0.00')
  })

  it('should display income and expense section headers', () => {
    render(<SummaryDashboard data={mockBudgetData} />)
    
    expect(screen.getByText('Income Categories')).toBeInTheDocument()
    expect(screen.getByText('Expense Categories')).toBeInTheDocument()
  })
})