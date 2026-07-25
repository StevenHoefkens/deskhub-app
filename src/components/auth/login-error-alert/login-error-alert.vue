<script setup lang="ts">
defineProps<{
  message: string
  retryable: boolean
  retryLabel: string
  retryAriaLabel: string
}>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="login-error-alert" role="alert" aria-live="assertive">
    <p class="login-error-alert__message">{{ message }}</p>
    <button
      v-if="retryable"
      type="button"
      class="login-error-alert__retry"
      :aria-label="retryAriaLabel"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

<style scoped>
.login-error-alert {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.login-error-alert__message {
  color: var(--color-text);
  margin: var(--spacing-sm);
}

.login-error-alert__retry {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
}
</style>
