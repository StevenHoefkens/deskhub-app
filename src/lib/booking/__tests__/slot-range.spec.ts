import { describe, it, expect } from 'vitest'
import { isAlignedTime, isSlotRangeOrdered } from '@/lib/booking/slot-range'

describe('slot alignment', () => {
  it('accepts times on quarter-hour boundaries', () => {
    for (const value of ['00:00', '09:15', '10:30', '14:45', '23:45']) {
      expect(isAlignedTime(value)).toBe(true)
    }
  })

  it('rejects times off the quarter-hour grid', () => {
    for (const value of ['10:05', '10:50', '09:01', '24:00', '9:15', '10:60']) {
      expect(isAlignedTime(value)).toBe(false)
    }
  })

  it('rejects non-time strings', () => {
    for (const value of ['', 'noon', '1000', undefined]) {
      expect(isAlignedTime(value)).toBe(false)
    }
  })
})

describe('slot range ordering', () => {
  it('accepts a range whose end is strictly after its start', () => {
    expect(isSlotRangeOrdered('10:00', '11:00')).toBe(true)
    expect(isSlotRangeOrdered('09:00', '09:15')).toBe(true)
  })

  it('rejects an equal or reversed range', () => {
    expect(isSlotRangeOrdered('10:00', '10:00')).toBe(false)
    expect(isSlotRangeOrdered('11:00', '10:00')).toBe(false)
  })

  it('rejects a range with a misaligned endpoint', () => {
    expect(isSlotRangeOrdered('10:05', '11:00')).toBe(false)
    expect(isSlotRangeOrdered('10:00', '11:05')).toBe(false)
  })
})
