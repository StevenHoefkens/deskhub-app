<script setup lang="ts">
import { SUPPORTED_LOCALES, type Locale } from '@/types/auth'

defineProps<{ modelValue: Locale; label: string }>()
const emit = defineEmits<{ 'update:modelValue': [Locale] }>()
</script>

<template>
  <div class="locale-toggle" role="group" :aria-label="label">
    <button
      v-for="loc in SUPPORTED_LOCALES"
      :key="loc"
      type="button"
      class="locale-toggle__option"
      :class="{ 'is-active': loc === modelValue }"
      :aria-pressed="loc === modelValue"
      @click="emit('update:modelValue', loc)"
    >
      {{ loc.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.locale-toggle {
  display: inline-flex;
  gap: var(--spacing-sm);
  color: var(--color-text-muted);
}

.locale-toggle__option {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.locale-toggle__option.is-active {
  color: var(--color-text);
  font-weight: 700;
}
</style>
