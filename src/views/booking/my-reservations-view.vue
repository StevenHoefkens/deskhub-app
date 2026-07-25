<script setup lang="ts">
import ReservationList from '@/components/booking/reservation-list/reservation-list.vue'
import { useI18n } from '@/lib/i18n/use-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="my-reservations-view">
    <header class="my-reservations-view__header">
      <h1 class="my-reservations-view__title">{{ t('booking.reservations.title') }}</h1>
    </header>
    <div class="my-reservations-view__content">
      <ReservationList />
    </div>
  </main>
</template>

<style scoped>
.my-reservations-view {
  padding: var(--spacing-md);
}

.my-reservations-view__header,
.my-reservations-view__content {
  max-width: 800px;
  margin: 0 auto;
}

.my-reservations-view__title {
  color: var(--color-text);
}

@media (min-width: 768px) {
  .my-reservations-view {
    padding: var(--spacing-lg);
  }
}
</style>
