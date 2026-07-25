<script setup lang="ts">
import LoginForm from '@/components/auth/login-form/login-form.vue'
</script>

<template>
  <main class="login-view">
    <LoginForm class="login-view__card" />
  </main>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--spacing-md);
}

.login-view__card {
  width: 100%;
  max-width: 400px;
}
</style>
