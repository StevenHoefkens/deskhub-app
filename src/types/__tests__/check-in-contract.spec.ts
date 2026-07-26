import { describe, it, expectTypeOf } from 'vitest'
import type { components, paths } from '@/types/contracts/uc-012'
import type { CheckInResult, Granularity } from '@/types/booking'

type ContractCheckInResult = components['schemas']['CheckInResult']
type CheckInOp = paths['/reservations/{reservationId}/check-in']['post']

describe('generated check-in (UC-012) contract types', () => {
  it('re-exports CheckInResult from the domain barrel bound to the contract schema', () => {
    expectTypeOf<CheckInResult>().toEqualTypeOf<ContractCheckInResult>()
  })

  it('exposes the CheckInResult fields with their contract types', () => {
    expectTypeOf<CheckInResult['id']>().toEqualTypeOf<string>()
    expectTypeOf<CheckInResult['deskId']>().toEqualTypeOf<string>()
    expectTypeOf<CheckInResult['date']>().toEqualTypeOf<string>()
    expectTypeOf<CheckInResult['granularity']>().toEqualTypeOf<Granularity>()
    expectTypeOf<CheckInResult['status']>().toEqualTypeOf<'active'>()
    expectTypeOf<CheckInResult['checkInState']>().toEqualTypeOf<'checked_in'>()
    expectTypeOf<CheckInResult['checkedInAt']>().toEqualTypeOf<string>()
    expectTypeOf<CheckInResult['alreadyCheckedIn']>().toEqualTypeOf<boolean>()
  })

  it('exposes the check-in operation in the typed paths map', () => {
    expectTypeOf<CheckInOp>().not.toBeNever()
  })
})
