<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel: string
  dismissLabel: string
  dismissAriaLabel?: string
  pendingLabel?: string
  isPending?: boolean
}>()

const emit = defineEmits<{ confirm: []; dismiss: [] }>()

let instanceCount = 0
const titleId = `confirm-dialog-title-${(instanceCount += 1)}`

const confirmButton = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function tryDismiss(): void {
  if (!props.isPending) {
    emit('dismiss')
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      confirmButton.value?.focus()
    } else if (previouslyFocused) {
      previouslyFocused.focus()
      previouslyFocused = null
    }
  },
)
</script>

<template>
  <div
    v-if="open"
    class="confirm-dialog__backdrop"
    @click.self="tryDismiss"
    @keydown.esc="tryDismiss"
  >
    <div class="confirm-dialog" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <h2 :id="titleId" class="confirm-dialog__title">{{ title }}</h2>
      <p class="confirm-dialog__message">{{ message }}</p>
      <p v-if="isPending && pendingLabel" class="confirm-dialog__status" aria-live="polite">
        {{ pendingLabel }}
      </p>
      <div class="confirm-dialog__actions">
        <button
          type="button"
          class="confirm-dialog__dismiss"
          :aria-label="dismissAriaLabel"
          :disabled="isPending"
          @click="tryDismiss"
        >
          {{ dismissLabel }}
        </button>
        <button
          ref="confirmButton"
          type="button"
          class="confirm-dialog__confirm"
          :disabled="isPending"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-dialog__backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 40%);
  padding: var(--spacing-md);
}

.confirm-dialog {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
}

.confirm-dialog__title {
  color: var(--color-text);
  margin: 0;
}

.confirm-dialog__message,
.confirm-dialog__status {
  color: var(--color-text-muted);
  margin: 0;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.confirm-dialog__dismiss,
.confirm-dialog__confirm {
  padding: var(--spacing-sm);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
}

.confirm-dialog__dismiss {
  background: var(--color-surface);
}

.confirm-dialog__confirm {
  background: var(--color-surface-alt);
}

.confirm-dialog__confirm:disabled,
.confirm-dialog__dismiss:disabled {
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .confirm-dialog__backdrop {
    padding: 0;
  }

  .confirm-dialog {
    max-width: none;
    height: 100%;
    border-radius: 0;
  }
}
</style>
