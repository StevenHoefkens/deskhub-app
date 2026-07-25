import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient, ApiClientError } from '@/api/client'

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiClient', () => {
  it('returns the parsed body on success', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ reservations: [] }), { status: 200 }))
    const data = await apiClient<{ reservations: unknown[] }>('/reservations')
    expect(data).toEqual({ reservations: [] })
  })

  it('sends a JSON content-type and credentials for a body request', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 'r1' }), { status: 201 }))
    await apiClient('/reservations', { method: 'POST', body: JSON.stringify({ deskId: 'd1' }) })
    const call = fetchMock.mock.calls[0]
    expect(call).toBeDefined()
    const [url, init] = call as [string, RequestInit]
    expect(url).toContain('/reservations')
    expect(init.method).toBe('POST')
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json')
    expect(init.credentials).toBe('include')
  })

  it('throws ApiClientError carrying the parsed error body on a non-2xx response', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ code: 'DESK_NOT_AVAILABLE', message: 'gone' }), { status: 409 }),
    )
    await expect(apiClient('/reservations', { method: 'POST', body: '{}' })).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof ApiClientError &&
        error.status === 409 &&
        error.body?.code === 'DESK_NOT_AVAILABLE',
    )
  })

  it('throws ApiClientError with a null body when the error payload is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('oops', { status: 500 }))
    await expect(apiClient('/desks')).rejects.toSatisfy(
      (error: unknown) => error instanceof ApiClientError && error.status === 500 && error.body === null,
    )
  })
})
