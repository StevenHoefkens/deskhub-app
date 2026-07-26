<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string[]
  inputId: string
  addAriaLabel: string
  removeAriaLabel: string
  ariaDescribedby?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const draft = ref('')

function addTag(): void {
  const value = draft.value.trim()
  draft.value = ''
  if (value === '' || props.modelValue.includes(value)) {
    return
  }
  emit('update:modelValue', [...props.modelValue, value])
}

function removeTag(tag: string): void {
  emit(
    'update:modelValue',
    props.modelValue.filter((current) => current !== tag),
  )
}
</script>

<template>
  <div class="tag-filter-input">
    <ul v-if="modelValue.length > 0" class="tag-filter-input__chips">
      <li v-for="tag in modelValue" :key="tag" class="tag-filter-input__chip">
        <span>{{ tag }}</span>
        <button type="button" :aria-label="`${removeAriaLabel}: ${tag}`" @click="removeTag(tag)">
          &times;
        </button>
      </li>
    </ul>
    <input
      :id="inputId"
      v-model="draft"
      type="text"
      class="tag-filter-input__field"
      :aria-label="addAriaLabel"
      :aria-describedby="ariaDescribedby"
      @keydown.enter.prevent="addTag"
    />
  </div>
</template>

<style scoped>
.tag-filter-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tag-filter-input__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag-filter-input__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-surface-alt);
  border-radius: var(--radius-card);
  color: var(--color-text);
}

.tag-filter-input__chip button {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.tag-filter-input__field {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text);
}
</style>
