import { describe, it, expect } from 'vitest'
import {
  RESERVATION_HORIZON_DAYS,
  isIsoDate,
  isRealCalendarDate,
  toIsoDate,
  maxBookingDateIso,
  isWithinBookingWindow,
} from '@/lib/booking/booking-window'

const TODAY = new Date(2026, 6, 25)

describe('isIsoDate', () => {
  it('accepts a yyyy-mm-dd string', () => {
    expect(isIsoDate('2026-07-27')).toBe(true)
  })

  it('rejects other shapes', () => {
    expect(isIsoDate('27/07/2026')).toBe(false)
    expect(isIsoDate('2026-7-2')).toBe(false)
    expect(isIsoDate('')).toBe(false)
  })
})

describe('isRealCalendarDate', () => {
  it('accepts a real calendar date', () => {
    expect(isRealCalendarDate('2026-07-27')).toBe(true)
  })

  it('rejects a well-shaped but impossible date', () => {
    expect(isRealCalendarDate('2026-13-45')).toBe(false)
    expect(isRealCalendarDate('2026-02-30')).toBe(false)
  })
})

describe('toIsoDate', () => {
  it('formats a date as a zero-padded local yyyy-mm-dd', () => {
    expect(toIsoDate(new Date(2026, 6, 5))).toBe('2026-07-05')
    expect(toIsoDate(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('maxBookingDateIso', () => {
  it('is the horizon number of calendar days after today', () => {
    expect(RESERVATION_HORIZON_DAYS).toBe(30)
    expect(maxBookingDateIso(TODAY)).toBe('2026-08-24')
  })
})

describe('isWithinBookingWindow', () => {
  it('accepts today through the horizon boundary inclusive', () => {
    expect(isWithinBookingWindow('2026-07-25', TODAY)).toBe(true)
    expect(isWithinBookingWindow('2026-08-24', TODAY)).toBe(true)
  })

  it('rejects a past date and a date beyond the horizon', () => {
    expect(isWithinBookingWindow('2026-07-24', TODAY)).toBe(false)
    expect(isWithinBookingWindow('2026-08-25', TODAY)).toBe(false)
  })

  it('rejects a malformed date', () => {
    expect(isWithinBookingWindow('not-a-date', TODAY)).toBe(false)
  })
})
