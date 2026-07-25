import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { searchAvailableDesks } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { DESKS_QUERY_KEY, DEFAULT_STALE_TIME_MS } from '@/api/query-keys'
import type { DeskSearchParams } from '@/types/booking'

const SEARCH_ERROR_FALLBACK = 'We could not search for desks. Please try again.'

export function useDeskSearch(params: MaybeRefOrGetter<DeskSearchParams | null>) {
  const currentParams = computed(() => toValue(params))
  return useQuery({
    queryKey: [...DESKS_QUERY_KEY, currentParams],
    queryFn: () => {
      const active = currentParams.value
      if (active === null) {
        throw new Error('Search parameters are required')
      }
      return searchAvailableDesks(active)
    },
    enabled: computed(() => currentParams.value !== null),
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME_MS,
  })
}

export function getDeskSearchErrorMessage(error: Error | null): string {
  if (error instanceof ApiClientError && error.body?.message) {
    return error.body.message
  }
  return SEARCH_ERROR_FALLBACK
}
