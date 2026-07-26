import { ref, type Ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { checkInToReservation } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { extractErrorInfo } from '@/composables/use-reserve-desk'
import { RESERVATIONS_QUERY_KEY } from '@/api/query-keys'
import type { CheckInResult } from '@/types/booking'
import type { FieldError } from '@/types/errors'

export interface UseCheckInReservationResult {
  mutate: (reservationId: string) => void
  mutateAsync: (reservationId: string) => Promise<CheckInResult>
  isPending: Ref<boolean>
  isSuccess: Ref<boolean>
  data: Ref<CheckInResult | undefined>
  fieldErrors: Ref<FieldError[]>
  reset: () => void
}

export function useCheckInReservation(): UseCheckInReservationResult {
  const queryClient = useQueryClient()
  const fieldErrors = ref<FieldError[]>([])

  const mutation = useMutation({
    mutationFn: checkInToReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...RESERVATIONS_QUERY_KEY] })
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
