<script setup lang="ts">
import FormField from '@/components/shared/ui/form-field/form-field.vue'
import TagFilterInput from '@/components/booking/tag-filter-input/tag-filter-input.vue'
import type { DeskSearchParams, Granularity } from '@/types/booking'

export interface GranularityOption {
  value: Granularity
  label: string
}

export interface DeskSearchFormLabels {
  title: string
  date: string
  dateAria: string
  when: string
  whenAria: string
  tags: string
  tagsHelp: string
  tagsAdd: string
  tagRemove: string
  submit: string
  submitAria: string
}

const props = defineProps<{
  values: Partial<DeskSearchParams>
  errors: Record<string, string>
  granularityOptions: GranularityOption[]
  labels: DeskSearchFormLabels
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  updateDate: [string]
  updateGranularity: [Granularity]
  updateTags: [string[]]
  submit: []
}>()

const DATE_FIELD_ID = 'desk-search-date'
const WHEN_FIELD_ID = 'desk-search-when'
const TAGS_FIELD_ID = 'desk-search-tags'

function onGranularityChange(event: Event): void {
  emit('updateGranularity', (event.target as HTMLSelectElement).value as Granularity)
}
</script>

<template>
  <form class="desk-search-form" @submit.prevent="emit('submit')">
    <h2 class="desk-search-form__title">{{ labels.title }}</h2>

    <FormField v-slot="{ errorId, hasError }" :label="labels.date" :field-id="DATE_FIELD_ID" required :error="errors.date">
      <input
        :id="DATE_FIELD_ID"
        type="date"
        class="desk-search-form__control"
        :value="props.values.date"
        :aria-label="labels.dateAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @input="emit('updateDate', ($event.target as HTMLInputElement).value)"
      />
    </FormField>

    <FormField v-slot="{ errorId, hasError }" :label="labels.when" :field-id="WHEN_FIELD_ID" required :error="errors.granularity">
      <select
        :id="WHEN_FIELD_ID"
        class="desk-search-form__control"
        :value="props.values.granularity"
        :aria-label="labels.whenAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @change="onGranularityChange"
      >
        <option v-for="option in granularityOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </FormField>

    <FormField :label="labels.tags" :field-id="TAGS_FIELD_ID" :help-text="labels.tagsHelp">
      <TagFilterInput
        :model-value="props.values.tags ?? []"
        :input-id="TAGS_FIELD_ID"
        :add-aria-label="labels.tagsAdd"
        :remove-aria-label="labels.tagRemove"
        @update:model-value="emit('updateTags', $event)"
      />
    </FormField>

    <button
      type="submit"
      class="desk-search-form__submit"
      :aria-label="labels.submitAria"
      :disabled="isSubmitting"
    >
      {{ labels.submit }}
    </button>
  </form>
</template>

<style scoped>
.desk-search-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
}

.desk-search-form__title {
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
}

.desk-search-form__control {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text);
}

.desk-search-form__submit {
  background: var(--color-surface-alt);
  color: var(--color-text);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
}

.desk-search-form__submit:disabled {
  cursor: not-allowed;
}
</style>
