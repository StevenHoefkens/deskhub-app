import { describe, it, expect } from 'vitest'
import {
  resolveLoginErrorState,
  loginErrorMessageKey,
  isRetryableLoginError,
} from '@/lib/login-error'

describe('resolveLoginErrorState', () => {
  it('maps the invalid-response contract code to access_denied', () => {
    expect(resolveLoginErrorState('AUTH_RESPONSE_INVALID')).toBe('access_denied')
  })

  it('maps the missing-identifier contract code to missing_identifier', () => {
    expect(resolveLoginErrorState('PROVISIONING_MISSING_IDENTIFIER')).toBe('missing_identifier')
  })

  it('passes through every canonical login-error state name', () => {
    expect(resolveLoginErrorState('idp_unreachable')).toBe('idp_unreachable')
    expect(resolveLoginErrorState('access_denied')).toBe('access_denied')
    expect(resolveLoginErrorState('missing_identifier')).toBe('missing_identifier')
  })

  it('returns null for an unknown code', () => {
    expect(resolveLoginErrorState('SOMETHING_ELSE')).toBeNull()
  })

  it('returns null for inherited Object.prototype keys from untrusted input', () => {
    expect(resolveLoginErrorState('toString')).toBeNull()
    expect(resolveLoginErrorState('constructor')).toBeNull()
    expect(resolveLoginErrorState('hasOwnProperty')).toBeNull()
  })

  it('returns null when no error is present', () => {
    expect(resolveLoginErrorState(null)).toBeNull()
    expect(resolveLoginErrorState(undefined)).toBeNull()
  })
})

describe('loginErrorMessageKey', () => {
  it('derives a stable message key per state', () => {
    expect(loginErrorMessageKey('access_denied')).toBe('login.error.access_denied')
    expect(loginErrorMessageKey('idp_unreachable')).toBe('login.error.idp_unreachable')
    expect(loginErrorMessageKey('missing_identifier')).toBe('login.error.missing_identifier')
  })
})

describe('isRetryableLoginError', () => {
  it('is retryable only when the identity provider was unreachable', () => {
    expect(isRetryableLoginError('idp_unreachable')).toBe(true)
    expect(isRetryableLoginError('access_denied')).toBe(false)
    expect(isRetryableLoginError('missing_identifier')).toBe(false)
  })
})
