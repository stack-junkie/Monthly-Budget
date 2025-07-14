import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormToggle } from './FormToggle'
import type { BudgetItem } from '../../types/budget'

const mockBudgetItem: BudgetItem = {
  id: '1',
  date: '2025-01-01',
  description: 'Test expense',
  category: 'Food',
  amount: 25.99,
  type: 'expense',
  account: 'Checking',
  notes: 'Test note'
}

describe('FormToggle Component', () => {
  it('should render toggle button', () => {
    const mockOnSave = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(<FormToggle onSave={mockOnSave} onCancel={mockOnCancel} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle to form view/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('should show form when toggle is clicked', () => {
    const mockOnSave = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(<FormToggle onSave={mockOnSave} onCancel={mockOnCancel} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle to form view/i })
    fireEvent.click(toggleButton)
    
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
  })

  it('should populate form with initial data when provided', () => {
    const mockOnSave = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(<FormToggle onSave={mockOnSave} onCancel={mockOnCancel} initialData={mockBudgetItem} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle to form view/i })
    fireEvent.click(toggleButton)
    
    expect(screen.getByDisplayValue('Test expense')).toBeInTheDocument()
    expect(screen.getByDisplayValue('25.99')).toBeInTheDocument()
  })

  it('should call onSave when save button is clicked', () => {
    const mockOnSave = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(<FormToggle onSave={mockOnSave} onCancel={mockOnCancel} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle to form view/i })
    fireEvent.click(toggleButton)
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    expect(mockOnSave).toHaveBeenCalled()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const mockOnSave = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(<FormToggle onSave={mockOnSave} onCancel={mockOnCancel} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle to form view/i })
    fireEvent.click(toggleButton)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })
})