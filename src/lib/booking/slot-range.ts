const ALIGNED_TIME_PATTERN = /^([01][0-9]|2[0-3]):(00|15|30|45)$/

export function isAlignedTime(value: string | undefined): boolean {
  return value !== undefined && ALIGNED_TIME_PATTERN.test(value)
}

export function isSlotRangeOrdered(startTime: string, endTime: string): boolean {
  if (!isAlignedTime(startTime) || !isAlignedTime(endTime)) {
    return false
  }
  return endTime > startTime
}
