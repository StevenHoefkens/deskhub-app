import type { components } from '@/types/contracts/uc-004'

export type ApiErrorBody = components['schemas']['Error']

export type ApiErrorDetail = NonNullable<ApiErrorBody['details']>[number]

export interface FieldError {
  field: string
  reason: string
}
