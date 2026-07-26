import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { searchAvailableRooms } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { ROOMS_QUERY_KEY, DEFAULT_STALE_TIME_MS } from '@/api/query-keys'
import type { RoomSearchParams } from '@/types/booking'

const SEARCH_ERROR_FALLBACK = 'We could not search for rooms. Please try again.'

export function useRoomSearch(params: MaybeRefOrGetter<RoomSearchParams | null>) {
  const currentParams = computed(() => toValue(params))
  return useQuery({
    queryKey: [...ROOMS_QUERY_KEY, currentParams],
    queryFn: () => {
      const active = currentParams.value
      if (active === null) {
        throw new Error('Search parameters are required')
      }
      return searchAvailableRooms(active)
    },
    enabled: computed(() => currentParams.value !== null),
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME_MS,
  })
}

export function getRoomSearchErrorMessage(error: Error | null): string {
  if (error instanceof ApiClientError && error.body?.message) {
    return error.body.message
  }
  return SEARCH_ERROR_FALLBACK
}
