import * as XLSX from 'xlsx'
import type { BudgetRow } from '../types/budget'

/**
 * Sanitizes data for export to prevent formula injection and XSS attacks
 */
export function sanitizeForExport(value: string): string {
  if (!value) return value
  
  let sanitized = value
  
  // Remove formula injection attempts (=, +, -, @)
  if (/^[=+\-@]/.test(sanitized)) {
    sanitized = sanitized.substring(1)
  }
  
  // Escape HTML/XML characters
  sanitized = sanitized.replace(/[<>&"']/g, (match) => {
    const escapeMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    }
    return escapeMap[match]
  })
  
  return sanitized
}

/**
 * Sanitizes budget row data for safe export
 */
function sanitizeBudgetRow(row: BudgetRow): BudgetRow {
  return {
    type: row.type, // Keep as-is since it's a BudgetType
    category: sanitizeForExport(row.category),
    item: sanitizeForExport(row.item),
    description: sanitizeForExport(row.description),
    date: sanitizeForExport(row.date),
    amount: row.amount, // Numbers don't need sanitization
    notes: sanitizeForExport(row.notes)
  }
}

/**
 * Exports budget data to CSV format
 */
export function exportToCSV(data: BudgetRow[], filename: string): boolean {
  try {
    // Sanitize all data before export
    const sanitizedData = data.map(sanitizeBudgetRow)
    
    // Create CSV headers
    const headers = ['Type', 'Category', 'Item', 'Description', 'Date', 'Amount', 'Notes']
    
    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...sanitizedData.map(row => [
        `"${row.type}"`,
        `"${row.category}"`,
        `"${row.item}"`,
        `"${row.description}"`,
        `"${row.date}"`,
        row.amount.toFixed(2),
        `"${row.notes}"`
      ].join(','))
    ]
    
    // Create CSV content
    const csvContent = csvRows.join('\n')
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
    return true
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    return false
  }
}

/**
 * Exports budget data to Excel (.xlsx) format
 */
export function exportToExcel(data: BudgetRow[], filename: string): boolean {
  try {
    // Sanitize all data before export
    const sanitizedData = data.map(sanitizeBudgetRow)
    
    // Create worksheet data with headers
    const worksheetData = [
      ['Type', 'Category', 'Item', 'Description', 'Date', 'Amount', 'Notes'],
      ...sanitizedData.map(row => [
        row.type,
        row.category,
        row.item,
        row.description,
        row.date,
        row.amount,
        row.notes
      ])
    ]
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Set column widths for better formatting
    worksheet['!cols'] = [
      { width: 10 },  // Type
      { width: 15 },  // Category
      { width: 20 },  // Name
      { width: 25 },  // Description
      { width: 12 },  // Due Date
      { width: 12 },  // Amount
      { width: 25 }   // Notes
    ]
    
    // Format amount column as currency
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
    for (let row = 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 5 }) // Amount column (F)
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].z = '$#,##0.00'
      }
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget')
    
    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
    return true
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return false
  }
}