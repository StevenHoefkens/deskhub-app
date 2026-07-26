import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReservationCard from './reservation-card.vue'
import type { ReservationSummary } from '@/types/booking'

const reservation: ReservationSummary = {
  id: 'res-5501',
  deskId: 'desk-2b-014',
  zoneId: 'zone-2b',
  floor: '2',
  date: '2026-07-27',
  granularity: 'FULL_DAY',
  status: 'active',
  checkInState: 'not_checked_in',
}

const baseProps = {
  reservation,
  granularityLabel: 'Full day',
  checkInLabel: 'Not checked in',
  checkInVariant: 'neutral' as const,
  cancelLabel: 'Cancel',
  cancelAria: 'Cancel this reservation',
}

describe('ReservationCard', () => {
  it('renders the reservation identity, zone, floor, date and granularity as distinct fields', () => {
    const wrapper = mount(ReservationCard, { props: baseProps })
    expect(wrapper.get('.reservation-card__label').text()).toBe('desk-2b-014')
    expect(wrapper.get('.reservation-card__zone').text()).toBe('zone-2b')
    expect(wrapper.get('.reservation-card__floor').text()).toBe('2')
    expect(wrapper.get('.reservation-card__date').text()).toBe('2026-07-27')
    expect(wrapper.get('.reservation-card__granularity').text()).toBe('Full day')
    expect(wrapper.get('.status-badge').text()).toBe('Not checked in')
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
})
