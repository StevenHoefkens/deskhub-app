import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useToast, DEFAULT_TOAST_DURATION_MS } from '@/lib/toast'
import ToastHost from '@/lib/toast/toast-host.vue'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToast().clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('pushes an error toast with the given user-facing message', () => {
    const toast = useToast()
    toast.error('We could not sign you in. Please try again.')
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0]?.variant).toBe('error')
    expect(toast.toasts.value[0]?.message).toBe('We could not sign you in. Please try again.')
  })

  it('auto-dismisses after the default duration', () => {
    const toast = useToast()
    toast.success('Saved')
    vi.advanceTimersByTime(DEFAULT_TOAST_DURATION_MS - 1)
    expect(toast.toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(toast.toasts.value).toHaveLength(0)
  })

  it('honours a per-call duration override', () => {
    const toast = useToast()
    toast.error('boom', { duration: 5000 })
    vi.advanceTimersByTime(DEFAULT_TOAST_DURATION_MS)
    expect(toast.toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toast.toasts.value).toHaveLength(0)
  })

  it('dismisses a specific toast by id', () => {
    const toast = useToast()
    toast.info('hello')
    const id = toast.toasts.value[0]!.id
    toast.dismiss(id)
    expect(toast.toasts.value).toHaveLength(0)
  })
})

describe('ToastHost', () => {
  beforeEach(() => {
    useToast().clear()
  })

  it('renders an error toast as an assertive alert', async () => {
    const wrapper = mount(ToastHost)
    useToast().error('Something failed')
    await wrapper.vm.$nextTick()
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('Something failed')
  })
})
