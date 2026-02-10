import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'
import envConfig from '../config/env.js'

let isHandlingUnauthorized = false

const baseURL = `${envConfig.baseUrl.replace(/\/$/, '')}/v1/client`

const request = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})


request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  // 调试日志（仅在开发环境）
  if (import.meta.env.DEV) {
    const paramsStr = config.params ? Object.entries(config.params).map(([key, value]) => `${key}=${value}`).join('&') : ''
    const urlWithParams = paramsStr ? `${config.baseURL}${config.url}?${paramsStr}` : `${config.baseURL}${config.url}`
    console.log('[REQUEST]', config.method?.toUpperCase(), urlWithParams)
  }
  
  return config
}, error => {
  console.error('Request error:', error)
  return Promise.reject(error)
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401: {
          if (!isHandlingUnauthorized) {
            isHandlingUnauthorized = true
            // 清理本地状态
            const currentPath = router.currentRoute?.value?.fullPath || (window.location.pathname + window.location.search)
            // 已在登录页则不再跳转
            const alreadyOnLogin = (router.currentRoute?.value?.path === '/login') || window.location.pathname === '/login'
            if (!alreadyOnLogin) {
              ElMessage.error('登录已过期，请重新登录')
              router.push({ path: '/login', query: { redirect: currentPath } }).catch(() => {})
            } else {
              ElMessage.error('登录失败')
              isHandlingUnauthorized = false
            }
          }
          break
        }
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 405:
          ElMessage.error('请求方法不被允许')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.detail || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default request