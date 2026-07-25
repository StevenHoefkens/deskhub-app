import { describe, it, expect } from 'vitest'
import {
  checkInBadge,
  granularityLabelKey,
} from '@/lib/booking/reservation-display'

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
