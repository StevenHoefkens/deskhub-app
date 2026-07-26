import type { CheckInState, Granularity, ReservationSummary } from '@/types/booking'

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeConfig {
  labelKey: string
  variant: BadgeVariant
}

const CHECK_IN_BADGES: Record<CheckInState, BadgeConfig> = {
  not_checked_in: { labelKey: 'booking.checkIn.notCheckedIn', variant: 'neutral' },
  checked_in: { labelKey: 'booking.checkIn.checkedIn', variant: 'success' },
}

const UNKNOWN_BADGE: BadgeConfig = { labelKey: 'booking.checkIn.unknown', variant: 'neutral' }

export function checkInBadge(state: CheckInState | undefined): BadgeConfig {
  return (state && CHECK_IN_BADGES[state]) ?? UNKNOWN_BADGE
}

const GRANULARITY_LABEL_KEYS: Record<Granularity, string> = {
  FULL_DAY: 'booking.granularity.fullDay',
  MORNING: 'booking.granularity.morning',
  AFTERNOON: 'booking.granularity.afternoon',
}

const UNKNOWN_GRANULARITY_LABEL_KEY = 'booking.granularity.unknown'

export function granularityLabelKey(granularity: Granularity | undefined): string {
  return (granularity && GRANULARITY_LABEL_KEYS[granularity]) ?? UNKNOWN_GRANULARITY_LABEL_KEY
}

export function canCheckIn(reservation: ReservationSummary): boolean {
  return reservation.resourceType === 'desk' && reservation.checkInState === 'not_checked_in'
}

const ISO_TIME_START = 11
const ISO_TIME_END = 16
const SLOT_RANGE_SEPARATOR = '–'

function wallClockTime(isoDateTime: string): string {
  return isoDateTime.slice(ISO_TIME_START, ISO_TIME_END)
}

export function formatSlotRange(
  startsAt: string | undefined,
  endsAt: string | undefined,
): string {
  if (!startsAt || !endsAt) {
    return ''
  }
  return `${wallClockTime(startsAt)}${SLOT_RANGE_SEPARATOR}${wallClockTime(endsAt)}`
}
