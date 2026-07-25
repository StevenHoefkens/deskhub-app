import { ref, type Ref } from 'vue'
import { resolveInitialLocale } from '@/lib/locale'
import type { Locale } from '@/types/auth'
import { MESSAGES } from './messages'

export interface UseI18nResult {
  locale: Ref<Locale>
  setLocale: (next: Locale) => void
  t: (key: string) => string
}

export function detectLocale(): Locale {
  const candidates = typeof navigator === 'undefined' ? [] : [...navigator.languages]
  return resolveInitialLocale(candidates)
}

const locale = ref<Locale>(detectLocale())

export function useI18n(): UseI18nResult {
  function setLocale(next: Locale): void {
    locale.value = next
  }

  function t(key: string): string {
    return MESSAGES[locale.value][key] ?? key
  }

  return { locale, setLocale, t }
}
