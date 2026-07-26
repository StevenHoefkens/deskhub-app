import { ref, type Ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reserveRoom } from '@/api/booking'
import { ApiClientError } from '@/api/client'
import { extractErrorInfo } from '@/composables/use-reserve-desk'
import { ROOMS_QUERY_KEY, RESERVATIONS_QUERY_KEY } from '@/api/query-keys'
import type { ReserveRoomRequest, RoomReservation } from '@/types/booking'
import type { FieldError } from '@/types/errors'

export interface ReserveRoomVariables {
  roomId: string
  body: ReserveRoomRequest
}

export interface UseReserveRoomResult {
  mutate: (variables: ReserveRoomVariables) => void
  mutateAsync: (variables: ReserveRoomVariables) => Promise<RoomReservation>
  isPending: Ref<boolean>
  isSuccess: Ref<boolean>
  data: Ref<RoomReservation | undefined>
  fieldErrors: Ref<FieldError[]>
  reset: () => void
}

export function useReserveRoom(): UseReserveRoomResult {
  const queryClient = useQueryClient()
  const fieldErrors = ref<FieldError[]>([])

  const mutation = useMutation({
    mutationFn: ({ roomId, body }: ReserveRoomVariables) => reserveRoom(roomId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOMS_QUERY_KEY] })
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
