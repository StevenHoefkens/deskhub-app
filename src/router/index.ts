import { createRouter, createWebHistory } from 'vue-router'
import { LOGIN_ROUTE_PATH, HOME_PATH } from '@/config/auth'

const FIND_DESK_ROUTE_PATH = '/desks'
const FIND_ROOM_ROUTE_PATH = '/rooms'
const MY_RESERVATIONS_ROUTE_PATH = '/reservations'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: HOME_PATH, redirect: LOGIN_ROUTE_PATH },
    {
      path: LOGIN_ROUTE_PATH,
      name: 'login',
      component: () => import('@/views/auth/login-view.vue'),
    },
    {
      path: FIND_DESK_ROUTE_PATH,
      name: 'find-desk',
      component: () => import('@/views/booking/find-desk-view.vue'),
    },
    {
      path: FIND_ROOM_ROUTE_PATH,
      name: 'find-room',
      component: () => import('@/views/booking/find-room-view.vue'),
    },
    {
      path: MY_RESERVATIONS_ROUTE_PATH,
      name: 'my-reservations',
      component: () => import('@/views/booking/my-reservations-view.vue'),
    },
  ],
})
