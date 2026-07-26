import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReservationCard from './reservation-card.vue'
import type { ReservationSummary } from '@/types/booking'

const reservation: ReservationSummary = {
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

const roomReservation: ReservationSummary = {
  id: 'res-7702',
  resourceType: 'room',
  roomId: 'room-3-201',
  floor: '3',
  date: '2026-07-27',
  status: 'active',
  startsAt: '2026-07-27T10:00:00+02:00',
  endsAt: '2026-07-27T11:00:00+02:00',
}

const baseProps = {
  reservation,
  granularityLabel: 'Full day',
  checkInLabel: 'Not checked in',
  checkInVariant: 'neutral' as const,
  slotRangeLabel: '',
  cancelLabel: 'Cancel',
  cancelAria: 'Cancel this reservation',
  showCheckIn: true,
  checkInActionLabel: 'Check in',
  checkInActionAria: 'Check in to this desk reservation',
  checkInPendingLabel: 'Checking in…',
}

describe('ReservationCard', () => {
  it('renders a desk row with identity, zone, floor, date, granularity and check-in badge', () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    expect(wrapper.get('.reservation-card__label').text()).toBe('desk-2b-014')
    expect(wrapper.get('.reservation-card__zone').text()).toBe('zone-2b')
    expect(wrapper.get('.reservation-card__floor').text()).toBe('2')
    expect(wrapper.get('.reservation-card__date').text()).toBe('2026-07-27')
    expect(wrapper.get('.reservation-card__granularity').text()).toBe('Full day')
    expect(wrapper.get('.status-badge').text()).toBe('Not checked in')
    expect(wrapper.find('.reservation-card__slot').exists()).toBe(false)
  })

  it('renders a room row with the room id and slot range, and no zone/granularity/check-in', () => {
    const wrapper = mount(ReservationCard, {
      props: { ...baseProps, reservation: roomReservation, slotRangeLabel: '10:00–11:00' },
    })
    expect(wrapper.get('.reservation-card__label').text()).toBe('room-3-201')
    expect(wrapper.get('.reservation-card__floor').text()).toBe('3')
    expect(wrapper.get('.reservation-card__date').text()).toBe('2026-07-27')
    expect(wrapper.get('.reservation-card__slot').text()).toBe('10:00–11:00')
    expect(wrapper.find('.reservation-card__zone').exists()).toBe(false)
    expect(wrapper.find('.reservation-card__granularity').exists()).toBe(false)
    expect(wrapper.find('.status-badge').exists()).toBe(false)
  })

  it('emits cancel with the reservation id', async () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    await wrapper.get('.reservation-card__cancel').trigger('click')
    expect(wrapper.emitted('cancel')?.[0]).toEqual(['res-5501'])
  })

  it('disables the cancel button while cancelling', () => {
    const wrapper = mount(ReservationCard, { props: { ...baseProps, isCancelling: true } })
    expect(wrapper.get('.reservation-card__cancel').attributes('disabled')).toBeDefined()
  })

  it('renders a labelled check-in button for an eligible desk row', () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    const button = wrapper.get('.reservation-card__check-in')
    expect(button.text()).toBe('Check in')
    expect(button.attributes('aria-label')).toBe('Check in to this desk reservation')
  })

  it('emits check-in with the reservation id', async () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    await wrapper.get('.reservation-card__check-in').trigger('click')
    expect(wrapper.emitted('check-in')?.[0]).toEqual(['res-5501'])
  })

  it('hides the check-in button when the row is not eligible', () => {
    const wrapper = mount(ReservationCard, { props: { ...baseProps, showCheckIn: false } })
    expect(wrapper.find('.reservation-card__check-in').exists()).toBe(false)
  })

  it('disables the check-in button and shows the pending status while checking in', () => {
    const wrapper = mount(ReservationCard, { props: { ...baseProps, isCheckingIn: true } })
    expect(wrapper.get('.reservation-card__check-in').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.reservation-card__check-in-status').text()).toBe('Checking in…')
  })

  it('shows no pending status when not checking in', () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    expect(wrapper.find('.reservation-card__check-in-status').exists()).toBe(false)
  })
})
