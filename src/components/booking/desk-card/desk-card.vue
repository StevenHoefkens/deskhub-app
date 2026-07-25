<script setup lang="ts">
import type { AvailableDesk } from '@/types/booking'

const props = defineProps<{
  desk: AvailableDesk
  reserveLabel: string
  reserveAria: string
  pendingLabel: string
  isReserving?: boolean
}>()

const emit = defineEmits<{ reserve: [string] }>()
</script>

<template>
  <div class="desk-card">
    <p class="desk-card__label">{{ props.desk.deskId }}</p>
    <p class="desk-card__location">{{ props.desk.zoneId }} · {{ props.desk.floor }}</p>
    <p v-if="props.desk.tags.length > 0" class="desk-card__tags">{{ props.desk.tags.join(', ') }}</p>
    <p v-if="isReserving" class="desk-card__status">{{ pendingLabel }}</p>
    <button
      type="button"
      class="desk-card__reserve"
      :aria-label="reserveAria"
      :disabled="isReserving"
      @click="emit('reserve', props.desk.deskId)"
    >
      {{ reserveLabel }}
    </button>
  </div>
</template>

<style scoped>
.desk-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.desk-card__label {
  color: var(--color-text);
  margin: 0;
}

.desk-card__location,
.desk-card__tags,
.desk-card__status {
  color: var(--color-text-muted);
  margin: 0;
}

.desk-card__reserve {
  align-self: flex-start;
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
}

.desk-card__reserve:disabled {
  cursor: not-allowed;
}
</style>
