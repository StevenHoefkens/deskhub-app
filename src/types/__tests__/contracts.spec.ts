import { describe, it, expectTypeOf } from 'vitest'
import type { components, paths } from '@/types/contracts/uc-001'
import type { Locale } from '@/types/auth'

type AuthenticatedSession = components['schemas']['AuthenticatedSession']
type CallbackOp = paths['/auth/sso/callback']['post']

describe('generated SSO contract types', () => {
  it('exposes the AuthenticatedSession schema with the contract fields', () => {
    expectTypeOf<AuthenticatedSession['userId']>().toEqualTypeOf<string>()
    expectTypeOf<AuthenticatedSession['firstLogin']>().toEqualTypeOf<boolean>()
    expectTypeOf<AuthenticatedSession['hasBookableAccess']>().toEqualTypeOf<boolean>()
    expectTypeOf<AuthenticatedSession['returnUrl']>().toEqualTypeOf<string>()
    expectTypeOf<AuthenticatedSession['languagePreference']>().toEqualTypeOf<'en' | 'nl'>()
  })

  it('models the nullable ssoRole as optional string or null', () => {
    expectTypeOf<AuthenticatedSession['ssoRole']>().toEqualTypeOf<string | null | undefined>()
  })

  it('exposes the SSO callback operation in the typed paths map', () => {
    expectTypeOf<CallbackOp>().not.toBeNever()
  })

  it('binds the domain Locale type to the contract languagePreference enum', () => {
    expectTypeOf<Locale>().toEqualTypeOf<AuthenticatedSession['languagePreference']>()
  })
})
