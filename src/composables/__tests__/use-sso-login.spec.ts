import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSsoLogin } from '@/composables/use-sso-login'
import { SSO_LOGIN_PATH, HOME_PATH } from '@/config/auth'

const originalLocation = window.location
let assign: ReturnType<typeof vi.fn>

beforeEach(() => {
  assign = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { assign },
  })
})

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  })
})

describe('useSsoLogin', () => {
  it('redirects to the SSO login path carrying an encoded return URL', () => {
    const { signIn } = useSsoLogin()

    signIn('/desks?date=2026-07-27')

    expect(assign).toHaveBeenCalledWith(
      `${SSO_LOGIN_PATH}?returnUrl=${encodeURIComponent('/desks?date=2026-07-27')}`,
    )
  })

  it('defaults the return URL to home when none is given', () => {
    const { signIn } = useSsoLogin()

    signIn()

    expect(assign).toHaveBeenCalledWith(
      `${SSO_LOGIN_PATH}?returnUrl=${encodeURIComponent(HOME_PATH)}`,
    )
  })

  it.each(['//evil.com', 'https://evil.com', 'javascript:alert(1)', '/\\evil.com', 'desks'])(
    'refuses to forward a non-internal return URL (%s) and falls back to home',
    (hostile) => {
      const { signIn } = useSsoLogin()

      signIn(hostile)

      expect(assign).toHaveBeenCalledWith(
        `${SSO_LOGIN_PATH}?returnUrl=${encodeURIComponent(HOME_PATH)}`,
      )
    },
  )
})
