import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import DeskFinder from './desk-finder.vue'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import type { DeskSearchResults, Reservation } from '@/types/booking'

vi.mock('@/api/booking', () => ({ searchAvailableDesks: vi.fn(), reserveDesk: vi.fn() }))
import { searchAvailableDesks, reserveDesk } from '@/api/booking'

const searchMock = vi.mocked(searchAvailableDesks)
const reserveMock = vi.mocked(reserveDesk)

const ONE_DESK: DeskSearchResults = {
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  noBookingAccess: false,
  desks: [{ deskId: 'desk-2b-014', zoneId: 'zone-2b', floor: '2', tags: ['standing'] }],
}

const RESERVATION = { id: 'r1', deskId: 'desk-2b-014' } as unknown as Reservation

function mountFinder(): VueWrapper {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return mount(DeskFinder, { global: { plugins: [[VueQueryPlugin, { queryClient }]] } })
}

async function runValidSearch(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('#desk-search-date').setValue('2026-07-27')
  await wrapper.get('#desk-search-when').setValue('FULL_DAY')
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

describe('DeskFinder', () => {
  it('blocks an invalid search with an inline error and a toast, without calling the api', async () => {
    const wrapper = mountFinder()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(searchMock).not.toHaveBeenCalled()
    expect(
      wrapper.findAll('[role="alert"]').some((alert) => alert.text() === 'Please choose a date.'),
    ).toBe(true)
    expect(useToast().toasts.value[0]?.message).toBe('Please choose a date within the next 30 days.')
  })

  it('runs a valid search and renders the available desks', async () => {
    searchMock.mockResolvedValue(ONE_DESK)
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    expect(searchMock).toHaveBeenCalledWith({ date: '2026-07-27', granularity: 'FULL_DAY' })
    expect(wrapper.get('.desk-card__label').text()).toBe('desk-2b-014')
  })

  it('shows the empty notice when the search returns no desks', async () => {
    searchMock.mockResolvedValue({ ...ONE_DESK, desks: [] })
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    expect(wrapper.text()).toContain('No desks match your search.')
  })

  it('shows the no-access notice when the employee cannot book', async () => {
    searchMock.mockResolvedValue({ ...ONE_DESK, desks: [], noBookingAccess: true })
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    expect(wrapper.text()).toContain('You have no desk-booking access.')
  })

  it('reserves a desk and raises a success toast', async () => {
    searchMock.mockResolvedValue(ONE_DESK)
    reserveMock.mockResolvedValue(RESERVATION)
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    await wrapper.get('.desk-card__reserve').trigger('click')
    await flushPromises()

    expect(reserveMock.mock.calls[0]?.[0]).toEqual({
      deskId: 'desk-2b-014',
      date: '2026-07-27',
      granularity: 'FULL_DAY',
    })
    expect(
      useToast().toasts.value.some(
        (toast) => toast.variant === 'success' && toast.message === 'Desk reserved.',
      ),
    ).toBe(true)
  })

  it('raises an error toast when a reservation is refused', async () => {
    searchMock.mockResolvedValue(ONE_DESK)
    reserveMock.mockRejectedValue(new Error('conflict'))
    const wrapper = mountFinder()
    await runValidSearch(wrapper)

    await wrapper.get('.desk-card__reserve').trigger('click')
    await flushPromises()

    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'error' &&
          toast.message === 'That desk is no longer available. Please pick another.',
      ),
    ).toBe(true)
    expect(searchMock).toHaveBeenCalledTimes(2)
  })
})
