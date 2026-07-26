import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoomSearchForm, { type RoomSearchFormLabels } from './room-search-form.vue'
import type { RoomSearchParams } from '@/types/booking'

const labels: RoomSearchFormLabels = {
  title: 'Find a room',
  date: 'Date',
  dateAria: 'Booking date',
  from: 'From',
  fromAria: 'Slot range start time',
  to: 'To',
  toAria: 'Slot range end time',
  timeHelp: 'Aligned to 15-minute steps',
  capacity: 'Minimum capacity',
  capacityAria: 'Minimum room capacity',
  capacityHelp: 'Optional',
  facilities: 'Facilities',
  facilitiesHelp: 'Match rooms carrying all selected tags',
  facilitiesAdd: 'Add facility tag',
  facilitiesRemove: 'Remove facility tag',
  submit: 'Search',
  submitAria: 'Search available rooms',
}

function mountForm(values: Partial<RoomSearchParams> = {}, errors: Record<string, string> = {}) {
  return mount(RoomSearchForm, { props: { values, errors, labels } })
}

describe('RoomSearchForm', () => {
  it('renders the title and all slot-range and filter controls', () => {
    const wrapper = mountForm()
    expect(wrapper.text()).toContain('Find a room')
    expect(wrapper.get('#room-search-date').attributes('type')).toBe('date')
    expect(wrapper.get('#room-search-start').attributes('type')).toBe('time')
    expect(wrapper.get('#room-search-end').attributes('type')).toBe('time')
    expect(wrapper.get('#room-search-capacity').attributes('type')).toBe('number')
  })

  it('emits submit on form submission', async () => {
    const wrapper = mountForm()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('emits field updates as the user edits', async () => {
    const wrapper = mountForm()
    await wrapper.get('#room-search-date').setValue('2026-07-27')
    await wrapper.get('#room-search-start').setValue('10:00')
    await wrapper.get('#room-search-end').setValue('11:00')
    await wrapper.get('#room-search-capacity').setValue('6')

    expect(wrapper.emitted('updateDate')?.[0]).toEqual(['2026-07-27'])
    expect(wrapper.emitted('updateStartTime')?.[0]).toEqual(['10:00'])
    expect(wrapper.emitted('updateEndTime')?.[0]).toEqual(['11:00'])
    expect(wrapper.emitted('updateMinCapacity')?.[0]).toEqual([6])
  })

  it('emits an undefined capacity when the field is cleared', async () => {
    const wrapper = mountForm({ minCapacity: 6 })
    await wrapper.get('#room-search-capacity').setValue('')
    expect(wrapper.emitted('updateMinCapacity')?.[0]).toEqual([undefined])
  })

  it('shows an inline error for an invalid field', () => {
    const wrapper = mountForm({}, { endTime: 'The end time must be after the start time.' })
    expect(
      wrapper.findAll('[role="alert"]').some((alert) => alert.text().includes('after the start time')),
    ).toBe(true)
  })
})
