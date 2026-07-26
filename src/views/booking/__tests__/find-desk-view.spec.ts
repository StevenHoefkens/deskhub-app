import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import FindDeskView from '@/views/booking/find-desk-view.vue'
import { useI18n } from '@/lib/i18n/use-i18n'

vi.mock('@/api/booking', () => ({ searchAvailableDesks: vi.fn(), reserveDesk: vi.fn() }))

beforeEach(() => {
  useI18n().setLocale('en')
})

describe('FindDeskView', () => {
  it('renders the desk search form as its feature', () => {
    const queryClient = new QueryClient()
    const wrapper = mount(FindDeskView, {
      global: { plugins: [[VueQueryPlugin, { queryClient }]] },
    })
    expect(wrapper.find('.desk-search-form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Find a desk')
  })
})
