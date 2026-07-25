import { ref, readonly, type DeepReadonly, type Ref } from 'vue'

export const DEFAULT_TOAST_DURATION_MS = 4000

export const TOAST_VARIANTS = ['success', 'error', 'info', 'warning'] as const

export type ToastVariant = (typeof TOAST_VARIANTS)[number]

export interface Toast {
  id: number
  variant: ToastVariant
  message: string
}

export interface ToastOptions {
  duration?: number
}

const items = ref<Toast[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 0

export function pushToast(
  variant: ToastVariant,
  message: string,
  options: ToastOptions = {},
): number {
  const id = ++nextId
  items.value = [...items.value, { id, variant, message }]

  const duration = options.duration ?? DEFAULT_TOAST_DURATION_MS
  timers.set(
    id,
    setTimeout(() => dismissToast(id), duration),
  )
  return id
}

export function dismissToast(id: number): void {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  items.value = items.value.filter((toast) => toast.id !== id)
}

export function clearToasts(): void {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
  items.value = []
}

export function useToastItems(): Ref<DeepReadonly<Toast[]>> {
  return readonly(items) as Ref<DeepReadonly<Toast[]>>
}
