import { apiClient } from './client'
import type {
  DeskSearchParams,
  DeskSearchResults,
  ReserveDeskRequest,
  Reservation,
  MyReservations,
  CancelResult,
  CheckInResult,
  RoomSearchParams,
  RoomSearchResults,
  ReserveRoomRequest,
  RoomReservation,
} from '@/types/booking'

export function searchAvailableDesks(params: DeskSearchParams): Promise<DeskSearchResults> {
  const query = new URLSearchParams()
  query.set('date', params.date)
  query.set('granularity', params.granularity)
  for (const tag of params.tags ?? []) {
    query.append('tags', tag)
  }
  return apiClient<DeskSearchResults>(`/desks?${query.toString()}`)
}

export function reserveDesk(body: ReserveDeskRequest): Promise<Reservation> {
  return apiClient<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listMyReservations(): Promise<MyReservations> {
  return apiClient<MyReservations>('/reservations')
}

export function cancelReservation(reservationId: string): Promise<CancelResult> {
  return apiClient<CancelResult>(`/reservations/${encodeURIComponent(reservationId)}/cancel`, {
    method: 'POST',
  })
}

export function checkInToReservation(reservationId: string): Promise<CheckInResult> {
  return apiClient<CheckInResult>(`/reservations/${encodeURIComponent(reservationId)}/check-in`, {
    method: 'POST',
  })
}

export function searchAvailableRooms(params: RoomSearchParams): Promise<RoomSearchResults> {
  const query = new URLSearchParams()
  query.set('date', params.date)
  query.set('startTime', params.startTime)
  query.set('endTime', params.endTime)
  if (params.minCapacity !== undefined) {
    query.set('minCapacity', String(params.minCapacity))
  }
  for (const tag of params.tags ?? []) {
    query.append('tags', tag)
  }
  return apiClient<RoomSearchResults>(`/rooms?${query.toString()}`)
}

export function reserveRoom(roomId: string, body: ReserveRoomRequest): Promise<RoomReservation> {
  return apiClient<RoomReservation>(`/rooms/${encodeURIComponent(roomId)}/reservations`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
