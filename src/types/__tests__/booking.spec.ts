import { describe, it, expectTypeOf } from 'vitest'
import type {
  Granularity,
  ReservationStatus,
  CheckInState,
  ResourceType,
  AvailableDesk,
  DeskSearchResults,
  DeskSearchParams,
  ReserveDeskRequest,
  Reservation,
  MyReservations,
  ReservationSummary,
  CancelResult,
  AvailableRoom,
  RoomSearchResults,
  RoomSearchParams,
  ReserveRoomRequest,
  RoomReservation,
} from '@/types/booking'
import type { components as Uc004 } from '@/types/contracts/uc-004'
import type { components as Uc005 } from '@/types/contracts/uc-005'
import type { components as Uc006 } from '@/types/contracts/uc-006'
import type { components as Uc007 } from '@/types/contracts/uc-007'
import type { components as Uc010 } from '@/types/contracts/uc-010'
import type { components as Uc011 } from '@/types/contracts/uc-011'
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

  it('binds the resource-type discriminator to the reservation summary contract', () => {
    expectTypeOf<ResourceType>().toEqualTypeOf<'desk' | 'room'>()
    expectTypeOf<ReservationSummary['resourceType']>().toEqualTypeOf<ResourceType>()
  })

  it('models desk-only summary fields as optional (absent on room rows)', () => {
    expectTypeOf<ReservationSummary['granularity']>().toEqualTypeOf<Granularity | undefined>()
    expectTypeOf<ReservationSummary['checkInState']>().toEqualTypeOf<CheckInState | undefined>()
  })

  it('exposes room-only summary fields for room rows', () => {
    expectTypeOf<ReservationSummary['roomId']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ReservationSummary['startsAt']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ReservationSummary['endsAt']>().toEqualTypeOf<string | undefined>()
  })
})

describe('room booking domain types', () => {
  it('aliases the room search contract schemas', () => {
    expectTypeOf<AvailableRoom>().toEqualTypeOf<Uc010['schemas']['AvailableRoom']>()
    expectTypeOf<RoomSearchResults>().toEqualTypeOf<Uc010['schemas']['RoomSearchResults']>()
  })

  it('models the room search params with a required date and slot range plus optional filters', () => {
    expectTypeOf<RoomSearchParams['date']>().toEqualTypeOf<string>()
    expectTypeOf<RoomSearchParams['startTime']>().toEqualTypeOf<string>()
    expectTypeOf<RoomSearchParams['endTime']>().toEqualTypeOf<string>()
    expectTypeOf<RoomSearchParams['minCapacity']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<RoomSearchParams['tags']>().toEqualTypeOf<string[] | undefined>()
  })

  it('exposes the available room presentation fields', () => {
    expectTypeOf<AvailableRoom['roomId']>().toEqualTypeOf<string>()
    expectTypeOf<AvailableRoom['floor']>().toEqualTypeOf<string>()
    expectTypeOf<AvailableRoom['maxCapacity']>().toEqualTypeOf<number>()
    expectTypeOf<AvailableRoom['tags']>().toEqualTypeOf<string[]>()
  })

  it('aliases the reserve-room request and room reservation schemas', () => {
    expectTypeOf<ReserveRoomRequest>().toEqualTypeOf<Uc011['schemas']['ReserveRoomRequest']>()
    expectTypeOf<RoomReservation>().toEqualTypeOf<Uc011['schemas']['RoomReservation']>()
  })

  it('models the reserve-room request as a bare date and slot range', () => {
    expectTypeOf<ReserveRoomRequest['date']>().toEqualTypeOf<string>()
    expectTypeOf<ReserveRoomRequest['startTime']>().toEqualTypeOf<string>()
    expectTypeOf<ReserveRoomRequest['endTime']>().toEqualTypeOf<string>()
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
