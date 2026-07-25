<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  fieldId: string
  required?: boolean
  error?: string
  helpText?: string
}>()

const errorId = computed(() => `${props.fieldId}-error`)
</script>

<template>
  <div class="form-field">
    <label class="form-field__label" :for="fieldId">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <slot :error-id="errorId" :has-error="!!error" />
    <p v-if="error" :id="errorId" class="form-field__error" role="alert" aria-live="assertive">
      {{ error }}
    </p>
    <p v-else-if="helpText" class="form-field__help">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-field__label {
  color: var(--color-text);
}

.form-field__error {
  color: var(--color-text);
  margin: 0;
}

.form-field__help {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
