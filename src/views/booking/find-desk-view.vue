<script setup lang="ts">
import DeskFinder from '@/components/booking/desk-finder/desk-finder.vue'
</script>

<template>
  <main class="find-desk-view">
    <div class="find-desk-view__content">
      <DeskFinder />
    </div>
  </main>
</template>

<style scoped>
.find-desk-view {
  padding: var(--spacing-md);
}

.find-desk-view__content {
  max-width: 960px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .find-desk-view {
    padding: var(--spacing-lg);
  }
}
</style>
