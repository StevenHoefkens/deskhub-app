import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import RoomFinder from './room-finder.vue'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import type { RoomSearchResults, RoomReservation } from '@/types/booking'

vi.mock('@/api/booking', () => ({ searchAvailableRooms: vi.fn(), reserveRoom: vi.fn() }))
import { searchAvailableRooms, reserveRoom } from '@/api/booking'

const searchMock = vi.mocked(searchAvailableRooms)
const reserveMock = vi.mocked(reserveRoom)

const ONE_ROOM: RoomSearchResults = {
  date: '2026-07-27',
  startTime: '10:00',
  endTime: '11:00',
  rooms: [{ roomId: 'room-3-201', floor: '3', maxCapacity: 8, tags: ['beamer'] }],
}

const RESERVATION = { id: 'r1', roomId: 'room-3-201' } as unknown as RoomReservation

function mountFinder(): VueWrapper {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return mount(RoomFinder, { global: { plugins: [[VueQueryPlugin, { queryClient }]] } })
}

async function runValidSearch(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('#room-search-date').setValue('2026-07-27')
  await wrapper.get('#room-search-start').setValue('10:00')
  await wrapper.get('#room-search-end').setValue('11:00')
  await wrapper.get('form').trigger('submit')
  await flushPromises()
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 6, 26))
  searchMock.mockReset()
  reserveMock.mockReset()
  useI18n().setLocale('en')
  useToast().clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('RoomFinder', () => {
  it('blocks an invalid search with an inline error and a toast, without calling the api', async () => {
    const wrapper = mountFinder()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(searchMock).not.toHaveBeenCalled()
    expect(wrapper.findAll('[role="alert"]').length).toBeGreaterThan(0)
    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'error' &&
          toast.message ===
            'Check the date and time — the range must be in the future and on 15-minute steps.',
      ),
    ).toBe(true)
  })

  it('runs a valid search and renders the available rooms', async () => {
    searchMock.mockResolvedValue(ONE_ROOM)
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    expect(searchMock).toHaveBeenCalledWith({
      date: '2026-07-27',
      startTime: '10:00',
      endTime: '11:00',
    })
    expect(wrapper.get('.room-card__label').text()).toBe('room-3-201')
  })

  it('shows the empty notice when the search returns no rooms', async () => {
    searchMock.mockResolvedValue({ ...ONE_ROOM, rooms: [] })
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    expect(wrapper.text()).toContain('No rooms match your search.')
  })

  it('reserves a room with the submitted slot range and raises a success toast', async () => {
    searchMock.mockResolvedValue(ONE_ROOM)
    reserveMock.mockResolvedValue(RESERVATION)
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    await wrapper.get('.room-card__reserve').trigger('click')
    await flushPromises()

    expect(reserveMock).toHaveBeenCalledWith('room-3-201', {
      date: '2026-07-27',
      startTime: '10:00',
      endTime: '11:00',
    })
    expect(
      useToast().toasts.value.some(
        (toast) => toast.variant === 'success' && toast.message === 'Room booked.',
      ),
    ).toBe(true)
  })

  it('raises an error toast and refreshes when a reservation is refused', async () => {
    searchMock.mockResolvedValue(ONE_ROOM)
    reserveMock.mockRejectedValue(new Error('conflict'))
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    await wrapper.get('.room-card__reserve').trigger('click')
    await flushPromises()

    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'error' &&
          toast.message === 'Those slots are no longer available. Please pick another time or room.',
      ),
    ).toBe(true)
    expect(searchMock).toHaveBeenCalledTimes(2)
  })
})
