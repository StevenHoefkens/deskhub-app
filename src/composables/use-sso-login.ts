import { SSO_LOGIN_PATH, HOME_PATH, RETURN_URL_QUERY_KEY } from '@/config/auth'
import { safeInternalPath } from '@/lib/url'

export interface UseSsoLoginResult {
  signIn: (returnUrl?: string) => void
}

export function useSsoLogin(): UseSsoLoginResult {
  function signIn(returnUrl: string = HOME_PATH): void {
    const safeReturnUrl = safeInternalPath(returnUrl)
    const target = `${SSO_LOGIN_PATH}?${RETURN_URL_QUERY_KEY}=${encodeURIComponent(safeReturnUrl)}`
    window.location.assign(target)
  }

  return { signIn }
}
