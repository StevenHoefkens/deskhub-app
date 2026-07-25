<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ToastHost } from '@/lib/toast'
import { useI18n } from '@/lib/i18n/use-i18n'

const { t } = useI18n()
</script>

<template>
  <RouterView />
  <ToastHost :dismiss-label="t('toast.dismiss')" />
</template>
