import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { useCancelReservation } from '@/composables/use-cancel-reservation'
import type { CancelResult } from '@/types/booking'

vi.mock('@/api/booking', () => ({ cancelReservation: vi.fn() }))
import { cancelReservation } from '@/api/booking'

const cancelMock = vi.mocked(cancelReservation)

const CANCEL_RESULT: CancelResult = {
  id: 'r1',
  status: 'cancelled',
  resourceType: 'desk',
  deskId: 'desk-2b-014',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
}

beforeEach(() => {
  cancelMock.mockReset()
})

describe('useCancelReservation', () => {
  it('cancels by id and invalidates the reservations and desks queries', async () => {
    cancelMock.mockResolvedValue(CANCEL_RESULT)
    const { result, queryClient } = mountComposable(() => useCancelReservation())
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    const data = await result.mutateAsync('r1')
    await flushPromises()

    expect(cancelMock.mock.calls[0]?.[0]).toBe('r1')
    expect(data).toEqual(CANCEL_RESULT)
    expect(result.isSuccess.value).toBe(true)
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['reservations'] })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['desks'] })
  })

  it('surfaces an ApiClientError to the caller', async () => {
    cancelMock.mockRejectedValue(
      new ApiClientError(409, { code: 'RESERVATION_ALREADY_ENDED', message: 'ended' }),
    )
    const { result } = mountComposable(() => useCancelReservation())

    await expect(result.mutateAsync('r1')).rejects.toBeInstanceOf(ApiClientError)
  })
})
