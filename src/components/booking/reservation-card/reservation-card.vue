<script setup lang="ts">
import StatusBadge from '@/components/shared/ui/status-badge/status-badge.vue'
import type { BadgeVariant } from '@/lib/booking/reservation-display'
import type { ReservationSummary } from '@/types/booking'

const props = defineProps<{
  reservation: ReservationSummary
  granularityLabel: string
  checkInLabel: string
  checkInVariant: BadgeVariant
  slotRangeLabel: string
  cancelLabel: string
  cancelAria: string
  isCancelling?: boolean
  showCheckIn?: boolean
  checkInActionLabel: string
  checkInActionAria: string
  checkInPendingLabel: string
  isCheckingIn?: boolean
}>()

const emit = defineEmits<{ cancel: [string]; 'check-in': [string] }>()
</script>

<template>
  <div class="reservation-card">
    <template v-if="props.reservation.resourceType === 'desk'">
      <p class="reservation-card__label">{{ props.reservation.deskId }}</p>
      <p class="reservation-card__zone">{{ props.reservation.zoneId }}</p>
      <p class="reservation-card__floor">{{ props.reservation.floor }}</p>
      <p class="reservation-card__date">{{ props.reservation.date }}</p>
      <p class="reservation-card__granularity">{{ granularityLabel }}</p>
      <StatusBadge :label="checkInLabel" :variant="checkInVariant" />
    </template>
    <template v-else>
      <p class="reservation-card__label">{{ props.reservation.roomId }}</p>
      <p class="reservation-card__floor">{{ props.reservation.floor }}</p>
      <p class="reservation-card__date">{{ props.reservation.date }}</p>
      <p class="reservation-card__slot">{{ slotRangeLabel }}</p>
    </template>
    <div class="reservation-card__actions">
      <button
        v-if="props.showCheckIn"
        type="button"
        class="reservation-card__check-in"
        :aria-label="checkInActionAria"
        :disabled="isCheckingIn"
        @click="emit('check-in', props.reservation.id)"
      >
        {{ checkInActionLabel }}
      </button>
      <button
        type="button"
        class="reservation-card__cancel"
        :aria-label="cancelAria"
        :disabled="isCancelling"
        @click="emit('cancel', props.reservation.id)"
      >
        {{ cancelLabel }}
      </button>
    </div>
    <p v-if="props.showCheckIn && props.isCheckingIn" class="reservation-card__check-in-status">
      {{ checkInPendingLabel }}
    </p>
  </div>
</template>

<style scoped>
.reservation-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.reservation-card__label {
  color: var(--color-text);
  margin: 0;
}

.reservation-card__zone,
.reservation-card__floor,
.reservation-card__date,
.reservation-card__granularity,
.reservation-card__slot,
.reservation-card__check-in-status {
  color: var(--color-text-muted);
  margin: 0;
}

.reservation-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.reservation-card__check-in,
.reservation-card__cancel {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
}

.reservation-card__check-in:disabled,
.reservation-card__cancel:disabled {
  cursor: not-allowed;
}
</style>
