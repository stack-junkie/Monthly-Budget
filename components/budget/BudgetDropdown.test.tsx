import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BudgetDropdown } from './BudgetDropdown'
import { CustomOption } from '@/types/budget'

describe('BudgetDropdown', () => {
  const mockOnChange = vi.fn()
  const mockOnAddCustomOption = vi.fn()
  
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    options: ['Housing', 'Food', 'Transportation'],
    customOptions: [] as CustomOption[],
    onAddCustomOption: mockOnAddCustomOption,
    placeholder: 'Select category',
    type: 'category' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dropdown with options', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Select category')).toBeInTheDocument()
    expect(screen.getByText('Housing')).toBeInTheDocument()
    expect(screen.getByText('Create new category...')).toBeInTheDocument()
  })

  it('calls onChange when option is selected', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: 'Housing' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('Housing')
  })

  it('shows add form when create new is selected', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    expect(screen.getByText('Create New Category')).toBeInTheDocument()
    expect(screen.getByTestId('new-category-input')).toBeInTheDocument()
  })

  it('adds new custom option', async () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    const input = screen.getByTestId('new-category-input')
    fireEvent.change(input, { target: { value: 'New Category' } })
    
    const addButton = screen.getByTestId('add-button')
    fireEvent.click(addButton)
    
    expect(mockOnAddCustomOption).toHaveBeenCalledWith('New Category')
    expect(mockOnChange).toHaveBeenCalledWith('New Category')
  })

  it('cancels add form', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    const cancelButton = screen.getByTestId('cancel-button')
    fireEvent.click(cancelButton)
    
    expect(screen.queryByText('Create New Category')).not.toBeInTheDocument()
  })

  it('sorts options alphabetically', () => {
    const customOptions: CustomOption[] = [
      { id: '1', value: 'Zebra Category', createdAt: '2024-01-01' },
      { id: '2', value: 'Alpha Category', createdAt: '2024-01-02' }
    ]
    
    render(<BudgetDropdown {...defaultProps} customOptions={customOptions} />)
    
    const select = screen.getByTestId('category-dropdown')
    const options = select.querySelectorAll('option')
    
    // Should be: placeholder, Alpha Category, Food, Housing, Transportation, Zebra Category, Create new...
    expect(options[1]).toHaveTextContent('Alpha Category')
    expect(options[2]).toHaveTextContent('Food')
    expect(options[5]).toHaveTextContent('Zebra Category')
  })

  it('handles keyboard shortcuts in add form', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    const input = screen.getByTestId('new-category-input')
    fireEvent.change(input, { target: { value: 'New Category' } })
    
    // Test Enter key
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockOnAddCustomOption).toHaveBeenCalledWith('New Category')
  })

  it('closes form on Escape key', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    const input = screen.getByTestId('new-category-input')
    fireEvent.keyDown(input, { key: 'Escape' })
    
    expect(screen.queryByText('Create New Category')).not.toBeInTheDocument()
  })

  it('disables add button when input is empty', () => {
    render(<BudgetDropdown {...defaultProps} />)
    
    const select = screen.getByTestId('category-dropdown')
    fireEvent.change(select, { target: { value: '__add_new__' } })
    
    const addButton = screen.getByTestId('add-button')
    expect(addButton).toBeDisabled()
  })
})