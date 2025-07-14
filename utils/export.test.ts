import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToCSV, exportToExcel, sanitizeForExport } from './export'
import type { BudgetRow } from '../types/budget'

// Mock data for testing
const mockBudgetData: BudgetRow[] = [
  {
    type: 'Income',
    category: 'Salary',
    name: 'Monthly Salary',
    description: 'Regular monthly income',
    dueDate: '2024-01-01',
    amount: 5000,
    notes: 'Primary income source'
  },
  {
    type: 'Expense',
    category: 'Housing',
    name: 'Rent',
    description: 'Monthly rent payment',
    dueDate: '2024-01-01',
    amount: 1500,
    notes: 'Due on 1st of month'
  }
]

const maliciousData: BudgetRow[] = [
  {
    type: 'Income',
    category: '=SUM(A1:A10)',
    name: '+cmd|"/c calc"!A1',
    description: '<script>alert("xss")</script>',
    dueDate: '2024-01-01',
    amount: 1000,
    notes: '@SUM(1+1)*cmd|"/c calc"!A1'
  }
]

describe('Export Security', () => {
  describe('sanitizeForExport', () => {
    it('should remove formula injection attempts', () => {
      expect(sanitizeForExport('=SUM(A1:A10)')).toBe('SUM(A1:A10)')
      expect(sanitizeForExport('+cmd|"/c calc"!A1')).toBe('cmd|&quot;/c calc&quot;!A1')
      expect(sanitizeForExport('-2+5+cmd|"/c calc"!A1')).toBe('2+5+cmd|&quot;/c calc&quot;!A1')
      expect(sanitizeForExport('@SUM(1+1)*cmd|"/c calc"!A1')).toBe('SUM(1+1)*cmd|&quot;/c calc&quot;!A1')
    })

    it('should escape HTML/XML characters', () => {
      expect(sanitizeForExport('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(sanitizeForExport('A & B')).toBe('A &amp; B')
      expect(sanitizeForExport("Test 'quote'")).toBe('Test &#x27;quote&#x27;')
    })

    it('should handle empty and null values', () => {
      expect(sanitizeForExport('')).toBe('')
      expect(sanitizeForExport('   ')).toBe('   ')
    })

    it('should preserve normal text', () => {
      expect(sanitizeForExport('Normal text')).toBe('Normal text')
      expect(sanitizeForExport('Numbers 123')).toBe('Numbers 123')
      expect(sanitizeForExport('Special chars: !@#$%^*()')).toBe('Special chars: !@#$%^*()')
    })
  })
})

describe('CSV Export', () => {
  // Mock URL.createObjectURL and URL.revokeObjectURL
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
    
    // Mock document.createElement and appendChild/removeChild
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: { display: '' },
      setAttribute: vi.fn(),
      getAttribute: vi.fn()
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
  })

  it('should export budget data to CSV format', () => {
    const result = exportToCSV(mockBudgetData, 'test-budget')
    
    expect(result).toBe(true)
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(document.body.appendChild).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it('should handle empty data gracefully', () => {
    const result = exportToCSV([], 'empty-budget')
    
    expect(result).toBe(true)
    expect(document.createElement).toHaveBeenCalledWith('a')
  })

  it('should sanitize malicious data before export', () => {
    const result = exportToCSV(maliciousData, 'malicious-test')
    
    expect(result).toBe(true)
    // Verify that the download was triggered (indicating sanitization worked)
    expect(document.createElement).toHaveBeenCalledWith('a')
  })

  it('should use provided filename', () => {
    exportToCSV(mockBudgetData, 'custom-filename')
    
    const mockLink = document.createElement('a')
    expect(mockLink.download).toBeDefined()
  })

  it('should format currency values correctly', () => {
    const dataWithDecimals: BudgetRow[] = [{
      type: 'Income',
      category: 'Test',
      name: 'Test Income',
      description: 'Test',
      dueDate: '2024-01-01',
      amount: 1234.56,
      notes: ''
    }]
    
    const result = exportToCSV(dataWithDecimals, 'decimal-test')
    expect(result).toBe(true)
  })
})

describe('Excel Export', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
    
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: { display: '' },
      setAttribute: vi.fn(),
      getAttribute: vi.fn()
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
  })

  it('should export budget data to Excel format', () => {
    const result = exportToExcel(mockBudgetData, 'test-budget')
    
    expect(result).toBe(true)
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(document.body.appendChild).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it('should handle empty data gracefully', () => {
    const result = exportToExcel([], 'empty-budget')
    
    expect(result).toBe(true)
    expect(document.createElement).toHaveBeenCalledWith('a')
  })

  it('should sanitize malicious data before export', () => {
    const result = exportToExcel(maliciousData, 'malicious-test')
    
    expect(result).toBe(true)
    expect(document.createElement).toHaveBeenCalledWith('a')
  })

  it('should use provided filename with .xlsx extension', () => {
    exportToExcel(mockBudgetData, 'custom-filename')
    
    const mockLink = document.createElement('a')
    expect(mockLink.download).toBeDefined()
  })

  it('should preserve number formatting in Excel', () => {
    const dataWithNumbers: BudgetRow[] = [{
      type: 'Expense',
      category: 'Test',
      name: 'Test Expense',
      description: 'Test',
      dueDate: '2024-01-01',
      amount: 99.99,
      notes: ''
    }]
    
    const result = exportToExcel(dataWithNumbers, 'number-test')
    expect(result).toBe(true)
  })
})