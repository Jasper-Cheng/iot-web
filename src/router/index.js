import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import Widgets from '../views/Widgets.vue'
import Members from '../views/Members.vue'
import Mall from '../views/Mall.vue'
import Settings from '../views/Settings.vue'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/login', component: Login },
  { 
    path: '/', 
    component: Index, 
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', component: Home },
      { path: 'widgets', component: Widgets },
      { path: 'members', component: Members },
      { path: 'mall', component: Mall },
      { path: 'settings', component: Settings }
    ]
  },
  { path: '/', redirect: '/login' }
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