import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { useRoomSearch, getRoomSearchErrorMessage } from '@/composables/use-room-search'
import type { RoomSearchParams, RoomSearchResults } from '@/types/booking'

vi.mock('@/api/booking', () => ({ searchAvailableRooms: vi.fn() }))
import { searchAvailableRooms } from '@/api/booking'

const searchMock = vi.mocked(searchAvailableRooms)

const RESULTS: RoomSearchResults = {
  date: '2026-07-27',
  startTime: '10:00',
  endTime: '11:00',
  rooms: [],
}

const PARAMS: RoomSearchParams = { date: '2026-07-27', startTime: '10:00', endTime: '11:00' }

beforeEach(() => {
  searchMock.mockReset()
})

describe('useRoomSearch', () => {
  it('does not fetch while the params are null', async () => {
    const params = ref<RoomSearchParams | null>(null)
    mountComposable(() => useRoomSearch(() => params.value))
    await flushPromises()

    expect(searchMock).not.toHaveBeenCalled()
  })

  it('fetches once params are provided', async () => {
    searchMock.mockResolvedValue(RESULTS)
    const params = ref<RoomSearchParams | null>(null)
    const { result } = mountComposable(() => useRoomSearch(() => params.value))

    params.value = PARAMS
    await flushPromises()

    expect(searchMock).toHaveBeenCalledWith(PARAMS)
    expect(result.data.value).toEqual(RESULTS)
  })
})

describe('getRoomSearchErrorMessage', () => {
  it('returns the api error message when present', () => {
    const error = new ApiClientError(400, {
      code: 'INVALID_SLOT_RANGE',
      message: 'Times must fall on 15-minute boundaries.',
    })
    expect(getRoomSearchErrorMessage(error)).toBe('Times must fall on 15-minute boundaries.')
  })

  it('returns a generic fallback otherwise', () => {
    expect(getRoomSearchErrorMessage(null)).toBe('We could not search for rooms. Please try again.')
  })
})
