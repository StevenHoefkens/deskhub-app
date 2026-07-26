import { ref, type Ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reserveDesk } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { DESKS_QUERY_KEY, RESERVATIONS_QUERY_KEY } from '@/api/query-keys'
import type { Reservation, ReserveDeskRequest } from '@/types/booking'
import type { FieldError } from '@/types/errors'

export interface UseReserveDeskResult {
  mutate: (variables: ReserveDeskRequest) => void
  mutateAsync: (variables: ReserveDeskRequest) => Promise<Reservation>
  isPending: Ref<boolean>
  isSuccess: Ref<boolean>
  data: Ref<Reservation | undefined>
  fieldErrors: Ref<FieldError[]>
  reset: () => void
}

export function extractErrorInfo(error: ApiClientError): FieldError[] {
  return (error.body?.details ?? []).map((detail) => ({
    field: detail.field,
    reason: detail.message,
  }))
}

export function useReserveDesk(): UseReserveDeskResult {
  const queryClient = useQueryClient()
  const fieldErrors = ref<FieldError[]>([])

  const mutation = useMutation({
    mutationFn: reserveDesk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DESKS_QUERY_KEY] })
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
