import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeskCard from './desk-card.vue'
import type { AvailableDesk } from '@/types/booking'

const desk: AvailableDesk = {
  deskId: 'desk-2b-014',
  zoneId: 'zone-2b',
  floor: '2',
  tags: ['standing', 'dual-monitor'],
}

const baseProps = {
  desk,
  reserveLabel: 'Reserve',
  reserveAria: 'Reserve this desk',
  pendingLabel: 'Reserving…',
}

describe('DeskCard', () => {
  it('renders the desk identity, location and tags', () => {
    const wrapper = mount(DeskCard, { props: baseProps })
    expect(wrapper.get('.desk-card__label').text()).toBe('desk-2b-014')
    expect(wrapper.get('.desk-card__location').text()).toBe('zone-2b · 2')
    expect(wrapper.get('.desk-card__tags').text()).toBe('standing, dual-monitor')
  })

  it('emits reserve with the desk id', async () => {
    const wrapper = mount(DeskCard, { props: baseProps })
    await wrapper.get('.desk-card__reserve').trigger('click')
    expect(wrapper.emitted('reserve')?.[0]).toEqual(['desk-2b-014'])
  })

  it('shows the pending label and disables the button while reserving', () => {
    const wrapper = mount(DeskCard, { props: { ...baseProps, isReserving: true } })
    expect(wrapper.get('.desk-card__status').text()).toBe('Reserving…')
    expect(wrapper.get('.desk-card__reserve').attributes('disabled')).toBeDefined()
  })
})
