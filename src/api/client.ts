import type { ApiErrorBody } from '@/types/errors'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

const NO_CONTENT_STATUS = 204

export class ApiClientError extends Error {
  readonly status: number
  readonly body: ApiErrorBody | null

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message ?? `Request failed with status ${status}`)
    this.name = 'ApiClientError'
    this.status = status
    this.body = body
  }
}

async function readErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    return (await response.json()) as ApiErrorBody
  } catch {
    return null
  }
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined && options.body !== null) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new ApiClientError(response.status, await readErrorBody(response))
  }

  if (response.status === NO_CONTENT_STATUS) {
    return undefined as T
  }

  return (await response.json()) as T
}
