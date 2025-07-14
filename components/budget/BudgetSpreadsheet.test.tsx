import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BudgetSpreadsheet } from './BudgetSpreadsheet'

// Mock jspreadsheet-ce
vi.mock('jspreadsheet-ce', () => ({
  default: vi.fn(() => ({
    setData: vi.fn(),
    getData: vi.fn(() => []),
    destroy: vi.fn()
  }))
}))

describe('BudgetSpreadsheet Component', () => {
  it('should render spreadsheet container', () => {
    render(<BudgetSpreadsheet />)
    
    const container = screen.getByTestId('budget-spreadsheet')
    expect(container).toBeInTheDocument()
  })

  it('should have proper spreadsheet container structure', () => {
    const { container } = render(<BudgetSpreadsheet />)
    
    const spreadsheetDiv = container.querySelector('#budget-spreadsheet')
    expect(spreadsheetDiv).toBeInTheDocument()
    expect(spreadsheetDiv).toHaveClass('border', 'rounded-lg', 'overflow-auto')
  })

  it('should initialize with empty budget data', () => {
    const { container } = render(<BudgetSpreadsheet />)
    
    const spreadsheetDiv = container.querySelector('#budget-spreadsheet')
    expect(spreadsheetDiv).toBeInTheDocument()
  })
})