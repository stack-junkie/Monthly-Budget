import { describe, it, expect } from 'vitest'
import { validateBudgetRow, BudgetRow, BudgetType } from './budget'

describe('Budget Data Structure', () => {
  describe('BudgetRow validation', () => {
    it('should validate a complete budget row', () => {
      const validRow: BudgetRow = {
        type: 'Income',
        category: 'Salary',
        item: 'Monthly Salary',
        description: 'Primary income',
        date: '2025-01-15',
        amount: 5000,
        notes: 'Direct deposit'
      }
      
      expect(validateBudgetRow(validRow)).toBe(true)
    })

    it('should reject row with invalid type', () => {
      const invalidRow = {
        type: 'Invalid' as BudgetType,
        category: 'Salary',
        item: 'Monthly Salary',
        description: 'Primary income',
        date: '2025-01-15',
        amount: 5000,
        notes: 'Direct deposit'
      }
      
      expect(validateBudgetRow(invalidRow)).toBe(false)
    })

    it('should reject row with negative income amount', () => {
      const invalidRow: BudgetRow = {
        type: 'Income',
        category: 'Salary',
        item: 'Monthly Salary',
        description: 'Primary income',
        date: '2025-01-15',
        amount: -1000,
        notes: 'Direct deposit'
      }
      
      expect(validateBudgetRow(invalidRow)).toBe(false)
    })

    it('should allow empty optional fields', () => {
      const minimalRow: BudgetRow = {
        type: 'Expense',
        category: 'Utilities',
        item: 'Electric Bill',
        description: '',
        date: '',
        amount: 150,
        notes: ''
      }
      
      expect(validateBudgetRow(minimalRow)).toBe(true)
    })
  })
})