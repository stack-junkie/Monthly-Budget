import type { BudgetRow } from '../types/budget'
import { sanitizeSpreadsheetCell, validateStringLength } from './security'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface BudgetRowValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    }
  }
  return { isValid: true }
}

export function validateAmount(amount: number): ValidationResult {
  if (amount <= 0) {
    return {
      isValid: false,
      error: 'Amount must be greater than 0'
    }
  }
  return { isValid: true }
}

export function validateDate(dateString: string): ValidationResult {
  if (!dateString || dateString.trim() === '') {
    return {
      isValid: false,
      error: 'Date is required'
    }
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format'
    }
  }

  return { isValid: true }
}

export function validateBudgetRow(row: BudgetRow): BudgetRowValidationResult {
  const errors: Record<string, string> = {}

  // Sanitize inputs first to prevent injection attacks
  const sanitizedRow = {
    ...row,
    type: sanitizeSpreadsheetCell(row.type),
    category: sanitizeSpreadsheetCell(row.category),
    item: sanitizeSpreadsheetCell(row.item),
    description: sanitizeSpreadsheetCell(row.description),
    date: sanitizeSpreadsheetCell(row.date),
    notes: sanitizeSpreadsheetCell(row.notes)
  }

  // Validate required fields
  const typeValidation = validateRequired(sanitizedRow.type, 'Type')
  if (!typeValidation.isValid) {
    errors.type = typeValidation.error!
  } else if (sanitizedRow.type !== 'Income' && sanitizedRow.type !== 'Expense') {
    errors.type = 'Type must be either Income or Expense'
  }

  const categoryValidation = validateRequired(sanitizedRow.category, 'Category')
  if (!categoryValidation.isValid) {
    errors.category = categoryValidation.error!
  }

  const itemValidation = validateRequired(sanitizedRow.item, 'Item')
  if (!itemValidation.isValid) {
    errors.item = itemValidation.error!
  }

  const descriptionValidation = validateRequired(sanitizedRow.description, 'Description')
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error!
  }

  // Validate date
  const dateValidation = validateDate(sanitizedRow.date)
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error!
  }

  // Validate amount
  const amountValidation = validateAmount(row.amount)
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.error!
  }

  // Validate string lengths to prevent DoS attacks
  const lengthValidations = [
    { field: 'category', validation: validateStringLength(sanitizedRow.category, 100) },
    { field: 'item', validation: validateStringLength(sanitizedRow.item, 200) },
    { field: 'description', validation: validateStringLength(sanitizedRow.description, 500) },
    { field: 'notes', validation: validateStringLength(sanitizedRow.notes, 1000) }
  ]

  lengthValidations.forEach(({ field, validation }) => {
    if (!validation.isValid) {
      errors[field] = validation.error!
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}