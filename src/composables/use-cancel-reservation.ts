import { ref, type Ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { cancelReservation } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { extractErrorInfo } from '@/composables/use-reserve-desk'
import { DESKS_QUERY_KEY, RESERVATIONS_QUERY_KEY } from '@/api/query-keys'
import type { CancelResult } from '@/types/booking'
import type { FieldError } from '@/types/errors'

export interface UseCancelReservationResult {
  mutate: (reservationId: string) => void
  mutateAsync: (reservationId: string) => Promise<CancelResult>
  isPending: Ref<boolean>
  isSuccess: Ref<boolean>
  data: Ref<CancelResult | undefined>
  fieldErrors: Ref<FieldError[]>
  reset: () => void
}

export function useCancelReservation(): UseCancelReservationResult {
  const queryClient = useQueryClient()
  const fieldErrors = ref<FieldError[]>([])

  const mutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...RESERVATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [...DESKS_QUERY_KEY] })
      fieldErrors.value = []
    },
    onError: (error) => {
      fieldErrors.value = error instanceof ApiClientError ? extractErrorInfo(error) : []
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    fieldErrors,
    reset: () => {
      mutation.reset()
      fieldErrors.value = []
    },
  }
}
