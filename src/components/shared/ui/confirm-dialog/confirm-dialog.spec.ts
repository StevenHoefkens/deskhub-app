import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from './confirm-dialog.vue'

const baseProps = {
  title: 'Cancel reservation',
  message: 'Cancel this reservation and free the desk?',
  confirmLabel: 'Yes, cancel',
  dismissLabel: 'Keep reservation',
}

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const wrapper = mount(ConfirmDialog, { props: { ...baseProps, open: false } })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders an accessible dialog labelled by its title when open', () => {
    const wrapper = mount(ConfirmDialog, { props: { ...baseProps, open: true } })
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    const title = wrapper.get('.confirm-dialog__title')
    expect(dialog.attributes('aria-labelledby')).toBe(title.attributes('id'))
  })

  it('emits confirm and dismiss from the action buttons', async () => {
    const wrapper = mount(ConfirmDialog, { props: { ...baseProps, open: true } })
    await wrapper.get('.confirm-dialog__confirm').trigger('click')
    await wrapper.get('.confirm-dialog__dismiss').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('dismisses on Escape and backdrop click', async () => {
    const wrapper = mount(ConfirmDialog, { props: { ...baseProps, open: true } })
    await wrapper.get('.confirm-dialog__backdrop').trigger('keydown.esc')
    await wrapper.get('.confirm-dialog__backdrop').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(2)
  })

  it('shows the pending label only while a submission is in progress', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: { ...baseProps, open: true, pendingLabel: 'Cancelling…' },
    })
    expect(wrapper.find('.confirm-dialog__status').exists()).toBe(false)
    await wrapper.setProps({ isPending: true })
    expect(wrapper.get('.confirm-dialog__status').text()).toBe('Cancelling…')
  })

  it('does not dismiss while a submission is pending', async () => {
    const wrapper = mount(ConfirmDialog, { props: { ...baseProps, open: true, isPending: true } })
    await wrapper.get('.confirm-dialog__backdrop').trigger('keydown.esc')
    await wrapper.get('.confirm-dialog__dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toBeUndefined()
  })

  it('focuses the confirm button when opened', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: { ...baseProps, open: false },
      attachTo: document.body,
    })
    await wrapper.setProps({ open: true })
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(wrapper.get('.confirm-dialog__confirm').element)
    wrapper.unmount()
  })
})
