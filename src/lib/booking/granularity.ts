import type { Granularity } from '@/types/booking'

export const GRANULARITY_VALUES: readonly Granularity[] = ['FULL_DAY', 'MORNING', 'AFTERNOON']

export function isGranularity(value: unknown): value is Granularity {
  return typeof value === 'string' && (GRANULARITY_VALUES as readonly string[]).includes(value)
}
