<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import RoomSearchForm, {
  type RoomSearchFormLabels,
} from '@/components/booking/room-search-form/room-search-form.vue'
import RoomCard from '@/components/booking/room-card/room-card.vue'
import { useRoomSearch, getRoomSearchErrorMessage } from '@/composables/use-room-search'
import { useReserveRoom } from '@/composables/use-reserve-room'
import { useToast } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'
import { validateRoomSearch } from '@/validation/room'
import { fieldErrorMap } from '@/validation/reservation'
import type { RoomSearchParams } from '@/types/booking'

const { t } = useI18n()
const toast = useToast()

const values = reactive<Partial<RoomSearchParams>>({})
const errors = reactive<Record<string, string>>({})
const submittedParams = ref<RoomSearchParams | null>(null)
const reservingRoomId = ref<string | null>(null)

const search = useRoomSearch(() => submittedParams.value)
const reserve = useReserveRoom()

const results = computed(() => search.data.value)
const isSearching = computed(() => search.isFetching.value)
const isSearchError = computed(() => search.isError.value)
const searchErrorMessage = computed(() => getRoomSearchErrorMessage(search.error.value ?? null))

const labels = computed<RoomSearchFormLabels>(() => ({
  title: t('booking.findRoom.title'),
  date: t('booking.roomSearch.dateLabel'),
  dateAria: t('booking.roomSearch.dateAria'),
  from: t('booking.roomSearch.fromLabel'),
  fromAria: t('booking.roomSearch.fromAria'),
  to: t('booking.roomSearch.toLabel'),
  toAria: t('booking.roomSearch.toAria'),
  timeHelp: t('booking.roomSearch.timeHelp'),
  capacity: t('booking.roomSearch.capacityLabel'),
  capacityAria: t('booking.roomSearch.capacityAria'),
  capacityHelp: t('booking.roomSearch.capacityHelp'),
  facilities: t('booking.roomSearch.tagsLabel'),
  facilitiesHelp: t('booking.roomSearch.tagsHelp'),
  facilitiesAdd: t('booking.roomSearch.tagsAddAria'),
  facilitiesRemove: t('booking.roomSearch.tagRemoveAria'),
  submit: t('booking.roomSearch.submitLabel'),
  submitAria: t('booking.roomSearch.submitAria'),
}))

const floorLabel = computed(() => t('booking.room.floorLabel'))
const capacityLabel = computed(() => t('booking.room.capacityLabel'))

function clearErrors(): void {
  for (const key of Object.keys(errors)) {
    delete errors[key]
  }
}

function updateField<K extends keyof RoomSearchParams>(
  field: K,
  value: RoomSearchParams[K] | undefined,
): void {
  values[field] = value
  delete errors[field]
}

function onSearch(): void {
  const problems = validateRoomSearch(values)
  clearErrors()
  if (problems.length > 0) {
    Object.assign(errors, fieldErrorMap(problems))
    toast.error(t('booking.roomSearch.errorToast'))
    return
  }
  const { date, startTime, endTime, minCapacity, tags } = values
  if (date === undefined || startTime === undefined || endTime === undefined) {
    return
  }
  submittedParams.value = {
    date,
    startTime,
    endTime,
    minCapacity,
    tags: tags && tags.length > 0 ? tags : undefined,
  }
}

async function onReserve(roomId: string): Promise<void> {
  const params = submittedParams.value
  if (params === null) {
    return
  }
  reservingRoomId.value = roomId
  try {
    await reserve.mutateAsync({
      roomId,
      body: { date: params.date, startTime: params.startTime, endTime: params.endTime },
    })
    toast.success(t('booking.roomReserve.successToast'))
  } catch {
    toast.error(t('booking.roomReserve.errorToast'))
  } finally {
    reservingRoomId.value = null
    await search.refetch()
  }
}
</script>

<template>
  <section class="room-finder">
    <RoomSearchForm
      :values="values"
      :errors="errors"
      :labels="labels"
      :is-submitting="isSearching"
      @update-date="(value: string) => updateField('date', value)"
      @update-start-time="(value: string) => updateField('startTime', value)"
      @update-end-time="(value: string) => updateField('endTime', value)"
      @update-min-capacity="(value: number | undefined) => updateField('minCapacity', value)"
      @update-tags="(value: string[]) => updateField('tags', value)"
      @submit="onSearch"
    />

    <div class="room-finder__results" aria-live="polite">
      <p v-if="isSearchError" class="room-finder__notice">{{ searchErrorMessage }}</p>
      <p v-else-if="results && results.rooms.length === 0" class="room-finder__notice">
        {{ t('booking.roomResults.empty') }}
      </p>
      <RoomCard
        v-for="room in results?.rooms ?? []"
        :key="room.roomId"
        :room="room"
        :floor-label="floorLabel"
        :capacity-label="capacityLabel"
        :reserve-label="t('booking.room.reserveLabel')"
        :reserve-aria="t('booking.room.reserveAria')"
        :pending-label="t('booking.roomReserve.pending')"
        :is-reserving="reservingRoomId === room.roomId"
        @reserve="onReserve"
      />
    </div>
  </section>
</template>

<style scoped>
.room-finder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.room-finder__results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-card);
}

.room-finder__notice {
  color: var(--color-text-muted);
  margin: var(--spacing-sm) 0;
}

@media (max-width: 640px) {
  .room-finder {
    gap: var(--spacing-md);
  }
}
</style>
