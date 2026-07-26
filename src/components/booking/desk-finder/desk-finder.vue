<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DeskSearchForm, {
  type GranularityOption,
  type DeskSearchFormLabels,
} from '@/components/booking/desk-search-form/desk-search-form.vue'
import DeskCard from '@/components/booking/desk-card/desk-card.vue'
import { useDeskSearch, getDeskSearchErrorMessage } from '@/composables/use-desk-search'
import { useReserveDesk } from '@/composables/use-reserve-desk'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import { GRANULARITY_VALUES } from '@/lib/booking/granularity'
import { granularityLabelKey } from '@/lib/booking/reservation-display'
import { validateDeskSearch, fieldErrorMap } from '@/validation/reservation'
import type { DeskSearchParams, Granularity } from '@/types/booking'

const { t } = useI18n()
const toast = useToast()

const values = reactive<Partial<DeskSearchParams>>({})
const errors = reactive<Record<string, string>>({})
const submittedParams = ref<DeskSearchParams | null>(null)
const reservingDeskId = ref<string | null>(null)

const search = useDeskSearch(() => submittedParams.value)
const reserve = useReserveDesk()

const results = computed(() => search.data.value)
const isSearching = computed(() => search.isFetching.value)
const isSearchError = computed(() => search.isError.value)
const searchErrorMessage = computed(() => getDeskSearchErrorMessage(search.error.value ?? null))

const granularityOptions = computed<GranularityOption[]>(() =>
  GRANULARITY_VALUES.map((value) => ({ value, label: t(granularityLabelKey(value)) })),
)

const labels = computed<DeskSearchFormLabels>(() => ({
  title: t('booking.findDesk.title'),
  date: t('booking.search.dateLabel'),
  dateAria: t('booking.search.dateAria'),
  when: t('booking.search.whenLabel'),
  whenAria: t('booking.search.whenAria'),
  tags: t('booking.search.tagsLabel'),
  tagsHelp: t('booking.search.tagsHelp'),
  tagsAdd: t('booking.search.tagsAddAria'),
  tagRemove: t('booking.search.tagRemoveAria'),
  submit: t('booking.search.submitLabel'),
  submitAria: t('booking.search.submitAria'),
}))

function clearErrors(): void {
  for (const key of Object.keys(errors)) {
    delete errors[key]
  }
}

function onUpdateDate(value: string): void {
  values.date = value
  delete errors.date
}

function onUpdateGranularity(value: Granularity): void {
  values.granularity = value
  delete errors.granularity
}

function onUpdateTags(value: string[]): void {
  values.tags = value
}

function onSearch(): void {
  const problems = validateDeskSearch(values)
  clearErrors()
  if (problems.length > 0) {
    Object.assign(errors, fieldErrorMap(problems))
    if (problems.some((problem) => problem.field === 'date')) {
      toast.error(t('booking.search.errorToast'))
    }
    return
  }
  const { date, granularity, tags } = values
  if (date === undefined || granularity === undefined) {
    return
  }
  submittedParams.value = {
    date,
    granularity,
    tags: tags && tags.length > 0 ? tags : undefined,
  }
}

async function onReserve(deskId: string): Promise<void> {
  const params = submittedParams.value
  if (params === null) {
    return
  }
  reservingDeskId.value = deskId
  try {
    await reserve.mutateAsync({ deskId, date: params.date, granularity: params.granularity })
    toast.success(t('booking.reserve.successToast'))
  } catch {
    toast.error(t('booking.reserve.errorToast'))
    await search.refetch()
  } finally {
    reservingDeskId.value = null
  }
}
</script>

<template>
  <section class="desk-finder">
    <DeskSearchForm
      :values="values"
      :errors="errors"
      :granularity-options="granularityOptions"
      :labels="labels"
      :is-submitting="isSearching"
      @update-date="onUpdateDate"
      @update-granularity="onUpdateGranularity"
      @update-tags="onUpdateTags"
      @submit="onSearch"
    />

    <div class="desk-finder__results" aria-live="polite">
      <p v-if="isSearchError" class="desk-finder__notice">{{ searchErrorMessage }}</p>
      <p v-else-if="results && results.noBookingAccess" class="desk-finder__notice">
        {{ t('booking.results.noAccess') }}
      </p>
      <p v-else-if="results && results.desks.length === 0" class="desk-finder__notice">
        {{ t('booking.results.empty') }}
      </p>
      <DeskCard
        v-for="desk in results?.desks ?? []"
        :key="desk.deskId"
        :desk="desk"
        :reserve-label="t('booking.desk.reserveLabel')"
        :reserve-aria="t('booking.desk.reserveAria')"
        :pending-label="t('booking.reserve.pending')"
        :is-reserving="reservingDeskId === desk.deskId"
        @reserve="onReserve"
      />
    </div>
  </section>
</template>

<style scoped>
.desk-finder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.desk-finder__results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.desk-finder__notice {
  color: var(--color-text-muted);
  margin: var(--spacing-sm) 0;
}

@media (max-width: 640px) {
  .desk-finder {
    gap: var(--spacing-md);
  }
}
</style>
