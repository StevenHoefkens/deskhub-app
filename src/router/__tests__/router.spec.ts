import { describe, it, expect } from 'vitest'
import { router } from '@/router'
import { LOGIN_ROUTE_PATH, HOME_PATH } from '@/config/auth'

describe('router', () => {
  it('registers the login route', () => {
    const login = router.resolve(LOGIN_ROUTE_PATH)
    expect(login.name).toBe('login')
    expect(login.matched.length).toBeGreaterThan(0)
  })

  it('redirects the root path to the login route', async () => {
    await router.push(HOME_PATH)
    await router.isReady()
    expect(router.currentRoute.value.path).toBe(LOGIN_ROUTE_PATH)
  })

  it('registers the find-desk route', () => {
    const route = router.resolve('/desks')
    expect(route.name).toBe('find-desk')
    expect(route.matched.length).toBeGreaterThan(0)
  })

  it('registers the my-reservations route', () => {
    const route = router.resolve('/reservations')
    expect(route.name).toBe('my-reservations')
    expect(route.matched.length).toBeGreaterThan(0)
  })
})
