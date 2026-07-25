import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      typecheck: {
        enabled: true,
        checker: 'vue-tsc',
        tsconfig: './tsconfig.vitest.json',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
      },
    },
  }),
)
