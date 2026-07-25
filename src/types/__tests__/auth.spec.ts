import { describe, it, expect } from 'vitest'
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOGIN_ERROR_STATES,
  type Locale,
  type LoginErrorState,
} from '@/types/auth'

describe('auth domain model', () => {
  it('supports exactly the English and Dutch locales', () => {
    expect([...SUPPORTED_LOCALES]).toEqual(['en', 'nl'])
  })

  it('defaults the locale to English', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })

  it('enumerates the login error states from the login screen', () => {
    expect([...LOGIN_ERROR_STATES]).toEqual(['idp_unreachable', 'access_denied', 'missing_identifier'])
  })

  it('narrows Locale and LoginErrorState to their members', () => {
    const locale: Locale = 'nl'
    const state: LoginErrorState = 'access_denied'
    expect(SUPPORTED_LOCALES).toContain(locale)
    expect(LOGIN_ERROR_STATES).toContain(state)
  })
})
