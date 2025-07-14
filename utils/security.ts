import type { ValidationResult } from './validation'

/**
 * Sanitizes spreadsheet cell input to prevent formula injection attacks
 * Removes dangerous formula prefixes and escapes HTML characters
 */
export function sanitizeSpreadsheetCell(value: string): string {
  if (!value) return value

  let sanitized = value

  // Remove potential formula injections - but only if they're at the start
  if (/^[=+\-@]/.test(sanitized)) {
    sanitized = sanitized.substring(1)
  }

  // Escape HTML special characters to prevent XSS
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
 * Validates string length to prevent DoS attacks through oversized input
 */
export function validateStringLength(value: string, maxLength: number = 1000): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `Input too long. Maximum ${maxLength} characters allowed.`
    }
  }
  return { isValid: true }
}

/**
 * Validates and sanitizes Google Analytics tracking ID
 * Only allows valid GA4 format to prevent XSS injection
 */
export function sanitizeGoogleAnalyticsId(trackingId: string | null | undefined): string | null {
  if (!trackingId) return null

  // Validate GA4 format: G- followed by 10 alphanumeric characters
  const ga4Pattern = /^G-[A-Z0-9]{10}$/
  
  if (ga4Pattern.test(trackingId)) {
    return trackingId
  }
  
  return null
}

/**
 * General purpose XSS prevention utility
 * Escapes dangerous HTML characters in user input
 */
export function preventXSS(input: string | null | undefined): string {
  if (!input) return ''

  return input.replace(/[<>&"']/g, (match) => {
    const escapeMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    }
    return escapeMap[match]
  })
}