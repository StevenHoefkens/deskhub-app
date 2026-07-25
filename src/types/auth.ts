export const SUPPORTED_LOCALES = ['en', 'nl'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOGIN_ERROR_STATES = ['idp_unreachable', 'access_denied', 'missing_identifier'] as const

export type LoginErrorState = (typeof LOGIN_ERROR_STATES)[number]
