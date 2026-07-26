import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { useCheckInReservation } from '@/composables/use-check-in-reservation'
import type { CheckInResult } from '@/types/booking'

vi.mock('@/api/booking', () => ({ checkInToReservation: vi.fn() }))
import { checkInToReservation } from '@/api/booking'

const checkInMock = vi.mocked(checkInToReservation)

const CHECK_IN_RESULT: CheckInResult = {
  id: 'r1',
  deskId: 'desk-2b-014',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  status: 'active',
  checkInState: 'checked_in',
  checkedInAt: '2026-07-27T08:45:00+02:00',
  alreadyCheckedIn: false,
}

beforeEach(() => {
  checkInMock.mockReset()
})

describe('useCheckInReservation', () => {
  it('checks in by id and invalidates the reservations query', async () => {
    checkInMock.mockResolvedValue(CHECK_IN_RESULT)
    const { result, queryClient } = mountComposable(() => useCheckInReservation())
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    const data = await result.mutateAsync('r1')
    await flushPromises()

    expect(checkInMock.mock.calls[0]?.[0]).toBe('r1')
    expect(data).toEqual(CHECK_IN_RESULT)
    expect(result.isSuccess.value).toBe(true)
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['reservations'] })
    expect(invalidate).not.toHaveBeenCalledWith({ queryKey: ['desks'] })
  })

  it('passes through an idempotent re-check-in result preserving the original time', async () => {
    checkInMock.mockResolvedValue({
      ...CHECK_IN_RESULT,
      checkedInAt: '2026-07-27T08:50:00+02:00',
      alreadyCheckedIn: true,
    })
    const { result } = mountComposable(() => useCheckInReservation())

    const data = await result.mutateAsync('r1')

    expect(data.alreadyCheckedIn).toBe(true)
    expect(data.checkedInAt).toBe('2026-07-27T08:50:00+02:00')
  })

  it('surfaces an ApiClientError to the caller', async () => {
    checkInMock.mockRejectedValue(
      new ApiClientError(422, { code: 'CHECK_IN_WINDOW_EXPIRED', message: 'expired' }),
    )
    const { result } = mountComposable(() => useCheckInReservation())

    await expect(result.mutateAsync('r1')).rejects.toBeInstanceOf(ApiClientError)
  })
})
