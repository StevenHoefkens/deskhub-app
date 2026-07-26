import type { FieldError } from '@/types/errors'
import type { RoomSearchParams } from '@/types/booking'
import { isRealCalendarDate, toIsoDate } from '@/lib/booking/booking-window'
import { isAlignedTime, isSlotRangeOrdered } from '@/lib/booking/slot-range'

export const ROOM_DATE_REQUIRED = 'Please choose a date.'
export const ROOM_DATE_INVALID = 'Please enter a valid date.'
export const ROOM_DATE_IN_PAST = 'Please choose today or a future date.'
export const START_TIME_REQUIRED = 'Please choose a start time.'
export const END_TIME_REQUIRED = 'Please choose an end time.'
export const TIME_MISALIGNED = 'Times must fall on 15-minute steps (:00, :15, :30, :45).'
export const RANGE_NOT_ORDERED = 'The end time must be after the start time.'
export const MIN_CAPACITY_INVALID = 'Minimum capacity must be a whole number of at least 1.'

const MIN_CAPACITY_FLOOR = 1

interface SlotRangeValues {
  date?: string
  startTime?: string
  endTime?: string
}

function validateDate(date: string | undefined, today: Date, errors: FieldError[]): void {
  if (!date) {
    errors.push({ field: 'date', reason: ROOM_DATE_REQUIRED })
    return
  }
  if (!isRealCalendarDate(date)) {
    errors.push({ field: 'date', reason: ROOM_DATE_INVALID })
    return
  }
  if (date < toIsoDate(today)) {
    errors.push({ field: 'date', reason: ROOM_DATE_IN_PAST })
  }
}

function validateStartTime(startTime: string | undefined, errors: FieldError[]): void {
  if (!startTime) {
    errors.push({ field: 'startTime', reason: START_TIME_REQUIRED })
    return
  }
  if (!isAlignedTime(startTime)) {
    errors.push({ field: 'startTime', reason: TIME_MISALIGNED })
  }
}

function validateEndTime(
  startTime: string | undefined,
  endTime: string | undefined,
  errors: FieldError[],
): void {
  if (!endTime) {
    errors.push({ field: 'endTime', reason: END_TIME_REQUIRED })
    return
  }
  if (!isAlignedTime(endTime)) {
    errors.push({ field: 'endTime', reason: TIME_MISALIGNED })
    return
  }
  if (startTime && isAlignedTime(startTime) && !isSlotRangeOrdered(startTime, endTime)) {
    errors.push({ field: 'endTime', reason: RANGE_NOT_ORDERED })
  }
}

function validateSlotRange(values: SlotRangeValues, today: Date, errors: FieldError[]): void {
  validateDate(values.date, today, errors)
  validateStartTime(values.startTime, errors)
  validateEndTime(values.startTime, values.endTime, errors)
}

export function validateRoomSearch(
  values: Partial<RoomSearchParams>,
  today: Date = new Date(),
): FieldError[] {
  const errors: FieldError[] = []
  validateSlotRange(values, today, errors)
  if (
    values.minCapacity !== undefined &&
    (!Number.isInteger(values.minCapacity) || values.minCapacity < MIN_CAPACITY_FLOOR)
  ) {
    errors.push({ field: 'minCapacity', reason: MIN_CAPACITY_INVALID })
  }
  return errors
}
