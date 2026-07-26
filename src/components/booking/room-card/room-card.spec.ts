import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoomCard from './room-card.vue'
import type { AvailableRoom } from '@/types/booking'

const room: AvailableRoom = {
  roomId: 'room-3-201',
  floor: '3',
  maxCapacity: 8,
  tags: ['beamer', 'video-conference'],
}

const baseProps = {
  room,
  floorLabel: 'Floor',
  capacityLabel: 'Capacity',
  reserveLabel: 'Reserve',
  reserveAria: 'Reserve this room',
  pendingLabel: 'Reserving…',
}

describe('RoomCard', () => {
  it('renders the room identity, floor, capacity and tags as distinct fields', () => {
    const wrapper = mount(RoomCard, { props: baseProps })
    expect(wrapper.get('.room-card__label').text()).toBe('room-3-201')
    expect(wrapper.get('.room-card__floor').text()).toContain('3')
    expect(wrapper.get('.room-card__capacity').text()).toContain('8')
    expect(wrapper.get('.room-card__tags').text()).toContain('beamer')
    expect(wrapper.get('.room-card__tags').text()).toContain('video-conference')
  })

  it('omits the tags line when the room has no tags', () => {
    const wrapper = mount(RoomCard, { props: { ...baseProps, room: { ...room, tags: [] } } })
    expect(wrapper.find('.room-card__tags').exists()).toBe(false)
  })

  it('emits reserve with the room id', async () => {
    const wrapper = mount(RoomCard, { props: baseProps })
    await wrapper.get('.room-card__reserve').trigger('click')
    expect(wrapper.emitted('reserve')?.[0]).toEqual(['room-3-201'])
  })

  it('shows the pending status and disables the button while reserving', () => {
    const wrapper = mount(RoomCard, { props: { ...baseProps, isReserving: true } })
    expect(wrapper.get('.room-card__status').text()).toBe('Reserving…')
    expect(wrapper.get('.room-card__reserve').attributes('disabled')).toBeDefined()
  })
})
