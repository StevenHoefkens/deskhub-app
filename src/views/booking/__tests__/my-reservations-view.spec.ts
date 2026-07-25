import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import MyReservationsView from '@/views/booking/my-reservations-view.vue'
import { useI18n } from '@/lib/i18n/use-i18n'

vi.mock('@/api/booking', () => ({
  listMyReservations: vi.fn(() => Promise.resolve({ reservations: [] })),
  cancelReservation: vi.fn(),
}))

beforeEach(() => {
  useI18n().setLocale('en')
})

describe('MyReservationsView', () => {
  it('renders the page title and delegates to the reservation list feature', async () => {
    const queryClient = new QueryClient()
    const wrapper = mount(MyReservationsView, {
      global: { plugins: [[VueQueryPlugin, { queryClient }]] },
    })
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('My reservations')
    expect(wrapper.find('.reservation-list').exists()).toBe(true)
  })
})
