import { describe, it, expect } from 'vitest'
import { 
  sanitizeSpreadsheetCell, 
  validateStringLength, 
  sanitizeGoogleAnalyticsId,
  preventXSS 
} from './security'

describe('Security Utils', () => {
  describe('sanitizeSpreadsheetCell', () => {
    it('should remove formula injection attempts', () => {
      expect(sanitizeSpreadsheetCell('=SUM(A1:A10)')).toBe('SUM(A1:A10)')
      expect(sanitizeSpreadsheetCell('+AVERAGE(B1:B5)')).toBe('AVERAGE(B1:B5)')
      expect(sanitizeSpreadsheetCell('-COUNT(C1:C3)')).toBe('COUNT(C1:C3)')
      expect(sanitizeSpreadsheetCell('@INDIRECT("A1")')).toBe('INDIRECT(&quot;A1&quot;)')
    })

    it('should escape HTML special characters', () => {
      expect(sanitizeSpreadsheetCell('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(sanitizeSpreadsheetCell('Tom & Jerry')).toBe('Tom &amp; Jerry')
      expect(sanitizeSpreadsheetCell("It's working")).toBe('It&#x27;s working')
    })

    it('should handle normal text safely', () => {
      expect(sanitizeSpreadsheetCell('Salary Income')).toBe('Salary Income')
      expect(sanitizeSpreadsheetCell('1000.50')).toBe('1000.50')
      expect(sanitizeSpreadsheetCell('')).toBe('')
    })

    it('should preserve legitimate minus signs in numbers', () => {
      expect(sanitizeSpreadsheetCell('Regular text with - dash')).toBe('Regular text with - dash')
      expect(sanitizeSpreadsheetCell('Temperature: -5°C')).toBe('Temperature: -5°C')
    })
  })

  describe('validateStringLength', () => {
    it('should return valid for strings within limit', () => {
      const result = validateStringLength('Hello World', 50)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error for strings exceeding limit', () => {
      const longString = 'a'.repeat(1001)
      const result = validateStringLength(longString, 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Input too long. Maximum 1000 characters allowed.')
    })

    it('should use default limit of 1000 characters', () => {
      const longString = 'a'.repeat(1001)
      const result = validateStringLength(longString)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('1000 characters')
    })

    it('should handle empty strings', () => {
      const result = validateStringLength('')
      expect(result.isValid).toBe(true)
    })
  })

  describe('sanitizeGoogleAnalyticsId', () => {
    it('should validate correct GA4 tracking IDs', () => {
      expect(sanitizeGoogleAnalyticsId('G-XXXXXXXXXX')).toBe('G-XXXXXXXXXX')
      expect(sanitizeGoogleAnalyticsId('G-123456789A')).toBe('G-123456789A')
    })

    it('should reject invalid GA tracking IDs', () => {
      expect(sanitizeGoogleAnalyticsId('UA-123456-1')).toBeNull()
      expect(sanitizeGoogleAnalyticsId('invalid-id')).toBeNull()
      expect(sanitizeGoogleAnalyticsId('<script>alert("xss")</script>')).toBeNull()
      expect(sanitizeGoogleAnalyticsId('')).toBeNull()
    })

    it('should handle null or undefined input', () => {
      expect(sanitizeGoogleAnalyticsId(null)).toBeNull()
      expect(sanitizeGoogleAnalyticsId(undefined)).toBeNull()
    })
  })

  describe('preventXSS', () => {
    it('should escape all dangerous HTML characters', () => {
      expect(preventXSS('<script>alert("hack")</script>')).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;')
      expect(preventXSS('<img src="x" onerror="alert(1)">')).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;')
    })

    it('should handle normal text without changes', () => {
      expect(preventXSS('Hello World')).toBe('Hello World')
      expect(preventXSS('Price: $100')).toBe('Price: $100')
    })

    it('should handle empty or null input', () => {
      expect(preventXSS('')).toBe('')
      expect(preventXSS(null)).toBe('')
      expect(preventXSS(undefined)).toBe('')
    })
  })
})