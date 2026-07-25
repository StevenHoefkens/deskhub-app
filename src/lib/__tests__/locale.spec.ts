import { describe, it, expect } from 'vitest'
import { resolveInitialLocale } from '@/lib/locale'

describe('resolveInitialLocale', () => {
  it('matches a supported region-qualified locale by its primary subtag', () => {
    expect(resolveInitialLocale(['nl-NL'])).toBe('nl')
  })

  it('matches a bare supported locale', () => {
    expect(resolveInitialLocale(['nl'])).toBe('nl')
  })

  it('is case-insensitive on the primary subtag', () => {
    expect(resolveInitialLocale(['NL-nl'])).toBe('nl')
  })

  it('picks the first supported candidate, skipping unsupported ones', () => {
    expect(resolveInitialLocale(['fr-FR', 'de', 'nl-NL'])).toBe('nl')
  })

  it('falls back to English when no candidate is supported', () => {
    expect(resolveInitialLocale(['fr-FR', 'de'])).toBe('en')
  })

  it('falls back to English for an empty candidate list', () => {
    expect(resolveInitialLocale([])).toBe('en')
  })
})
