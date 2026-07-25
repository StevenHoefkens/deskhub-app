import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from './query-test-utils'
import { ApiClientError } from '@/api/client'
import { useDeskSearch, getDeskSearchErrorMessage } from '@/composables/use-desk-search'
import type { DeskSearchParams, DeskSearchResults } from '@/types/booking'

vi.mock('@/api/booking', () => ({ searchAvailableDesks: vi.fn() }))
import { searchAvailableDesks } from '@/api/booking'

const searchMock = vi.mocked(searchAvailableDesks)

const RESULTS: DeskSearchResults = {
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  noBookingAccess: false,
  desks: [],
}

beforeEach(() => {
  searchMock.mockReset()
})

describe('useDeskSearch', () => {
  it('does not fetch while the params are null', async () => {
    const params = ref<DeskSearchParams | null>(null)
    mountComposable(() => useDeskSearch(() => params.value))
    await flushPromises()

    expect(searchMock).not.toHaveBeenCalled()
  })

  it('fetches once params are provided', async () => {
    searchMock.mockResolvedValue(RESULTS)
    const params = ref<DeskSearchParams | null>(null)
    const { result } = mountComposable(() => useDeskSearch(() => params.value))

    params.value = { date: '2026-07-27', granularity: 'FULL_DAY' }
    await flushPromises()

    expect(searchMock).toHaveBeenCalledWith({ date: '2026-07-27', granularity: 'FULL_DAY' })
    expect(result.data.value).toEqual(RESULTS)
  })
})

describe('getDeskSearchErrorMessage', () => {
  it('returns the api error message when present', () => {
    const error = new ApiClientError(400, { code: 'INVALID_DATE', message: 'Date must be within the next 30 days.' })
    expect(getDeskSearchErrorMessage(error)).toBe('Date must be within the next 30 days.')
  })

  it('returns a generic fallback otherwise', () => {
    expect(getDeskSearchErrorMessage(null)).toBe('We could not search for desks. Please try again.')
  })
})
