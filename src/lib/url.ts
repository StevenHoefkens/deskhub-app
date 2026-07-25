import { HOME_PATH } from '@/config/auth'

export function safeInternalPath(
  candidate: string | null | undefined,
  fallback: string = HOME_PATH,
): string {
  if (typeof candidate !== 'string') return fallback
  if (!candidate.startsWith('/')) return fallback
  if (candidate.startsWith('//') || candidate.startsWith('/\\')) return fallback
  return candidate
}
