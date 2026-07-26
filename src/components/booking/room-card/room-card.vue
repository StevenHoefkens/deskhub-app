<script setup lang="ts">
import type { AvailableRoom } from '@/types/booking'

const props = defineProps<{
  room: AvailableRoom
  floorLabel: string
  capacityLabel: string
  reserveLabel: string
  reserveAria: string
  pendingLabel: string
  isReserving?: boolean
}>()

const emit = defineEmits<{ reserve: [string] }>()
</script>

<template>
  <div class="room-card">
    <p class="room-card__label">{{ props.room.roomId }}</p>
    <p class="room-card__floor">{{ floorLabel }} {{ props.room.floor }}</p>
    <p class="room-card__capacity">{{ capacityLabel }} {{ props.room.maxCapacity }}</p>
    <p v-if="props.room.tags.length > 0" class="room-card__tags">
      {{ props.room.tags.join(', ') }}
    </p>
    <p v-if="isReserving" class="room-card__status">{{ pendingLabel }}</p>
    <button
      type="button"
      class="room-card__reserve"
      :aria-label="reserveAria"
      :disabled="isReserving"
      @click="emit('reserve', props.room.roomId)"
    >
      {{ reserveLabel }}
    </button>
  </div>
</template>

<style scoped>
.room-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.room-card__label {
  color: var(--color-text);
  margin: 0;
}

.room-card__floor,
.room-card__capacity,
.room-card__tags,
.room-card__status {
  color: var(--color-text-muted);
  margin: 0;
}

.room-card__reserve {
  align-self: flex-start;
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
}

.room-card__reserve:disabled {
  cursor: not-allowed;
}
</style>
