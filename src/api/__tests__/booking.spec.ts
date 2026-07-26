import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  searchAvailableDesks,
  reserveDesk,
  listMyReservations,
  cancelReservation,
  searchAvailableRooms,
  reserveRoom,
} from '@/api/booking'

const fetchMock = vi.fn<typeof fetch>()

function lastRequest(): [string, RequestInit] {
  const call = fetchMock.mock.calls.at(-1)
  expect(call).toBeDefined()
  return call as [string, RequestInit]
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('booking api service', () => {
  it('builds the desk search query with date, granularity and repeated tags', async () => {
    await searchAvailableDesks({ date: '2026-07-27', granularity: 'FULL_DAY', tags: ['standing', 'dual-monitor'] })
    const [url, init] = lastRequest()
    expect(init.method ?? 'GET').toBe('GET')
    expect(url).toContain('/desks?')
    expect(url).toContain('date=2026-07-27')
    expect(url).toContain('granularity=FULL_DAY')
    expect(url).toContain('tags=standing')
    expect(url).toContain('tags=dual-monitor')
  })

  it('omits the tags param when none are supplied', async () => {
    await searchAvailableDesks({ date: '2026-07-27', granularity: 'MORNING' })
    const [url] = lastRequest()
    expect(url).not.toContain('tags=')
  })

  it('posts the reservation body to /reservations', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 'r1' }), { status: 201 }))
    await reserveDesk({ deskId: 'desk-2b-014', date: '2026-07-27', granularity: 'FULL_DAY' })
    const [url, init] = lastRequest()
    expect(url).toContain('/reservations')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual({
      deskId: 'desk-2b-014',
      date: '2026-07-27',
      granularity: 'FULL_DAY',
    })
  })

  it('gets the caller reservations from /reservations', async () => {
    await listMyReservations()
    const [url, init] = lastRequest()
    expect(url).toContain('/reservations')
    expect(init.method ?? 'GET').toBe('GET')
  })

  it('posts a cancel to the reservation cancel path with an encoded id', async () => {
    await cancelReservation('res 5501')
    const [url, init] = lastRequest()
    expect(url).toContain('/reservations/res%205501/cancel')
    expect(init.method).toBe('POST')
  })

  it('builds the room search query with date, slot range, capacity and repeated tags', async () => {
    await searchAvailableRooms({
      date: '2026-07-27',
      startTime: '10:00',
      endTime: '11:00',
      minCapacity: 6,
      tags: ['beamer', 'video-conference'],
    })
    const [url, init] = lastRequest()
    expect(init.method ?? 'GET').toBe('GET')
    expect(url).toContain('/rooms?')
    expect(url).toContain('date=2026-07-27')
    expect(url).toContain('startTime=10%3A00')
    expect(url).toContain('endTime=11%3A00')
    expect(url).toContain('minCapacity=6')
    expect(url).toContain('tags=beamer')
    expect(url).toContain('tags=video-conference')
  })

  it('omits optional room search params when not supplied', async () => {
    await searchAvailableRooms({ date: '2026-07-27', startTime: '10:00', endTime: '11:00' })
    const [url] = lastRequest()
    expect(url).not.toContain('minCapacity=')
    expect(url).not.toContain('tags=')
  })

  it('posts a room reservation to the room reservations path with an encoded room id', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 'r1' }), { status: 201 }))
    await reserveRoom('room 3 201', { date: '2026-07-27', startTime: '10:00', endTime: '11:00' })
    const [url, init] = lastRequest()
    expect(url).toContain('/rooms/room%203%20201/reservations')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual({
      date: '2026-07-27',
      startTime: '10:00',
      endTime: '11:00',
    })
  })
})
