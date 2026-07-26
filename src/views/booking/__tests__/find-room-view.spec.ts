import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import FindRoomView from '@/views/booking/find-room-view.vue'
import { useI18n } from '@/lib/i18n/use-i18n'

vi.mock('@/api/booking', () => ({ searchAvailableRooms: vi.fn(), reserveRoom: vi.fn() }))

beforeEach(() => {
  useI18n().setLocale('en')
})

describe('FindRoomView', () => {
  it('renders the room search form as its feature', () => {
    const queryClient = new QueryClient()
    const wrapper = mount(FindRoomView, {
      global: { plugins: [[VueQueryPlugin, { queryClient }]] },
    })
    expect(wrapper.find('.room-search-form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Find a room')
  })
})
