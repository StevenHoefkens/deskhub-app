import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import {
  useMyReservations,
  getMyReservationsErrorMessage,
} from '@/composables/use-my-reservations'
import type { MyReservations } from '@/types/booking'

vi.mock('@/api/booking', () => ({ listMyReservations: vi.fn() }))
import { listMyReservations } from '@/api/booking'

const listMock = vi.mocked(listMyReservations)

const RESULT: MyReservations = { reservations: [] }

beforeEach(() => {
  listMock.mockReset()
})

describe('useMyReservations', () => {
  it('fetches the caller reservations on mount', async () => {
    listMock.mockResolvedValue(RESULT)
    const { result } = mountComposable(() => useMyReservations())
    await flushPromises()

    expect(listMock).toHaveBeenCalledOnce()
    expect(result.data.value).toEqual(RESULT)
  })
})

describe('getMyReservationsErrorMessage', () => {
  it('returns the api error message when present', () => {
    const error = new ApiClientError(401, { code: 'SESSION_EXPIRED', message: 'Your session has expired.' })
    expect(getMyReservationsErrorMessage(error)).toBe('Your session has expired.')
  })

  it('returns a generic fallback for a null or unknown error', () => {
    expect(getMyReservationsErrorMessage(null)).toBe('We could not load your reservations. Please try again.')
    expect(getMyReservationsErrorMessage(new Error('boom'))).toBe(
      'We could not load your reservations. Please try again.',
    )
  })
})
