import { describe, it, expectTypeOf } from 'vitest'
import type {
  Granularity,
  ReservationStatus,
  CheckInState,
  AvailableDesk,
  DeskSearchResults,
  DeskSearchParams,
  ReserveDeskRequest,
  Reservation,
  MyReservations,
  ReservationSummary,
  CancelResult,
} from '@/types/booking'
import type { components as Uc004 } from '@/types/contracts/uc-004'
import type { components as Uc005 } from '@/types/contracts/uc-005'
import type { components as Uc006 } from '@/types/contracts/uc-006'
import type { components as Uc007 } from '@/types/contracts/uc-007'
import type { FieldError, ApiErrorBody, ApiErrorDetail } from '@/types/errors'

describe('booking domain types', () => {
  it('binds the granularity union to the consumed contract', () => {
    expectTypeOf<Granularity>().toEqualTypeOf<'FULL_DAY' | 'MORNING' | 'AFTERNOON'>()
  })

  it('binds reservation lifecycle enums to the contract', () => {
    expectTypeOf<ReservationStatus>().toEqualTypeOf<'active' | 'cancelled' | 'no_show'>()
    expectTypeOf<CheckInState>().toEqualTypeOf<'not_checked_in' | 'checked_in'>()
  })

  it('aliases the search contract schemas', () => {
    expectTypeOf<AvailableDesk>().toEqualTypeOf<Uc005['schemas']['AvailableDesk']>()
    expectTypeOf<DeskSearchResults>().toEqualTypeOf<Uc005['schemas']['DeskSearchResults']>()
  })

  it('models the search params with a required date and granularity plus optional tags', () => {
    expectTypeOf<DeskSearchParams['date']>().toEqualTypeOf<string>()
    expectTypeOf<DeskSearchParams['granularity']>().toEqualTypeOf<Granularity>()
    expectTypeOf<DeskSearchParams['tags']>().toEqualTypeOf<string[] | undefined>()
  })

  it('aliases the reserve request and reservation schemas', () => {
    expectTypeOf<ReserveDeskRequest>().toEqualTypeOf<Uc004['schemas']['ReserveDeskRequest']>()
    expectTypeOf<Reservation>().toEqualTypeOf<Uc004['schemas']['Reservation']>()
  })

  it('aliases the list and cancel contract schemas', () => {
    expectTypeOf<MyReservations>().toEqualTypeOf<Uc006['schemas']['MyReservations']>()
    expectTypeOf<ReservationSummary>().toEqualTypeOf<Uc006['schemas']['ReservationSummary']>()
    expectTypeOf<CancelResult>().toEqualTypeOf<Uc007['schemas']['CancelResult']>()
  })
})

describe('api error types', () => {
  it('exposes a field error with a user-facing reason', () => {
    expectTypeOf<FieldError>().toEqualTypeOf<{ field: string; reason: string }>()
  })

  it('binds the api error body to the contract error schema', () => {
    expectTypeOf<ApiErrorBody>().toEqualTypeOf<Uc004['schemas']['Error']>()
  })

  it('binds the field-level detail to the contract detail item shape', () => {
    expectTypeOf<ApiErrorDetail>().toEqualTypeOf<{
      field: string
      rule: string
      message: string
    }>()
  })
})
