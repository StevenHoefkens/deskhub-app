import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { useLoginError } from '@/composables/use-login-error'
import { HOME_PATH } from '@/config/auth'

async function mountWithQuery(query: string) {
  const router: Router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/login', name: 'login', component: { template: '<div />' } }],
  })
  const captured: ReturnType<typeof useLoginError> = {} as ReturnType<typeof useLoginError>
  const Probe = defineComponent({
    setup() {
      Object.assign(captured, useLoginError())
      return () => h('div')
    },
  })
  await router.push(`/login${query}`)
  await router.isReady()
  mount(Probe, { global: { plugins: [router] } })
  return captured
}

describe('useLoginError', () => {
  it('resolves the error state, message key and retry flag from the query', async () => {
    const r = await mountWithQuery('?error=idp_unreachable&returnUrl=/desks')
    expect(r.errorState.value).toBe('idp_unreachable')
    expect(r.messageKey.value).toBe('login.error.idp_unreachable')
    expect(r.isRetryable.value).toBe(true)
    expect(r.returnUrl.value).toBe('/desks')
  })

  it('maps a contract error code to its UI state and marks it non-retryable', async () => {
    const r = await mountWithQuery('?error=PROVISIONING_MISSING_IDENTIFIER')
    expect(r.errorState.value).toBe('missing_identifier')
    expect(r.isRetryable.value).toBe(false)
  })

  it('reports no error and a home return URL when the query is empty', async () => {
    const r = await mountWithQuery('')
    expect(r.errorState.value).toBeNull()
    expect(r.messageKey.value).toBeNull()
    expect(r.returnUrl.value).toBe(HOME_PATH)
  })
})
