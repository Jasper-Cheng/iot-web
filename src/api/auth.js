import request from '../utils/request'

// 用户注册
export function register(data) {
  // 构建注册数据，只包含非空字段
  const registerData = {
    password: data.password,
    phone: data.phone
  }
  
  // 添加非必填字段（如果存在且不为空）
  if (data.nickname) registerData.nickname = data.nickname
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
      phone: data.phone,
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

// 获取微信登录二维码
export function getWechatQRCode() {
  return request({
    url: '/auth/login/qrcode',
    method: 'get'
  })
}

// 检查微信登录状态（轮询）
export function checkWechatLoginStatus(sceneId) {
  return request({
    url: '/auth/login/check_status',
    method: 'get',
    params: {
      scene_id: sceneId
    }
  })
}

// 绑定手机号（微信登录后）
export function bindPhoneForWechat(data) {
  return request({
    url: '/auth/login/bind_phone',
    method: 'post',
    data: {
      scene_id: data.scene_id,
      phone: data.phone
    }
  })
}

// 设置密码（微信登录后）
export function setPassword(data) {
  return request({
    url: '/auth/set_password',
    method: 'post',
    data: {
      password: data.password
    }
  })
}

// 获取 RSA 公钥
export function getRSAPublicKey() {
  return request({
    url: '/auth/rsa_public_key',
    method: 'get'
  })
}
