import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeskSearchForm, { type DeskSearchFormLabels } from './desk-search-form.vue'

const labels: DeskSearchFormLabels = {
  title: 'Find a desk',
  date: 'Date',
  dateAria: 'Reservation date',
  when: 'When',
  whenAria: 'Booking granularity',
  tags: 'Tags',
  tagsHelp: 'Match desks carrying all selected tags',
  tagsAdd: 'Add tag',
  tagRemove: 'Remove tag',
  submit: 'Search',
  submitAria: 'Search available desks',
}

const granularityOptions = [
  { value: 'FULL_DAY' as const, label: 'Full day' },
  { value: 'MORNING' as const, label: 'Morning' },
  { value: 'AFTERNOON' as const, label: 'Afternoon' },
]

function mountForm(overrides = {}) {
  return mount(DeskSearchForm, {
    props: { values: {}, errors: {}, granularityOptions, labels, ...overrides },
  })
}

describe('DeskSearchForm', () => {
  it('emits updateDate and updateGranularity on input', async () => {
    const wrapper = mountForm()
    await wrapper.get('#desk-search-date').setValue('2026-07-27')
    await wrapper.get('#desk-search-when').setValue('MORNING')
    expect(wrapper.emitted('updateDate')?.[0]).toEqual(['2026-07-27'])
    expect(wrapper.emitted('updateGranularity')?.[0]).toEqual(['MORNING'])
  })

  it('emits submit on form submission', async () => {
    const wrapper = mountForm()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('marks the date control invalid and links the error when present', () => {
    const wrapper = mountForm({ errors: { date: 'Please choose a date.' } })
    const input = wrapper.get('#desk-search-date')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('desk-search-date-error')
    expect(wrapper.get('[role="alert"]').text()).toBe('Please choose a date.')
  })

  it('disables the submit button while submitting', () => {
    const wrapper = mountForm({ isSubmitting: true })
    expect(wrapper.get('.desk-search-form__submit').attributes('disabled')).toBeDefined()
  })
})
