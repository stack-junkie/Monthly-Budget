import { describe, it, expect } from 'vitest'
import { validateBudgetRow, validateAmount, validateDate, validateRequired } from './validation'
import type { BudgetRow } from '../types/budget'

describe('Budget Validation Utils', () => {
  describe('validateRequired', () => {
    it('should return error for empty string', () => {
      const result = validateRequired('', 'Field')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Field is required')
    })

    it('should return error for whitespace only', () => {
      const result = validateRequired('   ', 'Field')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Field is required')
    })

    it('should return valid for non-empty string', () => {
      const result = validateRequired('value', 'Field')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateAmount', () => {
    it('should return error for negative amount', () => {
      const result = validateAmount(-10)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be greater than 0')
    })

    it('should return error for zero amount', () => {
      const result = validateAmount(0)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be greater than 0')
    })

    it('should return valid for positive amount', () => {
      const result = validateAmount(100.50)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should handle decimal amounts correctly', () => {
      const result = validateAmount(25.99)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateDate', () => {
    it('should return error for empty date', () => {
      const result = validateDate('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Date is required')
    })

    it('should return error for invalid date format', () => {
      const result = validateDate('invalid-date')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid date format')
    })

    it('should return valid for valid date string', () => {
      const result = validateDate('2025-01-15')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return valid for ISO date format', () => {
      const result = validateDate('2025-12-31T23:59:59.000Z')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateBudgetRow', () => {
    const validRow: BudgetRow = {
      type: 'Income',
      category: 'Salary',
      item: 'Job',
      description: 'Monthly salary',
      date: '2025-01-01',
      amount: 5000,
      notes: 'Regular income'
    }

    it('should return valid for complete valid row', () => {
      const result = validateBudgetRow(validRow)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return errors for missing required fields', () => {
      const invalidRow: BudgetRow = {
        type: '',
        category: '',
        item: '',
        description: '',
        date: '',
        amount: 0,
        notes: ''
      }

      const result = validateBudgetRow(invalidRow)
      expect(result.isValid).toBe(false)
      expect(result.errors.type).toBe('Type is required')
      expect(result.errors.category).toBe('Category is required')
      expect(result.errors.item).toBe('Item is required')
      expect(result.errors.description).toBe('Description is required')
      expect(result.errors.date).toBe('Date is required')
      expect(result.errors.amount).toBe('Amount must be greater than 0')
    })

    it('should return error for invalid type', () => {
      const invalidRow = { ...validRow, type: 'InvalidType' }
      const result = validateBudgetRow(invalidRow)
      expect(result.isValid).toBe(false)
      expect(result.errors.type).toBe('Type must be either Income or Expense')
    })

    it('should return error for invalid date', () => {
      const invalidRow = { ...validRow, date: 'invalid-date' }
      const result = validateBudgetRow(invalidRow)
      expect(result.isValid).toBe(false)
      expect(result.errors.date).toBe('Invalid date format')
    })

    it('should return error for negative amount', () => {
      const invalidRow = { ...validRow, amount: -100 }
      const result = validateBudgetRow(invalidRow)
      expect(result.isValid).toBe(false)
      expect(result.errors.amount).toBe('Amount must be greater than 0')
    })

    it('should allow empty notes field', () => {
      const rowWithoutNotes = { ...validRow, notes: '' }
      const result = validateBudgetRow(rowWithoutNotes)
      expect(result.isValid).toBe(true)
      expect(result.errors.notes).toBeUndefined()
    })
  })
})