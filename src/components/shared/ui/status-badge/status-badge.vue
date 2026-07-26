<script setup lang="ts">
import type { BadgeVariant } from '@/lib/booking/reservation-display'

withDefaults(defineProps<{ label: string; variant?: BadgeVariant }>(), {
  variant: 'neutral',
})
</script>

<template>
  <span class="status-badge" :class="`status-badge--${variant}`">{{ label }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: var(--spacing-sm);
  border-radius: var(--radius-card);
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
}

.status-badge--success {
  color: var(--color-text);
}
</style>
