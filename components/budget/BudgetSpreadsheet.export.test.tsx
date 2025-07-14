import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BudgetSpreadsheet } from './BudgetSpreadsheet'
import type { BudgetRow } from '@/types/budget'
import * as exportUtils from '@/utils/export'

// Mock jspreadsheet
vi.mock('jspreadsheet-ce', () => ({
  default: vi.fn(() => ({
    getData: vi.fn(() => []),
    destroy: vi.fn()
  }))
}))

// Mock export utilities
vi.mock('@/utils/export', () => ({
  exportToCSV: vi.fn(() => true),
  exportToExcel: vi.fn(() => true)
}))

const mockData: BudgetRow[] = [
  {
    type: 'Income',
    category: 'Salary',
    name: 'Monthly Salary',
    description: 'Regular income',
    dueDate: '2024-01-01',
    amount: 5000,
    notes: 'Primary income'
  },
  {
    type: 'Expense',
    category: 'Housing',
    name: 'Rent',
    description: 'Monthly rent',
    dueDate: '2024-01-01',
    amount: 1500,
    notes: 'Due on 1st'
  }
]

describe('BudgetSpreadsheet Export Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render export buttons', () => {
    render(<BudgetSpreadsheet data={mockData} />)
    
    expect(screen.getByTestId('export-csv-button')).toBeInTheDocument()
    expect(screen.getByTestId('export-excel-button')).toBeInTheDocument()
  })

  it('should call exportToCSV when CSV button is clicked', () => {
    const exportToCSVSpy = vi.spyOn(exportUtils, 'exportToCSV')
    render(<BudgetSpreadsheet data={mockData} />)
    
    const csvButton = screen.getByTestId('export-csv-button')
    fireEvent.click(csvButton)
    
    expect(exportToCSVSpy).toHaveBeenCalledWith(mockData, expect.stringMatching(/^budget-\d{4}-\d{2}-\d{2}$/))
  })

  it('should call exportToExcel when Excel button is clicked', () => {
    const exportToExcelSpy = vi.spyOn(exportUtils, 'exportToExcel')
    render(<BudgetSpreadsheet data={mockData} />)
    
    const excelButton = screen.getByTestId('export-excel-button')
    fireEvent.click(excelButton)
    
    expect(exportToExcelSpy).toHaveBeenCalledWith(mockData, expect.stringMatching(/^budget-\d{4}-\d{2}-\d{2}$/))
  })

  it('should use timestamp in filename', () => {
    const exportToCSVSpy = vi.spyOn(exportUtils, 'exportToCSV')
    
    // Mock Date to return a specific date
    const mockDate = new Date('2024-01-15T10:30:00Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any)
    
    render(<BudgetSpreadsheet data={mockData} />)
    
    const csvButton = screen.getByTestId('export-csv-button')
    fireEvent.click(csvButton)
    
    expect(exportToCSVSpy).toHaveBeenCalledWith(mockData, 'budget-2024-01-15')
    
    vi.restoreAllMocks()
  })

  it('should export empty data gracefully', () => {
    const exportToCSVSpy = vi.spyOn(exportUtils, 'exportToCSV')
    render(<BudgetSpreadsheet data={[]} />)
    
    const csvButton = screen.getByTestId('export-csv-button')
    fireEvent.click(csvButton)
    
    expect(exportToCSVSpy).toHaveBeenCalledWith([], expect.any(String))
  })

  it('should have proper button styling', () => {
    render(<BudgetSpreadsheet data={mockData} />)
    
    const csvButton = screen.getByTestId('export-csv-button')
    const excelButton = screen.getByTestId('export-excel-button')
    
    expect(csvButton).toHaveClass('bg-green-600', 'text-white', 'rounded')
    expect(excelButton).toHaveClass('bg-blue-600', 'text-white', 'rounded')
  })
})