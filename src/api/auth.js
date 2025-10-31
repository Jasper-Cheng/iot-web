import request from '../utils/request'

// 用户注册
export function register(data) {
  // 构建注册数据，只包含非空字段
  const registerData = {
    account: data.username,
    password: data.password
  }
  
  // 添加非必填字段（如果存在且不为空）
  if (data.phone) registerData.phone = data.phone
  if (data.name) registerData.name = data.name
  if (data.gender) registerData.gender = data.gender
  if (data.email) registerData.email = data.email
  if (data.avatar) registerData.avatar = data.avatar
  
  return request({
    url: '/auth/register',
    method: 'post',
    data: registerData
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
