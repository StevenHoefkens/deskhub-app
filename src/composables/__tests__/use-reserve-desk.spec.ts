import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { extractErrorInfo, useReserveDesk } from '@/composables/use-reserve-desk'
import type { Reservation } from '@/types/booking'

vi.mock('@/api/booking', () => ({ reserveDesk: vi.fn() }))
import { reserveDesk } from '@/api/booking'

const reserveMock = vi.mocked(reserveDesk)

const RESERVATION = { id: 'r1', deskId: 'd1' } as unknown as Reservation

beforeEach(() => {
  reserveMock.mockReset()
})

describe('extractErrorInfo', () => {
  it('maps contract error details to field errors using the human message', () => {
    const error = new ApiClientError(400, {
      code: 'INVALID_DATE',
      message: 'bad',
      details: [{ field: 'date', rule: 'horizon', message: 'Date must be within the next 30 days.' }],
    })
    expect(extractErrorInfo(error)).toEqual([
      { field: 'date', reason: 'Date must be within the next 30 days.' },
    ])
  })

  it('returns an empty list when the error carries no details', () => {
    const error = new ApiClientError(409, { code: 'DESK_NOT_AVAILABLE', message: 'gone' })
    expect(extractErrorInfo(error)).toEqual([])
  })
})

describe('useReserveDesk', () => {
  it('resolves, marks success, and invalidates desks and reservations', async () => {
    reserveMock.mockResolvedValue(RESERVATION)
    const { result, queryClient } = mountComposable(() => useReserveDesk())
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    await result.mutateAsync({ deskId: 'd1', date: '2026-07-27', granularity: 'FULL_DAY' })
    await flushPromises()

    expect(result.isSuccess.value).toBe(true)
    expect(result.data.value).toEqual(RESERVATION)
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['desks'] })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['reservations'] })
  })

  it('populates fieldErrors from an ApiClientError on failure', async () => {
    reserveMock.mockRejectedValue(
      new ApiClientError(400, {
        code: 'INVALID_DATE',
        message: 'bad',
        details: [{ field: 'date', rule: 'horizon', message: 'too far' }],
      }),
    )
    const { result } = mountComposable(() => useReserveDesk())

    await expect(
      result.mutateAsync({ deskId: 'd1', date: '2026-09-01', granularity: 'FULL_DAY' }),
    ).rejects.toBeInstanceOf(ApiClientError)
    await flushPromises()

    expect(result.fieldErrors.value).toEqual([{ field: 'date', reason: 'too far' }])
  })

  it('clears data and field errors on reset', async () => {
    reserveMock.mockResolvedValue(RESERVATION)
    const { result } = mountComposable(() => useReserveDesk())
    await result.mutateAsync({ deskId: 'd1', date: '2026-07-27', granularity: 'FULL_DAY' })
    await flushPromises()

    result.reset()
    await flushPromises()

    expect(result.data.value).toBeUndefined()
    expect(result.fieldErrors.value).toEqual([])
  })
})
