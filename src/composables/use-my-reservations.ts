import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { listMyReservations } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { RESERVATIONS_QUERY_KEY, DEFAULT_STALE_TIME_MS } from '@/api/query-keys'

const LIST_ERROR_FALLBACK = 'We could not load your reservations. Please try again.'

export function useMyReservations() {
  return useQuery({
    queryKey: [...RESERVATIONS_QUERY_KEY],
    queryFn: listMyReservations,
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME_MS,
  })
}

export function getMyReservationsErrorMessage(error: Error | null): string {
  if (error instanceof ApiClientError && error.body?.message) {
    return error.body.message
  }
  return LIST_ERROR_FALLBACK
}
