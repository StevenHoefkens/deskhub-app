<script setup lang="ts">
import { onMounted } from 'vue'
import LocaleToggle from '@/components/shared/ui/locale-toggle/locale-toggle.vue'
import LoginErrorAlert from '@/components/auth/login-error-alert/login-error-alert.vue'
import { useLoginError } from '@/composables/use-login-error'
import { useSsoLogin } from '@/composables/use-sso-login'
import { useI18n } from '@/lib/i18n/use-i18n'
import { useToast } from '@/lib/toast'

const LOGIN_ERROR_TOAST_DURATION_MS = 5000

const { errorState, messageKey, isRetryable, returnUrl } = useLoginError()
const { signIn } = useSsoLogin()
const { locale, setLocale, t } = useI18n()
const toast = useToast()

function onSignIn(): void {
  signIn(returnUrl.value)
}

onMounted(() => {
  if (errorState.value) {
    toast.error(t('login.toast.error'), { duration: LOGIN_ERROR_TOAST_DURATION_MS })
  }
})
</script>

<template>
  <div class="login-card">
    <LocaleToggle
      class="login-card__locale"
      :model-value="locale"
      :label="t('login.locale.aria')"
      @update:model-value="setLocale"
    />
    <h1 class="login-card__title">{{ t('app.name') }}</h1>
    <p class="login-card__prompt">{{ t('login.prompt') }}</p>
    <button
      class="login-card__sign-in"
      type="button"
      :aria-label="t('login.signIn.aria')"
      @click="onSignIn"
    >
      {{ t('login.signIn.label') }}
    </button>
    <LoginErrorAlert
      v-if="errorState && messageKey"
      class="login-card__error"
      :message="t(messageKey)"
      :retryable="isRetryable"
      :retry-label="t('login.retry.label')"
      :retry-aria-label="t('login.retry.aria')"
      @retry="onSignIn"
    />
  </div>
</template>

<style scoped>
.login-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
}

.login-card__locale {
  align-self: flex-end;
}

.login-card__title {
  color: var(--color-text);
  margin: var(--spacing-md);
}

.login-card__prompt {
  color: var(--color-text-muted);
  margin: var(--spacing-sm);
}

.login-card__sign-in {
  background: var(--color-surface-alt);
  color: var(--color-text);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
}

.login-card__error {
  margin-block-start: var(--spacing-md);
}
</style>
