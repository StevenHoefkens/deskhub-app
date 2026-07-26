import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from './form-field.vue'

describe('FormField', () => {
  it('renders the label with a required indicator and exposes slot binding', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Date', fieldId: 'date', required: true },
      slots: { default: `<template #default="{ errorId, hasError }"><input id="date" :aria-describedby="hasError ? errorId : undefined" /></template>` },
    })
    const label = wrapper.get('label')
    expect(label.text()).toContain('Date')
    expect(label.attributes('for')).toBe('date')
    expect(label.find('span[aria-hidden="true"]').exists()).toBe(true)
  })

  it('shows the error as an assertive alert and hides help text', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Date', fieldId: 'date', error: 'Please choose a date.', helpText: 'help' },
      slots: { default: '<input id="date" />' },
    })
    const alert = wrapper.get('[role="alert"]')
    expect(alert.attributes('aria-live')).toBe('assertive')
    expect(alert.attributes('id')).toBe('date-error')
    expect(alert.text()).toBe('Please choose a date.')
    expect(wrapper.find('.form-field__help').exists()).toBe(false)
  })

  it('shows help text when there is no error', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Tags', fieldId: 'tags', helpText: 'Match all tags' },
      slots: { default: '<input id="tags" />' },
    })
    expect(wrapper.get('.form-field__help').text()).toBe('Match all tags')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
