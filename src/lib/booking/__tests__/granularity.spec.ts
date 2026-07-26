import { describe, it, expect } from 'vitest'
import { GRANULARITY_VALUES, isGranularity } from '@/lib/booking/granularity'

describe('GRANULARITY_VALUES', () => {
  it('lists the three contract granularities', () => {
    expect([...GRANULARITY_VALUES]).toEqual(['FULL_DAY', 'MORNING', 'AFTERNOON'])
  })
})

describe('isGranularity', () => {
  it('narrows a valid granularity string', () => {
    expect(isGranularity('FULL_DAY')).toBe(true)
    expect(isGranularity('AFTERNOON')).toBe(true)
  })

  it('rejects unknown values and non-strings', () => {
    expect(isGranularity('EVENING')).toBe(false)
    expect(isGranularity(undefined)).toBe(false)
    expect(isGranularity(3)).toBe(false)
  })
})
