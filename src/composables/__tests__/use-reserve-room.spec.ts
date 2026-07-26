import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { useReserveRoom } from '@/composables/use-reserve-room'
import type { RoomReservation } from '@/types/booking'

vi.mock('@/api/booking', () => ({ reserveRoom: vi.fn() }))
import { reserveRoom } from '@/api/booking'

const reserveMock = vi.mocked(reserveRoom)

const RESERVATION = { id: 'r1', roomId: 'room-3-201' } as unknown as RoomReservation

const VARIABLES = {
  roomId: 'room-3-201',
  body: { date: '2026-07-27', startTime: '10:00', endTime: '11:00' },
}

beforeEach(() => {
  reserveMock.mockReset()
})

describe('useReserveRoom', () => {
  it('calls the api with the room id and body, and invalidates rooms and reservations', async () => {
    reserveMock.mockResolvedValue(RESERVATION)
    const { result, queryClient } = mountComposable(() => useReserveRoom())
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync(VARIABLES)
    await flushPromises()

    expect(reserveMock).toHaveBeenCalledWith('room-3-201', VARIABLES.body)
    expect(result.isSuccess.value).toBe(true)
    expect(result.data.value).toEqual(RESERVATION)
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['rooms'] })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['reservations'] })
  })

  it('populates fieldErrors from an ApiClientError on failure', async () => {
    reserveMock.mockRejectedValue(
      new ApiClientError(400, {
        code: 'INVALID_SLOT_RANGE',
        message: 'bad',
        details: [{ field: 'endTime', rule: 'alignment', message: 'off grid' }],
      }),
    )
    const { result } = mountComposable(() => useReserveRoom())

    await expect(result.mutateAsync(VARIABLES)).rejects.toBeInstanceOf(ApiClientError)
    await flushPromises()

    expect(result.fieldErrors.value).toEqual([{ field: 'endTime', reason: 'off grid' }])
  })

  it('clears data and field errors on reset', async () => {
    reserveMock.mockResolvedValue(RESERVATION)
    const { result } = mountComposable(() => useReserveRoom())
    await result.mutateAsync(VARIABLES)
    await flushPromises()

    result.reset()
    await flushPromises()

    expect(result.data.value).toBeUndefined()
    expect(result.fieldErrors.value).toEqual([])
  })
})
