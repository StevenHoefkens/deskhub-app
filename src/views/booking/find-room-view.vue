<script setup lang="ts">
import RoomFinder from '@/components/booking/room-finder/room-finder.vue'
</script>

<template>
  <main class="find-room-view">
    <div class="find-room-view__content">
      <RoomFinder />
    </div>
  </main>
</template>

<style scoped>
.find-room-view {
  padding: var(--spacing-md);
}

.find-room-view__content {
  max-width: 960px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .find-room-view {
    padding: var(--spacing-lg);
  }
}
</style>
