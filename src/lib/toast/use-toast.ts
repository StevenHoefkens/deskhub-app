import type { DeepReadonly, Ref } from 'vue'
import {
  pushToast,
  dismissToast,
  clearToasts,
  useToastItems,
  type Toast,
  type ToastOptions,
} from './toast-store'

export interface UseToastResult {
  toasts: Ref<DeepReadonly<Toast[]>>
  success: (message: string, options?: ToastOptions) => number
  error: (message: string, options?: ToastOptions) => number
  info: (message: string, options?: ToastOptions) => number
  warning: (message: string, options?: ToastOptions) => number
  dismiss: (id: number) => void
  clear: () => void
}

export function useToast(): UseToastResult {
  return {
    toasts: useToastItems(),
    success: (message, options) => pushToast('success', message, options),
    error: (message, options) => pushToast('error', message, options),
    info: (message, options) => pushToast('info', message, options),
    warning: (message, options) => pushToast('warning', message, options),
    dismiss: dismissToast,
    clear: clearToasts,
  }
}
