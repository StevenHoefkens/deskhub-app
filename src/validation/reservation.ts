import type { FieldError } from '@/types/errors'
import type { DeskSearchParams, ReserveDeskRequest } from '@/types/booking'
import { isRealCalendarDate, isWithinBookingWindow } from '@/lib/booking/booking-window'
import { isGranularity } from '@/lib/booking/granularity'

export const DATE_REQUIRED = 'Please choose a date.'
export const DATE_INVALID = 'Please enter a valid date.'
export const DATE_OUT_OF_WINDOW = 'Please choose a date within the next 30 days.'
export const GRANULARITY_REQUIRED = 'Please choose when you want the desk.'
export const DESK_REQUIRED = 'Please choose a desk to reserve.'

function validateDate(date: string | undefined, today: Date, errors: FieldError[]): void {
  if (!date) {
    errors.push({ field: 'date', reason: DATE_REQUIRED })
    return
  }
  if (!isRealCalendarDate(date)) {
    errors.push({ field: 'date', reason: DATE_INVALID })
    return
  }
  if (!isWithinBookingWindow(date, today)) {
    errors.push({ field: 'date', reason: DATE_OUT_OF_WINDOW })
  }
}

function validateGranularity(granularity: string | undefined, errors: FieldError[]): void {
  if (!isGranularity(granularity)) {
    errors.push({ field: 'granularity', reason: GRANULARITY_REQUIRED })
  }
}

export function validateDeskSearch(
  values: Partial<DeskSearchParams>,
  today: Date = new Date(),
): FieldError[] {
  const errors: FieldError[] = []
  validateDate(values.date, today, errors)
  validateGranularity(values.granularity, errors)
  return errors
}

export function validateReserveDesk(
  values: Partial<ReserveDeskRequest>,
  today: Date = new Date(),
): FieldError[] {
  const errors: FieldError[] = []
  if (!values.deskId) {
    errors.push({ field: 'deskId', reason: DESK_REQUIRED })
  }
  validateDate(values.date, today, errors)
  validateGranularity(values.granularity, errors)
  return errors
}

export function fieldErrorMap(errors: FieldError[]): Record<string, string> {
  return errors.reduce<Record<string, string>>((map, error) => {
    map[error.field] ??= error.reason
    return map
  }, {})
}
