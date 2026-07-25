import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from './status-badge.vue'

describe('StatusBadge', () => {
  it('renders the label and defaults to the neutral variant', () => {
    const wrapper = mount(StatusBadge, { props: { label: 'Not checked in' } })
    expect(wrapper.text()).toBe('Not checked in')
    expect(wrapper.classes()).toContain('status-badge--neutral')
  })

  it('applies the given variant', () => {
    const wrapper = mount(StatusBadge, { props: { label: 'Checked in', variant: 'success' } })
    expect(wrapper.classes()).toContain('status-badge--success')
  })
})
