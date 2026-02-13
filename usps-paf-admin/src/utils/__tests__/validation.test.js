import { describe, it, expect } from 'vitest'
import { sanitizeAddressInput, isPlausibleAddress, MAX_BATCH_SIZE } from '../validation.js'

describe('sanitizeAddressInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeAddressInput('<script>alert("xss")</script>123 Main St'))
      .toBe('alertxss123 Main St')
  })

  it('removes dangerous characters like semicolons', () => {
    expect(sanitizeAddressInput('123 Main St; DROP TABLE addresses;'))
      .toBe('123 Main St DROP TABLE addresses')
  })

  it('trims whitespace', () => {
    expect(sanitizeAddressInput('  123 Main St  ')).toBe('123 Main St')
  })

  it('truncates long input to 500 characters', () => {
    const longInput = 'A'.repeat(1000)
    expect(sanitizeAddressInput(longInput).length).toBe(500)
  })

  it('preserves valid address characters', () => {
    expect(sanitizeAddressInput("123 Main St #4, O'Fallon, IL 62269"))
      .toBe("123 Main St #4, O'Fallon, IL 62269")
  })

  it('preserves hyphens in ZIP+4', () => {
    expect(sanitizeAddressInput('123 Main St, City, ST 12345-6789'))
      .toBe('123 Main St, City, ST 12345-6789')
  })
})

describe('isPlausibleAddress', () => {
  it('returns true for valid address format', () => {
    expect(isPlausibleAddress('123 Main St, Springfield, IL 62701')).toBe(true)
  })

  it('returns false for input without comma', () => {
    expect(isPlausibleAddress('123 Main St Springfield IL')).toBe(false)
  })

  it('returns false for too-short input', () => {
    expect(isPlausibleAddress('hi')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isPlausibleAddress('')).toBe(false)
  })

  it('returns false for input over 500 characters', () => {
    expect(isPlausibleAddress('A'.repeat(501) + ', test')).toBe(false)
  })
})

describe('MAX_BATCH_SIZE', () => {
  it('is set to 100', () => {
    expect(MAX_BATCH_SIZE).toBe(100)
  })
})
