import { LOGIN_ERROR_STATES, type LoginErrorState } from '@/types/auth'

const MESSAGE_KEY_PREFIX = 'login.error.'
const RETRYABLE_STATE: LoginErrorState = 'idp_unreachable'

const CONTRACT_CODE_TO_STATE = new Map<string, LoginErrorState>([
  ['AUTH_RESPONSE_INVALID', 'access_denied'],
  ['PROVISIONING_MISSING_IDENTIFIER', 'missing_identifier'],
])

function isLoginErrorState(value: string): value is LoginErrorState {
  return (LOGIN_ERROR_STATES as readonly string[]).includes(value)
}

export function resolveLoginErrorState(raw: string | null | undefined): LoginErrorState | null {
  if (!raw) return null
  const mapped = CONTRACT_CODE_TO_STATE.get(raw)
  if (mapped) return mapped
  if (isLoginErrorState(raw)) return raw
  return null
}

export function loginErrorMessageKey(state: LoginErrorState): string {
  return `${MESSAGE_KEY_PREFIX}${state}`
}

export function isRetryableLoginError(state: LoginErrorState): boolean {
  return state === RETRYABLE_STATE
}
