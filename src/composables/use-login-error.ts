import { computed, type ComputedRef } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import {
  resolveLoginErrorState,
  loginErrorMessageKey,
  isRetryableLoginError,
} from '@/lib/login-error'
import type { LoginErrorState } from '@/types/auth'
import { HOME_PATH, RETURN_URL_QUERY_KEY, ERROR_QUERY_KEY } from '@/config/auth'

export interface UseLoginErrorResult {
  errorState: ComputedRef<LoginErrorState | null>
  messageKey: ComputedRef<string | null>
  isRetryable: ComputedRef<boolean>
  returnUrl: ComputedRef<string>
}

function firstQueryValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
}

export function useLoginError(): UseLoginErrorResult {
  const route = useRoute()

  const errorState = computed(() =>
    resolveLoginErrorState(firstQueryValue(route.query[ERROR_QUERY_KEY])),
  )
  const messageKey = computed(() =>
    errorState.value ? loginErrorMessageKey(errorState.value) : null,
  )
  const isRetryable = computed(() =>
    errorState.value ? isRetryableLoginError(errorState.value) : false,
  )
  const returnUrl = computed(() => firstQueryValue(route.query[RETURN_URL_QUERY_KEY]) ?? HOME_PATH)

  return { errorState, messageKey, isRetryable, returnUrl }
}
