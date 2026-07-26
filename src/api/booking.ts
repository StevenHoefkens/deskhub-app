import { apiClient } from './client'
import type {
  DeskSearchParams,
  DeskSearchResults,
  ReserveDeskRequest,
  Reservation,
  MyReservations,
  CancelResult,
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
