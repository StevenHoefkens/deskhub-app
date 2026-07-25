import { createRouter, createWebHistory } from 'vue-router'
import { LOGIN_ROUTE_PATH, HOME_PATH } from '@/config/auth'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: HOME_PATH, redirect: LOGIN_ROUTE_PATH },
    {
      path: LOGIN_ROUTE_PATH,
      name: 'login',
      component: () => import('@/views/auth/login-view.vue'),
    },
  ],
})
