import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export interface MountedComposable<T> {
  result: T
  wrapper: VueWrapper
  queryClient: QueryClient
}

export function mountComposable<T>(composable: () => T): MountedComposable<T> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  let result: T | undefined
  const host = defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    },
  })
  const wrapper = mount(host, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })
  return { result: result as T, wrapper, queryClient }
}
