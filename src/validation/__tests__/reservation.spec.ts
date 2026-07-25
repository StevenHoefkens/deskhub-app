import { describe, it, expect } from 'vitest'
import {
  validateDeskSearch,
  validateReserveDesk,
  fieldErrorMap,
  DATE_OUT_OF_WINDOW,
  DATE_INVALID,
  DATE_REQUIRED,
  GRANULARITY_REQUIRED,
  DESK_REQUIRED,
} from '@/validation/reservation'

const TODAY = new Date(2026, 6, 25)

describe('validateDeskSearch', () => {
  it('reports required date and granularity for an empty form', () => {
    const errors = validateDeskSearch({}, TODAY)
    expect(errors).toEqual([
      { field: 'date', reason: DATE_REQUIRED },
      { field: 'granularity', reason: GRANULARITY_REQUIRED },
    ])
  })

  it('passes a valid in-window search', () => {
    expect(
      validateDeskSearch({ date: '2026-07-27', granularity: 'FULL_DAY' }, TODAY),
    ).toEqual([])
  })

  it('rejects a date beyond the 30-day horizon with the screen message', () => {
    const errors = validateDeskSearch({ date: '2026-09-01', granularity: 'MORNING' }, TODAY)
    expect(errors).toEqual([{ field: 'date', reason: DATE_OUT_OF_WINDOW }])
  })

  it('rejects a malformed date before checking the window', () => {
    const errors = validateDeskSearch({ date: '07-2026', granularity: 'MORNING' }, TODAY)
    expect(errors).toEqual([{ field: 'date', reason: DATE_INVALID }])
  })

  it('rejects a well-shaped but impossible date as invalid, not out-of-window', () => {
    const errors = validateDeskSearch({ date: '2026-02-30', granularity: 'MORNING' }, TODAY)
    expect(errors).toEqual([{ field: 'date', reason: DATE_INVALID }])
  })
})

describe('validateReserveDesk', () => {
  it('requires a desk in addition to date and granularity', () => {
    const errors = validateReserveDesk({ date: '2026-07-27', granularity: 'FULL_DAY' }, TODAY)
    expect(errors).toEqual([{ field: 'deskId', reason: DESK_REQUIRED }])
  })

  it('passes a valid reservation request', () => {
    expect(
      validateReserveDesk(
        { deskId: 'desk-2b-014', date: '2026-07-27', granularity: 'AFTERNOON' },
        TODAY,
      ),
    ).toEqual([])
  })
})

describe('fieldErrorMap', () => {
  it('keeps the first reason per field', () => {
    const map = fieldErrorMap([
      { field: 'date', reason: 'first' },
      { field: 'date', reason: 'second' },
      { field: 'granularity', reason: GRANULARITY_REQUIRED },
    ])
    expect(map).toEqual({ date: 'first', granularity: GRANULARITY_REQUIRED })
  })
})
