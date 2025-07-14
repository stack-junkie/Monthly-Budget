import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryDropdown } from './CategoryDropdown'

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other Income']
const expenseCategories = ['Housing', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Other Expense']

describe('CategoryDropdown Component', () => {
  it('should render dropdown with placeholder', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="" 
        onChange={mockOnChange}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeInTheDocument()
    expect(dropdown).toHaveDisplayValue('Select Category')
  })

  it('should display income categories when type is Income', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="" 
        onChange={mockOnChange}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    fireEvent.click(dropdown)
    
    incomeCategories.forEach(category => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument()
    })
  })

  it('should display expense categories when type is Expense', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Expense" 
        value="" 
        onChange={mockOnChange}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    
    expenseCategories.forEach(category => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument()
    })
  })

  it('should call onChange when option is selected', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="" 
        onChange={mockOnChange}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    fireEvent.change(dropdown, { target: { value: 'Salary' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('Salary')
  })

  it('should display selected value', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="Freelance" 
        onChange={mockOnChange}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toHaveDisplayValue('Freelance')
  })

  it('should show custom category input when Other is selected', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="Other Income" 
        onChange={mockOnChange}
        allowCustom={true}
      />
    )
    
    expect(screen.getByPlaceholderText('Enter custom category')).toBeInTheDocument()
  })

  it('should call onChange with custom category value', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="Other Income" 
        onChange={mockOnChange}
        allowCustom={true}
      />
    )
    
    const customInput = screen.getByPlaceholderText('Enter custom category')
    fireEvent.change(customInput, { target: { value: 'Consulting' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('Consulting')
  })

  it('should apply custom className when provided', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="" 
        onChange={mockOnChange}
        className="custom-class"
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toHaveClass('custom-class')
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    
    render(
      <CategoryDropdown 
        type="Income" 
        value="" 
        onChange={mockOnChange}
        disabled={true}
      />
    )
    
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeDisabled()
  })
})