<script setup lang="ts">
import StatusBadge from '@/components/shared/ui/status-badge/status-badge.vue'
import type { BadgeVariant } from '@/lib/booking/reservation-display'
import type { ReservationSummary } from '@/types/booking'

const props = defineProps<{
  reservation: ReservationSummary
  granularityLabel: string
  checkInLabel: string
  checkInVariant: BadgeVariant
  cancelLabel: string
  cancelAria: string
  isCancelling?: boolean
}>()

const emit = defineEmits<{ cancel: [string] }>()
</script>

<template>
  <div class="reservation-card">
    <p class="reservation-card__label">{{ props.reservation.deskId }}</p>
    <p class="reservation-card__zone">{{ props.reservation.zoneId }}</p>
    <p class="reservation-card__floor">{{ props.reservation.floor }}</p>
    <p class="reservation-card__date">{{ props.reservation.date }}</p>
    <p class="reservation-card__granularity">{{ granularityLabel }}</p>
    <StatusBadge :label="checkInLabel" :variant="checkInVariant" />
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
.reservation-card__granularity {
  color: var(--color-text-muted);
  margin: 0;
}

.reservation-card__cancel {
  align-self: flex-start;
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
}

.reservation-card__cancel:disabled {
  cursor: not-allowed;
}
</style>
