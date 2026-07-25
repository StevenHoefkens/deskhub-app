import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useI18n, detectLocale } from '@/lib/i18n/use-i18n'

describe('useI18n', () => {
  beforeEach(() => {
    useI18n().setLocale('en')
  })

  it('translates a key in the active locale', () => {
    const { t } = useI18n()
    expect(t('login.signIn.label')).toBe('Sign in with SSO')
  })

  it('switches all consumers when the locale changes (shared state)', () => {
    const a = useI18n()
    const b = useI18n()
    a.setLocale('nl')
    expect(b.locale.value).toBe('nl')
    expect(b.t('login.signIn.label')).toBe('Aanmelden met SSO')
  })

  it('translates every login-error state key in both locales', () => {
    const { t, setLocale } = useI18n()
    for (const locale of ['en', 'nl'] as const) {
      setLocale(locale)
      expect(t('login.error.idp_unreachable')).not.toBe('login.error.idp_unreachable')
      expect(t('login.error.access_denied')).not.toBe('login.error.access_denied')
      expect(t('login.error.missing_identifier')).not.toBe('login.error.missing_identifier')
    }
  })

  it('falls back to the key when it is unknown', () => {
    const { t } = useI18n()
    expect(t('nonexistent.key')).toBe('nonexistent.key')
  })
})

describe('detectLocale', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('seeds the locale from the browser language, matching a supported one', () => {
    vi.stubGlobal('navigator', { languages: ['nl-NL', 'en'] })
    expect(detectLocale()).toBe('nl')
  })

  it('falls back to English when the browser language is unsupported', () => {
    vi.stubGlobal('navigator', { languages: ['fr-FR'] })
    expect(detectLocale()).toBe('en')
  })
})
