// Validation utility functions following naming conventions

/**
 * Validate Colombian tax ID (NIT)
 */
export const validateTaxId = (taxId: string): boolean => {
  const cleaned = taxId.replace(/\D/g, '')
  
  if (cleaned.length < 8 || cleaned.length > 10) {
    return false
  }
  
  // NIT validation algorithm
  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
  const digits = cleaned.split('').map(Number).reverse()
  
  let sum = 0
  for (let i = 1; i < digits.length; i++) {
    sum += digits[i] * weights[i - 1]
  }
  
  const remainder = sum % 11
  const checkDigit = remainder < 2 ? remainder : 11 - remainder
  
  return checkDigit === digits[0]
}

/**
 * Validate Colombian phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Mobile: 10 digits starting with 3
  if (cleaned.length === 10 && cleaned.startsWith('3')) {
    return true
  }
  
  // Landline: 7-8 digits
  if (cleaned.length >= 7 && cleaned.length <= 8) {
    return true
  }
  
  return false
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate vehicle plate (Colombian format)
 */
export const validateVehiclePlate = (plate: string): boolean => {
  // Colombian format: ABC123 or ABC12D
  const plateRegex = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/
  return plateRegex.test(plate.toUpperCase().replace(/\s/g, ''))
}

/**
 * Validate driver license number
 */
export const validateDriverLicense = (license: string): boolean => {
  const cleaned = license.replace(/\D/g, '')
  return cleaned.length >= 8 && cleaned.length <= 12
}

/**
 * Validate required field
 */
export const validateRequired = (value: string | number | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * Validate minimum length
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

/**
 * Validate maximum length
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength
}

/**
 * Validate number range
 */
export const validateNumberRange = (value: number, min?: number, max?: number): boolean => {
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}

/**
 * Validate date range
 */
export const validateDateRange = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return false
  if (maxDate && date > maxDate) return false
  return true
}

/**
 * Validate future date
 */
export const validateFutureDate = (date: Date): boolean => {
  return date > new Date()
}

/**
 * Validate past date
 */
export const validatePastDate = (date: Date): boolean => {
  return date < new Date()
}

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes
}

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number): boolean => {
  return value > 0
}

/**
 * Validate decimal places
 */
export const validateDecimalPlaces = (value: number, maxDecimals: number): boolean => {
  const decimalPlaces = (value.toString().split('.')[1] || '').length
  return decimalPlaces <= maxDecimals
}

/**
 * Comprehensive form validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Create validation result
 */
export const createValidationResult = (errors: Record<string, string> = {}): ValidationResult => {
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
