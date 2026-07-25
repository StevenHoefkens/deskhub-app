import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleToggle from './locale-toggle.vue'

describe('LocaleToggle', () => {
  it('renders a labelled option per supported locale and marks the active one pressed', () => {
    const wrapper = mount(LocaleToggle, { props: { modelValue: 'nl', label: 'Choose language' } })
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-label')).toBe('Choose language')
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    const active = buttons.find((b) => b.attributes('aria-pressed') === 'true')
    expect(active?.text()).toBe('NL')
  })

  it('emits update:modelValue with the chosen locale', async () => {
    const wrapper = mount(LocaleToggle, { props: { modelValue: 'en', label: 'Choose language' } })
    const nl = wrapper.findAll('button').find((b) => b.text() === 'NL')!
    await nl.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['nl'])
  })
})
