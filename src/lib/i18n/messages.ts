import type { Locale } from '@/types/auth'

export const MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'DeskHub',
    'login.prompt': 'Sign in with your corporate account to continue.',
    'login.signIn.label': 'Sign in with SSO',
    'login.signIn.aria': 'Sign in with single sign-on',
    'login.locale.aria': 'Choose language',
    'login.retry.label': 'Try again',
    'login.retry.aria': 'Retry sign in',
    'login.error.idp_unreachable': "We couldn't reach your identity provider. Please try again.",
    'login.error.access_denied': 'We could not verify your sign-in. Please try again.',
    'login.error.missing_identifier':
      'We could not complete your sign-in. Please contact facility management.',
    'login.toast.error': 'We could not sign you in. Please try again.',
    'toast.dismiss': 'Dismiss',
  },
  nl: {
    'app.name': 'DeskHub',
    'login.prompt': 'Meld je aan met je bedrijfsaccount om verder te gaan.',
    'login.signIn.label': 'Aanmelden met SSO',
    'login.signIn.aria': 'Aanmelden met single sign-on',
    'login.locale.aria': 'Kies een taal',
    'login.retry.label': 'Opnieuw proberen',
    'login.retry.aria': 'Aanmelden opnieuw proberen',
    'login.error.idp_unreachable':
      'We konden je identiteitsprovider niet bereiken. Probeer het opnieuw.',
    'login.error.access_denied': 'We konden je aanmelding niet verifiëren. Probeer het opnieuw.',
    'login.error.missing_identifier':
      'We konden je aanmelding niet voltooien. Neem contact op met facilitair beheer.',
    'login.toast.error': 'We konden je niet aanmelden. Probeer het opnieuw.',
    'toast.dismiss': 'Sluiten',
  },
}
