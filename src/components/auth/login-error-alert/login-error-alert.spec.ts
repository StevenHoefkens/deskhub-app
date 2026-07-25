import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginErrorAlert from './login-error-alert.vue'

const baseProps = {
  message: 'We could not verify your sign-in.',
  retryLabel: 'Try again',
  retryAriaLabel: 'Retry sign in',
}

describe('LoginErrorAlert', () => {
  it('renders the message as an assertive alert', () => {
    const wrapper = mount(LoginErrorAlert, { props: { ...baseProps, retryable: false } })
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('aria-live')).toBe('assertive')
    expect(wrapper.text()).toContain('We could not verify your sign-in.')
  })

  it('hides the retry control unless the error is retryable', () => {
    const wrapper = mount(LoginErrorAlert, { props: { ...baseProps, retryable: false } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows the retry control and emits retry when retryable', async () => {
    const wrapper = mount(LoginErrorAlert, { props: { ...baseProps, retryable: true } })
    const retry = wrapper.find('button')
    expect(retry.exists()).toBe(true)
    expect(retry.attributes('aria-label')).toBe('Retry sign in')
    await retry.trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
