import { describe, it, expect } from 'vitest'
import {
  validateRoomSearch,
  ROOM_DATE_REQUIRED,
  ROOM_DATE_INVALID,
  ROOM_DATE_IN_PAST,
  START_TIME_REQUIRED,
  END_TIME_REQUIRED,
  TIME_MISALIGNED,
  RANGE_NOT_ORDERED,
  MIN_CAPACITY_INVALID,
} from '@/validation/room'
import type { RoomSearchParams } from '@/types/booking'

const TODAY = new Date(2026, 6, 26)

function reasons(errors: { field: string; reason: string }[], field: string): string[] {
  return errors.filter((error) => error.field === field).map((error) => error.reason)
}

describe('validateRoomSearch', () => {
  const valid: Partial<RoomSearchParams> = {
    date: '2026-07-27',
    startTime: '10:00',
    endTime: '11:00',
  }

  it('accepts a valid future range with no filters', () => {
    expect(validateRoomSearch(valid, TODAY)).toEqual([])
  })

  it('accepts a same-day range (no past when the date is today)', () => {
    expect(validateRoomSearch({ ...valid, date: '2026-07-26' }, TODAY)).toEqual([])
  })

  it('accepts a range far in the future (no booking horizon cap)', () => {
    expect(validateRoomSearch({ ...valid, date: '2027-03-10' }, TODAY)).toEqual([])
  })

  it('requires a date', () => {
    expect(reasons(validateRoomSearch({ ...valid, date: undefined }, TODAY), 'date')).toContain(
      ROOM_DATE_REQUIRED,
    )
  })

  it('rejects an impossible calendar date', () => {
    expect(reasons(validateRoomSearch({ ...valid, date: '2026-02-31' }, TODAY), 'date')).toContain(
      ROOM_DATE_INVALID,
    )
  })

  it('rejects a date in the past', () => {
    expect(reasons(validateRoomSearch({ ...valid, date: '2026-07-25' }, TODAY), 'date')).toContain(
      ROOM_DATE_IN_PAST,
    )
  })

  it('requires start and end times', () => {
    const errors = validateRoomSearch({ date: '2026-07-27' }, TODAY)
    expect(reasons(errors, 'startTime')).toContain(START_TIME_REQUIRED)
    expect(reasons(errors, 'endTime')).toContain(END_TIME_REQUIRED)
  })

  it('rejects misaligned times', () => {
    const errors = validateRoomSearch({ ...valid, startTime: '10:05', endTime: '10:50' }, TODAY)
    expect(reasons(errors, 'startTime')).toContain(TIME_MISALIGNED)
    expect(reasons(errors, 'endTime')).toContain(TIME_MISALIGNED)
  })

  it('rejects a range whose end is not after its start', () => {
    expect(
      reasons(validateRoomSearch({ ...valid, startTime: '11:00', endTime: '10:00' }, TODAY), 'endTime'),
    ).toContain(RANGE_NOT_ORDERED)
  })

  it('rejects a minimum capacity below one or non-integer', () => {
    expect(reasons(validateRoomSearch({ ...valid, minCapacity: 0 }, TODAY), 'minCapacity')).toContain(
      MIN_CAPACITY_INVALID,
    )
    expect(reasons(validateRoomSearch({ ...valid, minCapacity: 2.5 }, TODAY), 'minCapacity')).toContain(
      MIN_CAPACITY_INVALID,
    )
  })

  it('accepts a valid minimum capacity', () => {
    expect(validateRoomSearch({ ...valid, minCapacity: 6 }, TODAY)).toEqual([])
  })
})
