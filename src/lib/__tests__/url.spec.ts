import { describe, it, expect } from 'vitest'
import { safeInternalPath } from '@/lib/url'
import { HOME_PATH } from '@/config/auth'

describe('safeInternalPath', () => {
  it('accepts a single-slash internal path with query', () => {
    expect(safeInternalPath('/desks?date=2026-07-27')).toBe('/desks?date=2026-07-27')
  })

  it('accepts the root path', () => {
    expect(safeInternalPath('/')).toBe('/')
  })

  it('rejects a protocol-relative URL', () => {
    expect(safeInternalPath('//evil.com')).toBe(HOME_PATH)
  })

  it('rejects a backslash-prefixed protocol-relative URL', () => {
    expect(safeInternalPath('/\\evil.com')).toBe(HOME_PATH)
  })

  it('rejects an absolute URL with a scheme', () => {
    expect(safeInternalPath('https://evil.com')).toBe(HOME_PATH)
    expect(safeInternalPath('javascript:alert(1)')).toBe(HOME_PATH)
  })

  it('rejects a path without a leading slash', () => {
    expect(safeInternalPath('desks')).toBe(HOME_PATH)
  })

  it('falls back for empty or nullish input', () => {
    expect(safeInternalPath('')).toBe(HOME_PATH)
    expect(safeInternalPath(null)).toBe(HOME_PATH)
    expect(safeInternalPath(undefined)).toBe(HOME_PATH)
  })
})
