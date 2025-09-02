import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  {path: '/Index', component: Index, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    if (from.path !== '/login') {
      ElMessage.warning('请先登录后再访问该页面')
    }
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router