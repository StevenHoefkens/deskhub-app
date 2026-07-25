import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagFilterInput from './tag-filter-input.vue'

const baseProps = {
  inputId: 'tags',
  addAriaLabel: 'Add tag',
  removeAriaLabel: 'Remove tag',
}

describe('TagFilterInput', () => {
  it('adds a trimmed tag on Enter', async () => {
    const wrapper = mount(TagFilterInput, { props: { ...baseProps, modelValue: [] } })
    const field = wrapper.get('input')
    await field.setValue('  standing  ')
    await field.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['standing']])
  })

  it('ignores blank and duplicate tags', async () => {
    const wrapper = mount(TagFilterInput, { props: { ...baseProps, modelValue: ['standing'] } })
    const field = wrapper.get('input')
    await field.setValue('standing')
    await field.trigger('keydown.enter')
    await field.setValue('   ')
    await field.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders removable chips and emits removal', async () => {
    const wrapper = mount(TagFilterInput, {
      props: { ...baseProps, modelValue: ['standing', 'dual-monitor'] },
    })
    const removeButtons = wrapper.findAll('.tag-filter-input__chip button')
    expect(removeButtons).toHaveLength(2)
    expect(removeButtons[0]?.attributes('aria-label')).toBe('Remove tag: standing')
    await removeButtons[0]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['dual-monitor']])
  })
})
