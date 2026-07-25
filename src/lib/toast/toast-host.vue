<script setup lang="ts">
import { useToast } from './use-toast'
import type { ToastVariant } from './toast-store'

withDefaults(defineProps<{ dismissLabel?: string }>(), { dismissLabel: 'Dismiss' })

const { toasts, dismiss } = useToast()

function ariaRole(variant: ToastVariant): 'alert' | 'status' {
  return variant === 'error' ? 'alert' : 'status'
}

function ariaLive(variant: ToastVariant): 'assertive' | 'polite' {
  return variant === 'error' ? 'assertive' : 'polite'
}
</script>

<template>
  <div class="toast-host" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast--${toast.variant}`]"
      :role="ariaRole(toast.variant)"
      :aria-live="ariaLive(toast.variant)"
    >
      <span class="toast__message">{{ toast.message }}</span>
      <button type="button" class="toast__dismiss" :aria-label="dismissLabel" @click="dismiss(toast.id)">
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  inset-block-start: var(--spacing-md);
  inset-inline-end: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  z-index: var(--z-toast);
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.toast__dismiss {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}
</style>
