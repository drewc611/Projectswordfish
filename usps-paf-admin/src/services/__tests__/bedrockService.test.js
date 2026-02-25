import { describe, it, expect } from 'vitest'
import { validateAddressWithAI } from '../bedrockService.js'

// The rate limiter allows 10 calls per 60s, so tests within a single run should not hit limits.
// However, to be safe, we test that the service still works correctly.

describe('validateAddressWithAI', () => {
  it('returns valid result for properly formatted address', async () => {
    const result = await validateAddressWithAI('123 Main St, Springfield, IL 62701')
    expect(result.validation.isValid).toBeTruthy()
    expect(result.validation.dpvConfirmed).toBe('Y')
    expect(result.standardized.city).toBe('SPRINGFIELD')
    expect(result.standardized.state).toBe('IL')
  })

  it('returns invalid result for incomplete address', async () => {
    const result = await validateAddressWithAI('incomplete address')
    expect(result.validation.isValid).toBeFalsy()
    expect(result.validation.dpvConfirmed).toBe('N')
  })

  it('preserves input in the result', async () => {
    const input = '1600 Pennsylvania Ave NW, Washington, DC 20500'
    const result = await validateAddressWithAI(input)
    expect(result.input).toBe(input)
  })

  it('includes AI insights with confidence score', async () => {
    const result = await validateAddressWithAI('123 Main St, Springfield, IL 62701')
    expect(result.aiInsights).toBeDefined()
    expect(result.aiInsights.confidence).toBeGreaterThanOrEqual(0)
    expect(result.aiInsights.confidence).toBeLessThanOrEqual(1)
  })

  it('standardizes address to uppercase', async () => {
    const result = await validateAddressWithAI('123 main st, springfield, IL 62701')
    expect(result.standardized.addressLine1).toBe('123 MAIN ST')
    expect(result.standardized.city).toBe('SPRINGFIELD')
  })

  it('includes metadata with engine info', async () => {
    const result = await validateAddressWithAI('123 Main St, Springfield, IL 62701')
    expect(result.metadata.engine).toBe('AWS Bedrock + AMS API')
    expect(result.metadata.modelId).toBeDefined()
  })
})
