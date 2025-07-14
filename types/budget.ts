export type BudgetType = 'Income' | 'Expense'

export interface BudgetRow {
  type: BudgetType
  category: string
  item: string // Changed from 'name'
  description: string
  date: string // Changed from 'dueDate'
  amount: number
  notes: string
}

export interface CustomOption {
  id: string
  value: string
  createdAt: string
}

export interface BudgetDropdownData {
  categories: CustomOption[]
  items: Record<string, CustomOption[]> // items grouped by category
}

export function validateBudgetRow(row: BudgetRow): boolean {
  // Validate type
  if (!['Income', 'Expense'].includes(row.type)) {
    return false
  }

  // Validate required fields
  if (!row.category || !row.item) {
    return false
  }

  // Validate amount
  if (typeof row.amount !== 'number' || isNaN(row.amount)) {
    return false
  }

  // Income amounts should be positive
  if (row.type === 'Income' && row.amount < 0) {
    return false
  }

  return true
}