import request from '../utils/request'

// 用户注册
export function register(data) {
  return request({
    url: '/v1/auth/register',
    method: 'post',
    data
  })
}

// 用户登录
export function login(data) {
  return request({
    url: '/v1/auth/login',
    method: 'post',
    data
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/v1/auth/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/v1/auth/user',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/v1/auth/change-password',
    method: 'post',
    data
  })
}

// 忘记密码
export function forgotPassword(data) {
  return request({
    url: '/v1/auth/forgot-password',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/v1/auth/reset-password',
    method: 'post',
    data
  })
}