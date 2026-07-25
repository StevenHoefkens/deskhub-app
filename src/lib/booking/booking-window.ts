export const RESERVATION_HORIZON_DAYS = 30

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value)
}

export function isRealCalendarDate(value: string): boolean {
  if (!isIsoDate(value)) return false
  return toIsoDate(new Date(`${value}T00:00:00`)) === value
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function maxBookingDateIso(today: Date): string {
  const horizon = new Date(today.getFullYear(), today.getMonth(), today.getDate() + RESERVATION_HORIZON_DAYS)
  return toIsoDate(horizon)
}

export function isWithinBookingWindow(dateIso: string, today: Date): boolean {
  if (!isIsoDate(dateIso)) return false
  return dateIso >= toIsoDate(today) && dateIso <= maxBookingDateIso(today)
}
