'use client'

import { useEffect, useRef } from 'react'
import { BudgetRow } from '@/types/budget'
import { sanitizeSpreadsheetCell, validateStringLength } from '@/utils/security'
import { exportToCSV, exportToExcel } from '@/utils/export'

interface BudgetSpreadsheetProps {
  data?: BudgetRow[]
  onChange?: (data: BudgetRow[]) => void
}

export function BudgetSpreadsheet({ data = [], onChange }: BudgetSpreadsheetProps) {
  const jRef = useRef<any>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    exportToCSV(data, `budget-${timestamp}`)
  }

  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    exportToExcel(data, `budget-${timestamp}`)
  }

  useEffect(() => {
    const initSpreadsheet = async () => {
      if (tableRef.current && !jRef.current) {
        try {
          // Clear any existing content
          tableRef.current.innerHTML = ''
          
          // Dynamic import for client-side only
          const jspreadsheet = (await import('jspreadsheet-ce')).default
          
          // Note: This component is no longer used - SimpleBudgetTable is the active implementation
          // jRef.current = jspreadsheet(tableRef.current, {
          //   data: data.map(row => [
          //     row.type,
          //     row.category,
          //     row.item,
          //     row.description,
          //     row.date,
          //     row.amount,
          //     row.notes
          //   ]),
          //   columns: [
          //     { title: 'Type', width: 100, type: 'dropdown', source: ['Income', 'Expense'] },
          //     { title: 'Category', width: 120 },
          //     { title: 'Item', width: 150 },
          //     { title: 'Description', width: 200 },
          //     { title: 'Date', width: 120, type: 'calendar' },
          //     { title: 'Amount', width: 100, type: 'numeric', mask: '$#,##0.00' },
          //     { title: 'Notes', width: 200 }
          //   ],
          //   minDimensions: [7, 10],
          //   allowInsertRow: true,
          //   allowDeleteRow: true,
          //   allowInsertColumn: false,
          //   allowDeleteColumn: false,
          //   onchange: (instance: any) => {
          //     if (onChange) {
          //       const rawData = instance.getData()
          //       const budgetData: BudgetRow[] = rawData.map((row: any[]) => {
          //         // Sanitize all string inputs to prevent formula injection and XSS
          //         const sanitizedRow = {
          //           type: sanitizeSpreadsheetCell(row[0] || ''),
          //           category: sanitizeSpreadsheetCell(row[1] || ''),
          //           item: sanitizeSpreadsheetCell(row[2] || ''),
          //           description: sanitizeSpreadsheetCell(row[3] || ''),
          //           date: sanitizeSpreadsheetCell(row[4] || ''),
          //           amount: Math.max(0, parseFloat(row[5]) || 0), // Ensure non-negative amounts
          //           notes: sanitizeSpreadsheetCell(row[6] || '')
          //         }

          //         // Validate string lengths to prevent DoS attacks
          //         const validationErrors: string[] = []
          //         if (!validateStringLength(sanitizedRow.category, 100).isValid) validationErrors.push('Category too long')
          //         if (!validateStringLength(sanitizedRow.item, 200).isValid) validationErrors.push('Item too long')
          //         if (!validateStringLength(sanitizedRow.description, 500).isValid) validationErrors.push('Description too long')
          //         if (!validateStringLength(sanitizedRow.notes, 1000).isValid) validationErrors.push('Notes too long')

          //         if (validationErrors.length > 0) {
          //           console.warn('Input validation errors:', validationErrors)
          //         }

          //         return sanitizedRow
          //       })
          //       onChange(budgetData)
          //     }
          //   }
          // })
        } catch (error) {
          console.error('Failed to initialize jspreadsheet:', error)
        }
      }
    }
    
    initSpreadsheet()

    return () => {
      if (jRef.current) {
        jRef.current.destroy()
        jRef.current = null
      }
    }
  }, [data, onChange])

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          data-testid="export-csv-button"
        >
          Export CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          data-testid="export-excel-button"
        >
          Export Excel
        </button>
      </div>
      <div 
        ref={tableRef} 
        id="budget-spreadsheet"
        data-testid="budget-spreadsheet"
        className="border rounded-lg overflow-auto min-h-[400px]"
        style={{ width: '100%' }}
      />
    </div>
  )
}