import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import ReservationList from './reservation-list.vue'
import { ApiClientError } from '@/api/client'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import type {
  CancelResult,
  CheckInResult,
  MyReservations,
  ReservationSummary,
} from '@/types/booking'

vi.mock('@/api/booking', () => ({
  listMyReservations: vi.fn(),
  cancelReservation: vi.fn(),
  checkInToReservation: vi.fn(),
}))
import { listMyReservations, cancelReservation, checkInToReservation } from '@/api/booking'

const listMock = vi.mocked(listMyReservations)
const cancelMock = vi.mocked(cancelReservation)
const checkInMock = vi.mocked(checkInToReservation)

const RESERVATION: ReservationSummary = {
  id: 'res-5501',
  resourceType: 'desk',
  deskId: 'desk-2b-014',
  zoneId: 'zone-2b',
  floor: '2',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  status: 'active',
  checkInState: 'not_checked_in',
}

const ROOM_RESERVATION: ReservationSummary = {
  id: 'res-7702',
  resourceType: 'room',
  roomId: 'room-3-201',
  floor: '3',
  date: '2026-07-27',
  status: 'active',
  startsAt: '2026-07-27T10:00:00+02:00',
  endsAt: '2026-07-27T11:00:00+02:00',
}

const ONE: MyReservations = { reservations: [RESERVATION] }

const CANCELLED: CancelResult = {
  id: 'res-5501',
  status: 'cancelled',
  resourceType: 'desk',
  deskId: 'desk-2b-014',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
}

const CHECKED_IN: CheckInResult = {
  id: 'res-5501',
  deskId: 'desk-2b-014',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  status: 'active',
  checkInState: 'checked_in',
  checkedInAt: '2026-07-27T08:45:00+02:00',
  alreadyCheckedIn: false,
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
  checkInMock.mockReset()
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

  it('renders a room reservation with its slot range and no check-in badge', async () => {
    listMock.mockResolvedValue({ reservations: [ROOM_RESERVATION] })
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.get('.reservation-card__label').text()).toBe('room-3-201')
    expect(wrapper.get('.reservation-card__slot').text()).toBe('10:00–11:00')
    expect(wrapper.find('.status-badge').exists()).toBe(false)
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
    expect(wrapper.get('[role="dialog"]').text()).toContain('Cancel this reservation and free the resource?')
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
          toast.message === 'Reservation cancelled. The resource is free again.',
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

  it('offers check-in for a not-checked-in desk row and hides it for a room row', async () => {
    listMock.mockResolvedValue({ reservations: [RESERVATION, ROOM_RESERVATION] })
    const wrapper = mountList()
    await flushPromises()

    const checkInButtons = wrapper.findAll('.reservation-card__check-in')
    expect(checkInButtons).toHaveLength(1)
    expect(checkInButtons[0]?.attributes('aria-label')).toBe('Check in to this desk reservation')
  })

  it('hides check-in once the desk reservation is already checked in', async () => {
    listMock.mockResolvedValue({
      reservations: [{ ...RESERVATION, checkInState: 'checked_in' }],
    })
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.find('.reservation-card__check-in').exists()).toBe(false)
  })

  it('checks in the reservation and raises a success toast, with no confirm dialog', async () => {
    listMock.mockResolvedValue(ONE)
    checkInMock.mockResolvedValue(CHECKED_IN)
    const wrapper = mountList()
    await flushPromises()

    expect(listMock).toHaveBeenCalledTimes(1)
    await wrapper.get('.reservation-card__check-in').trigger('click')
    await flushPromises()

    expect(checkInMock.mock.calls[0]?.[0]).toBe('res-5501')
    expect(listMock).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'success' &&
          toast.message === "You're checked in. Your desk is confirmed.",
      ),
    ).toBe(true)
  })

  it('refreshes the list and raises an error toast when a check-in fails', async () => {
    listMock.mockResolvedValue(ONE)
    checkInMock.mockRejectedValue(
      new ApiClientError(422, { code: 'CHECK_IN_WINDOW_EXPIRED', message: 'expired' }),
    )
    const wrapper = mountList()
    await flushPromises()
    expect(listMock).toHaveBeenCalledTimes(1)

    await wrapper.get('.reservation-card__check-in').trigger('click')
    await flushPromises()

    expect(listMock).toHaveBeenCalledTimes(2)
    expect(
      useToast().toasts.value.some(
        (toast) =>
          toast.variant === 'error' &&
          toast.message ===
            'We could not check you in. Check-in may not be open yet or the window may have passed.',
      ),
    ).toBe(true)
  })
})
