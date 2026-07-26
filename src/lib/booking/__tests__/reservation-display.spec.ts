import { describe, it, expect } from 'vitest'
import {
  checkInBadge,
  granularityLabelKey,
  formatSlotRange,
  canCheckIn,
} from '@/lib/booking/reservation-display'
import type { ReservationSummary } from '@/types/booking'

function deskReservation(overrides: Partial<ReservationSummary> = {}): ReservationSummary {
  return {
    id: 'res-5501',
    resourceType: 'desk',
    deskId: 'desk-2b-014',
    zoneId: 'zone-2b',
    floor: '2',
    date: '2026-07-27',
    granularity: 'FULL_DAY',
    status: 'active',
    checkInState: 'not_checked_in',
    ...overrides,
  }
}

describe('checkInBadge', () => {
  it('maps a checked-in reservation to a success badge', () => {
    expect(checkInBadge('checked_in')).toEqual({
      labelKey: 'booking.checkIn.checkedIn',
      variant: 'success',
    })
  })

  it('maps a not-checked-in reservation to a neutral badge', () => {
    expect(checkInBadge('not_checked_in')).toEqual({
      labelKey: 'booking.checkIn.notCheckedIn',
      variant: 'neutral',
    })
  })
})

describe('granularityLabelKey', () => {
  it('maps each granularity to its label key', () => {
    expect(granularityLabelKey('FULL_DAY')).toBe('booking.granularity.fullDay')
    expect(granularityLabelKey('MORNING')).toBe('booking.granularity.morning')
    expect(granularityLabelKey('AFTERNOON')).toBe('booking.granularity.afternoon')
  })
})

describe('formatSlotRange', () => {
  it('renders the wall-clock time range from the reserved slot boundaries', () => {
    expect(formatSlotRange('2026-07-27T10:00:00+02:00', '2026-07-27T11:00:00+02:00')).toBe(
      '10:00–11:00',
    )
    expect(formatSlotRange('2026-07-28T09:00:00+02:00', '2026-07-28T09:30:00+02:00')).toBe(
      '09:00–09:30',
    )
  })

  it('returns an empty string when either boundary is missing', () => {
    expect(formatSlotRange(undefined, '2026-07-27T11:00:00+02:00')).toBe('')
    expect(formatSlotRange('2026-07-27T10:00:00+02:00', undefined)).toBe('')
    expect(formatSlotRange(undefined, undefined)).toBe('')
  })
})

describe('canCheckIn', () => {
  it('allows check-in for a not-checked-in desk reservation', () => {
    expect(canCheckIn(deskReservation({ checkInState: 'not_checked_in' }))).toBe(true)
  })

  it('hides check-in once the desk reservation is already checked in', () => {
    expect(canCheckIn(deskReservation({ checkInState: 'checked_in' }))).toBe(false)
  })

  it('never offers check-in for a room reservation', () => {
    const room = deskReservation({
      resourceType: 'room',
      roomId: 'room-3-201',
      deskId: undefined,
      zoneId: undefined,
      granularity: undefined,
      checkInState: undefined,
      startsAt: '2026-07-27T10:00:00+02:00',
      endsAt: '2026-07-27T11:00:00+02:00',
    })
    expect(canCheckIn(room)).toBe(false)
  })

  it('hides check-in for a desk row with no check-in state', () => {
    expect(canCheckIn(deskReservation({ checkInState: undefined }))).toBe(false)
  })
})
