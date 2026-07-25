import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import LoginForm from './login-form.vue'
import { useI18n } from '@/lib/i18n/use-i18n'
import { useToast } from '@/lib/toast'
import { SSO_LOGIN_PATH } from '@/config/auth'

const originalLocation = window.location
let assign: ReturnType<typeof vi.fn>

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/login', name: 'login', component: { template: '<div />' } }],
  })
}

async function mountAt(query: string) {
  const router = makeRouter()
  await router.push(`/login${query}`)
  await router.isReady()
  const wrapper = mount(LoginForm, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  useI18n().setLocale('en')
  useToast().clear()
  assign = vi.fn()
  Object.defineProperty(window, 'location', { configurable: true, value: { assign } })
})

afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
})

describe('LoginForm', () => {
  it('renders the SSO sign-in entry with localized copy', async () => {
    const wrapper = await mountAt('')
    expect(wrapper.text()).toContain('DeskHub')
    expect(wrapper.text()).toContain('Sign in with your corporate account to continue.')
    const signIn = wrapper.get('.login-card__sign-in')
    expect(signIn.text()).toBe('Sign in with SSO')
    expect(signIn.attributes('aria-label')).toBe('Sign in with single sign-on')
  })

  it('forwards the recorded return URL to the SSO redirect on sign-in', async () => {
    const wrapper = await mountAt('?returnUrl=/desks?date=2026-07-27')
    await wrapper.get('.login-card__sign-in').trigger('click')
    expect(assign).toHaveBeenCalledWith(
      `${SSO_LOGIN_PATH}?returnUrl=${encodeURIComponent('/desks?date=2026-07-27')}`,
    )
  })

  it('switches copy to Dutch when the locale toggle changes', async () => {
    const wrapper = await mountAt('')
    const nl = wrapper.findAll('.locale-toggle__option').find((b) => b.text() === 'NL')!
    await nl.trigger('click')
    expect(wrapper.text()).toContain('Meld je aan met je bedrijfsaccount om verder te gaan.')
  })

  it('shows a non-retryable localized alert and raises a toast for a denied login', async () => {
    const wrapper = await mountAt('?error=access_denied')
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('We could not verify your sign-in. Please try again.')
    expect(alert.find('.login-error-alert__retry').exists()).toBe(false)
    const toasts = useToast().toasts.value
    expect(toasts).toHaveLength(1)
    expect(toasts[0]?.variant).toBe('error')
    expect(toasts[0]?.message).toBe('We could not sign you in. Please try again.')
  })

  it('renders the facility-management message without retry for a missing identifier', async () => {
    const wrapper = await mountAt('?error=missing_identifier')
    const alert = wrapper.find('[role="alert"]')
    expect(alert.text()).toContain('Please contact facility management.')
    expect(alert.find('.login-error-alert__retry').exists()).toBe(false)
  })

  it('offers a retry control when the identity provider was unreachable', async () => {
    const wrapper = await mountAt('?error=idp_unreachable')
    expect(wrapper.find('.login-error-alert__retry').exists()).toBe(true)
  })

  it('shows no alert and raises no toast when there is no error', async () => {
    const wrapper = await mountAt('')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(useToast().toasts.value).toHaveLength(0)
  })
})
