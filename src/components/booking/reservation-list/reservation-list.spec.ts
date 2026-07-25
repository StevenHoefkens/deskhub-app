import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import ReservationList from './reservation-list.vue'
import { ApiClientError } from '@/api/client'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import type { CancelResult, MyReservations, ReservationSummary } from '@/types/booking'

vi.mock('@/api/booking', () => ({ listMyReservations: vi.fn(), cancelReservation: vi.fn() }))
import { listMyReservations, cancelReservation } from '@/api/booking'

const listMock = vi.mocked(listMyReservations)
const cancelMock = vi.mocked(cancelReservation)

const RESERVATION: ReservationSummary = {
  id: 'res-5501',
  deskId: 'desk-2b-014',
  zoneId: 'zone-2b',
  floor: '2',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  status: 'active',
  checkInState: 'not_checked_in',
}

const ONE: MyReservations = { reservations: [RESERVATION] }

const CANCELLED: CancelResult = {
  id: 'res-5501',
  status: 'cancelled',
  deskId: 'desk-2b-014',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
}

function mountList(): VueWrapper {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return mount(ReservationList, { global: { plugins: [[VueQueryPlugin, { queryClient }]] } })
}

beforeEach(() => {
  listMock.mockReset()
  cancelMock.mockReset()
  useI18n().setLocale('en')
  useToast().clear()
})

describe('ReservationList', () => {
  it('renders the caller reservations with a check-in badge', async () => {
    listMock.mockResolvedValue(ONE)
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.get('.reservation-card__label').text()).toBe('desk-2b-014')
    expect(wrapper.get('.status-badge').text()).toBe('Not checked in')
  })

  it('shows the empty notice when there are no reservations', async () => {
    listMock.mockResolvedValue({ reservations: [] })
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.text()).toContain('You have no upcoming reservations.')
  })

  it('shows an error notice when the reservations cannot be loaded', async () => {
    listMock.mockRejectedValue(new ApiClientError(401, { code: 'SESSION_EXPIRED', message: 'Your session has expired.' }))
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.text()).toContain('Your session has expired.')
  })

  it('opens a confirmation dialog before cancelling', async () => {
    listMock.mockResolvedValue(ONE)
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.get('.reservation-card__cancel').trigger('click')
    expect(wrapper.get('[role="dialog"]').text()).toContain('Cancel this reservation and free the desk?')
    expect(cancelMock).not.toHaveBeenCalled()
  })

  it('cancels the reservation on confirmation and raises a success toast', async () => {
    listMock.mockResolvedValue(ONE)
    cancelMock.mockResolvedValue(CANCELLED)
    const wrapper = mountList()
    await flushPromises()

    await wrapper.get('.reservation-card__cancel').trigger('click')
    await wrapper.get('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(cancelMock.mock.calls[0]?.[0]).toBe('res-5501')
    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'success' &&
          toast.message === 'Reservation cancelled. The desk is free again.',
      ),
    ).toBe(true)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('refreshes the list and raises an error toast when a cancel fails', async () => {
    listMock.mockResolvedValue(ONE)
    cancelMock.mockRejectedValue(
      new ApiClientError(409, { code: 'RESERVATION_ALREADY_ENDED', message: 'ended' }),
    )
    const wrapper = mountList()
    await flushPromises()
    expect(listMock).toHaveBeenCalledTimes(1)

    await wrapper.get('.reservation-card__cancel').trigger('click')
    await wrapper.get('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(listMock).toHaveBeenCalledTimes(2)
    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'error' &&
          toast.message === 'We could not cancel that reservation. Please refresh and try again.',
      ),
    ).toBe(true)
  })
})
