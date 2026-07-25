import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '@/types/auth'

const SUBTAG_SEPARATOR = '-'

function toSupportedLocale(candidate: string): Locale | null {
  const primarySubtag = candidate.split(SUBTAG_SEPARATOR)[0]?.toLowerCase()
  return SUPPORTED_LOCALES.find((locale) => locale === primarySubtag) ?? null
}

export function resolveInitialLocale(candidates: readonly string[]): Locale {
  for (const candidate of candidates) {
    const locale = toSupportedLocale(candidate)
    if (locale) return locale
  }
  return DEFAULT_LOCALE
}
