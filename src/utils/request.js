import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://localhost:8001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  // 添加CORS相关头部
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
  
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
    console.error('Response error:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          localStorage.removeItem('token')
          ElMessage.error('登录已过期，请重新登录')
          router.push('/login')
          break
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
          ElMessage.error(data?.message || '请求失败')
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