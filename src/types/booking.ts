import type { components as Uc004 } from '@/types/contracts/uc-004'
import type {
  components as Uc005,
  operations as Uc005Operations,
} from '@/types/contracts/uc-005'
import type { components as Uc006 } from '@/types/contracts/uc-006'
import type { components as Uc007 } from '@/types/contracts/uc-007'

export type Granularity = Uc004['schemas']['Granularity']
export type ReservationStatus = Uc004['schemas']['Reservation']['status']
export type CheckInState = Uc004['schemas']['Reservation']['checkInState']

export type AvailableDesk = Uc005['schemas']['AvailableDesk']
export type DeskSearchResults = Uc005['schemas']['DeskSearchResults']
export type DeskSearchParams = NonNullable<
  Uc005Operations['searchAvailableDesks']['parameters']['query']
>

export type ReserveDeskRequest = Uc004['schemas']['ReserveDeskRequest']
export type Reservation = Uc004['schemas']['Reservation']

export type MyReservations = Uc006['schemas']['MyReservations']
export type ReservationSummary = Uc006['schemas']['ReservationSummary']

export type CancelResult = Uc007['schemas']['CancelResult']
