<script setup lang="ts">
import { ref, computed } from 'vue'
import ReservationCard from '@/components/booking/reservation-card/reservation-card.vue'
import ConfirmDialog from '@/components/shared/ui/confirm-dialog/confirm-dialog.vue'
import { useMyReservations, getMyReservationsErrorMessage } from '@/composables/use-my-reservations'
import { useCancelReservation } from '@/composables/use-cancel-reservation'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import { checkInBadge, granularityLabelKey, type BadgeVariant } from '@/lib/booking/reservation-display'
import type { CheckInState } from '@/types/booking'

const { t } = useI18n()
const toast = useToast()

const query = useMyReservations()
const cancel = useCancelReservation()

const pendingCancelId = ref<string | null>(null)

const reservations = computed(() => query.data.value?.reservations ?? [])
const isLoading = computed(() => query.isLoading.value)
const isError = computed(() => query.isError.value)
const errorMessage = computed(() => getMyReservationsErrorMessage(query.error.value ?? null))
const isCancelPending = computed(() => cancel.isPending.value)

function checkInLabel(state: CheckInState): string {
  return t(checkInBadge(state).labelKey)
}

function checkInVariant(state: CheckInState): BadgeVariant {
  return checkInBadge(state).variant
}

function requestCancel(reservationId: string): void {
  pendingCancelId.value = reservationId
}

function dismissCancel(): void {
  if (!isCancelPending.value) {
    pendingCancelId.value = null
  }
}

async function confirmCancel(): Promise<void> {
  const reservationId = pendingCancelId.value
  if (reservationId === null) {
    return
  }
  try {
    await cancel.mutateAsync(reservationId)
    toast.success(t('booking.cancel.successToast'))
  } catch {
    toast.error(t('booking.cancel.errorToast'))
    await query.refetch()
  } finally {
    pendingCancelId.value = null
  }
}
</script>

<template>
  <section class="reservation-list">
    <p v-if="isError" class="reservation-list__notice">{{ errorMessage }}</p>
    <p v-else-if="!isLoading && reservations.length === 0" class="reservation-list__notice">
      {{ t('booking.reservations.empty') }}
    </p>
    <ReservationCard
      v-for="reservation in reservations"
      :key="reservation.id"
      :reservation="reservation"
      :granularity-label="t(granularityLabelKey(reservation.granularity))"
      :check-in-label="checkInLabel(reservation.checkInState)"
      :check-in-variant="checkInVariant(reservation.checkInState)"
      :cancel-label="t('booking.cancel.label')"
      :cancel-aria="t('booking.cancel.aria')"
      :is-cancelling="isCancelPending && pendingCancelId === reservation.id"
      @cancel="requestCancel"
    />

    <ConfirmDialog
      :open="pendingCancelId !== null"
      :title="t('booking.cancel.label')"
      :message="t('booking.cancel.confirm')"
      :confirm-label="t('booking.confirm.confirmLabel')"
      :dismiss-label="t('booking.confirm.dismissLabel')"
      :dismiss-aria-label="t('booking.confirm.dismissAria')"
      :pending-label="t('booking.cancel.pending')"
      :is-pending="isCancelPending"
      @confirm="confirmCancel"
      @dismiss="dismissCancel"
    />
  </section>
</template>

<style scoped>
.reservation-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
}

.reservation-list__notice {
  color: var(--color-text-muted);
  margin: var(--spacing-sm) 0;
}
</style>
