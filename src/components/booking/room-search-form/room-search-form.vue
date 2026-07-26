<script setup lang="ts">
import FormField from '@/components/shared/ui/form-field/form-field.vue'
import TagFilterInput from '@/components/booking/tag-filter-input/tag-filter-input.vue'
import type { RoomSearchParams } from '@/types/booking'

export interface RoomSearchFormLabels {
  title: string
  date: string
  dateAria: string
  from: string
  fromAria: string
  to: string
  toAria: string
  timeHelp: string
  capacity: string
  capacityAria: string
  capacityHelp: string
  facilities: string
  facilitiesHelp: string
  facilitiesAdd: string
  facilitiesRemove: string
  submit: string
  submitAria: string
}

const props = defineProps<{
  values: Partial<RoomSearchParams>
  errors: Record<string, string>
  labels: RoomSearchFormLabels
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  updateDate: [string]
  updateStartTime: [string]
  updateEndTime: [string]
  updateMinCapacity: [number | undefined]
  updateTags: [string[]]
  submit: []
}>()

const DATE_FIELD_ID = 'room-search-date'
const START_FIELD_ID = 'room-search-start'
const END_FIELD_ID = 'room-search-end'
const CAPACITY_FIELD_ID = 'room-search-capacity'
const TAGS_FIELD_ID = 'room-search-tags'

function onCapacityInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  emit('updateMinCapacity', raw === '' ? undefined : Number(raw))
}
</script>

<template>
  <form class="room-search-form" @submit.prevent="emit('submit')">
    <h2 class="room-search-form__title">{{ labels.title }}</h2>

    <FormField
      v-slot="{ errorId, hasError }"
      :label="labels.date"
      :field-id="DATE_FIELD_ID"
      required
      :error="errors.date"
    >
      <input
        :id="DATE_FIELD_ID"
        type="date"
        class="room-search-form__control"
        :value="props.values.date"
        :aria-label="labels.dateAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @input="emit('updateDate', ($event.target as HTMLInputElement).value)"
      />
    </FormField>

    <FormField
      v-slot="{ errorId, hasError }"
      :label="labels.from"
      :field-id="START_FIELD_ID"
      required
      :error="errors.startTime"
      :help-text="labels.timeHelp"
    >
      <input
        :id="START_FIELD_ID"
        type="time"
        class="room-search-form__control"
        :value="props.values.startTime"
        :aria-label="labels.fromAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @input="emit('updateStartTime', ($event.target as HTMLInputElement).value)"
      />
    </FormField>

    <FormField
      v-slot="{ errorId, hasError }"
      :label="labels.to"
      :field-id="END_FIELD_ID"
      required
      :error="errors.endTime"
      :help-text="labels.timeHelp"
    >
      <input
        :id="END_FIELD_ID"
        type="time"
        class="room-search-form__control"
        :value="props.values.endTime"
        :aria-label="labels.toAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @input="emit('updateEndTime', ($event.target as HTMLInputElement).value)"
      />
    </FormField>

    <FormField
      v-slot="{ errorId, hasError }"
      :label="labels.capacity"
      :field-id="CAPACITY_FIELD_ID"
      :error="errors.minCapacity"
      :help-text="labels.capacityHelp"
    >
      <input
        :id="CAPACITY_FIELD_ID"
        type="number"
        min="1"
        class="room-search-form__control"
        :value="props.values.minCapacity"
        :aria-label="labels.capacityAria"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        @input="onCapacityInput"
      />
    </FormField>

    <FormField :label="labels.facilities" :field-id="TAGS_FIELD_ID" :help-text="labels.facilitiesHelp">
      <TagFilterInput
        :model-value="props.values.tags ?? []"
        :input-id="TAGS_FIELD_ID"
        :add-aria-label="labels.facilitiesAdd"
        :remove-aria-label="labels.facilitiesRemove"
        @update:model-value="emit('updateTags', $event)"
      />
    </FormField>

    <button
      type="submit"
      class="room-search-form__submit"
      :aria-label="labels.submitAria"
      :disabled="isSubmitting"
    >
      {{ labels.submit }}
    </button>
  </form>
</template>

<style scoped>
.room-search-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
}

.room-search-form__title {
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
}

.room-search-form__control {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text);
}

.room-search-form__submit {
  background: var(--color-surface-alt);
  color: var(--color-text);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
}

.room-search-form__submit:disabled {
  cursor: not-allowed;
}
</style>
