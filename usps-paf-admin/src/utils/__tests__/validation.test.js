import { describe, it, expect } from 'vitest'
import {
  sanitizeAddressInput,
  isPlausibleAddress,
  MAX_BATCH_SIZE,
  isValidCIDR,
  isValidSessionTimeout,
  isValidEndpointUrl,
  createRateLimiter,
} from '../validation.js'

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

  it('returns empty string for non-string input', () => {
    expect(sanitizeAddressInput(null)).toBe('')
    expect(sanitizeAddressInput(undefined)).toBe('')
    expect(sanitizeAddressInput(42)).toBe('')
  })

  it('strips nested HTML tags', () => {
    expect(sanitizeAddressInput('<<script>>alert("xss")<</script>>123'))
      .toBe('alertxss123')
  })

  it('removes javascript: URI schemes', () => {
    expect(sanitizeAddressInput('javascript:alert(1)')).toBe('alert1')
  })

  it('removes data: URI schemes', () => {
    // After removing "data:", the "/" is preserved as it's an address-safe character
    expect(sanitizeAddressInput('data:text/html,test')).toBe('text/html,test')
  })

  it('removes event handler attributes', () => {
    expect(sanitizeAddressInput('onerror=alert(1)')).toBe('alert1')
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

  it('returns false for non-string input', () => {
    expect(isPlausibleAddress(null)).toBe(false)
    expect(isPlausibleAddress(undefined)).toBe(false)
    expect(isPlausibleAddress(123)).toBe(false)
  })
})

describe('MAX_BATCH_SIZE', () => {
  it('is set to 100', () => {
    expect(MAX_BATCH_SIZE).toBe(100)
  })
})

describe('isValidCIDR', () => {
  it('accepts valid CIDR blocks', () => {
    expect(isValidCIDR('10.0.0.0/8')).toBe(true)
    expect(isValidCIDR('192.168.1.0/24')).toBe(true)
    expect(isValidCIDR('172.16.0.0/12')).toBe(true)
    expect(isValidCIDR('0.0.0.0/0')).toBe(true)
  })

  it('rejects invalid CIDR blocks', () => {
    expect(isValidCIDR('256.0.0.0/8')).toBe(false)
    expect(isValidCIDR('10.0.0.0/33')).toBe(false)
    expect(isValidCIDR('10.0.0/8')).toBe(false)
    expect(isValidCIDR('not-a-cidr')).toBe(false)
    expect(isValidCIDR('')).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(isValidCIDR(null)).toBe(false)
    expect(isValidCIDR(undefined)).toBe(false)
    expect(isValidCIDR(123)).toBe(false)
  })
})

describe('isValidSessionTimeout', () => {
  it('accepts valid timeout values', () => {
    expect(isValidSessionTimeout(5)).toBe(true)
    expect(isValidSessionTimeout(30)).toBe(true)
    expect(isValidSessionTimeout(1440)).toBe(true)
  })

  it('rejects out-of-range values', () => {
    expect(isValidSessionTimeout(0)).toBe(false)
    expect(isValidSessionTimeout(4)).toBe(false)
    expect(isValidSessionTimeout(1441)).toBe(false)
    expect(isValidSessionTimeout(-1)).toBe(false)
  })

  it('rejects non-integer values', () => {
    expect(isValidSessionTimeout(30.5)).toBe(false)
    expect(isValidSessionTimeout('abc')).toBe(false)
  })
})

describe('isValidEndpointUrl', () => {
  it('accepts valid URLs', () => {
    expect(isValidEndpointUrl('https://api.example.com/v1')).toBe(true)
    expect(isValidEndpointUrl('http://localhost:3000/api')).toBe(true)
  })

  it('accepts relative paths', () => {
    expect(isValidEndpointUrl('/api/bedrock')).toBe(true)
    expect(isValidEndpointUrl('/api/v1/validate')).toBe(true)
  })

  it('rejects javascript: and data: URIs', () => {
    expect(isValidEndpointUrl('javascript:alert(1)')).toBe(false)
    expect(isValidEndpointUrl('data:text/html,<h1>hi</h1>')).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(isValidEndpointUrl(null)).toBe(false)
    expect(isValidEndpointUrl(123)).toBe(false)
  })
})

describe('createRateLimiter', () => {
  it('allows calls within the limit', () => {
    const limiter = createRateLimiter(3, 60000)
    expect(limiter.tryAcquire()).toBe(true)
    expect(limiter.tryAcquire()).toBe(true)
    expect(limiter.tryAcquire()).toBe(true)
  })

  it('blocks calls beyond the limit', () => {
    const limiter = createRateLimiter(2, 60000)
    expect(limiter.tryAcquire()).toBe(true)
    expect(limiter.tryAcquire()).toBe(true)
    expect(limiter.tryAcquire()).toBe(false)
  })

  it('returns retry-after time when rate limited', () => {
    const limiter = createRateLimiter(1, 60000)
    limiter.tryAcquire()
    expect(limiter.getRetryAfterMs()).toBeGreaterThan(0)
  })

  it('returns 0 retry-after when not rate limited', () => {
    const limiter = createRateLimiter(5, 60000)
    expect(limiter.getRetryAfterMs()).toBe(0)
  })

  it('resets correctly', () => {
    const limiter = createRateLimiter(1, 60000)
    limiter.tryAcquire()
    expect(limiter.tryAcquire()).toBe(false)
    limiter.reset()
    expect(limiter.tryAcquire()).toBe(true)
  })
})
