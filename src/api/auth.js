import request from '../utils/request'

// 用户注册
export function register(data) {
  // 将数据转换为form-urlencoded格式
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  formData.append('email', data.email)
  formData.append('password', data.password)
  formData.append('grant_type', '')
  formData.append('scope', '')
  formData.append('client_id', '')
  formData.append('client_secret', '')
  
  return request({
    url: '/auth/register',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 用户登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      account: data.username,
      password: data.password
    }
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/auth/user',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data
  })
}

// 忘记密码
export function forgotPassword(data) {
  return request({
    url: '/auth/forgot-password',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data
  })
}