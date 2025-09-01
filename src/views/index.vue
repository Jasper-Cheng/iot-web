import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import DeviceList from '@/views/DeviceList.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/devices', component: DeviceList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
