import type { CheckInState, Granularity } from '@/types/booking'

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

export function checkInBadge(state: CheckInState): BadgeConfig {
  return CHECK_IN_BADGES[state] ?? UNKNOWN_BADGE
}

const GRANULARITY_LABEL_KEYS: Record<Granularity, string> = {
  FULL_DAY: 'booking.granularity.fullDay',
  MORNING: 'booking.granularity.morning',
  AFTERNOON: 'booking.granularity.afternoon',
}

const UNKNOWN_GRANULARITY_LABEL_KEY = 'booking.granularity.unknown'

export function granularityLabelKey(granularity: Granularity): string {
  return GRANULARITY_LABEL_KEYS[granularity] ?? UNKNOWN_GRANULARITY_LABEL_KEY
}
