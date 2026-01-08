<template>
  <div class="login-overlay">
    <div class="login-modal">
      
      
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="var(--color-login-gradient-start)" stroke-width="2" fill="none"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="var(--color-login-gradient-start)" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <h1 class="platform-title">IoT 管理平台</h1>
        <p class="platform-subtitle">智能设备管理与监控系统</p>
      </div>

      <!-- 登录/注册切换 -->
      <div class="form-options" style="justify-content: center;">
        <label class="checkbox-container" style="gap:8px;cursor:default;">
          <span class="checkmark" style="display:none"></span>
          <span style="color: var(--color-login-text-primary); font-weight:600;font-size: 16px;">{{ isRegister ? '注册' : '登录' }}</span>
        </label>
      </div>

      <!-- 登录表单 -->
      <form v-if="!isRegister" class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone"
            placeholder="请输入手机号"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password"
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="formData.rememberMe" @change="onRememberMeChange" />
            <span class="checkmark"></span>
            记住我
          </label>
          <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码?</a>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>

        <!-- 错误信息显示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- 微信登录按钮 -->
        <div class="social-login-divider">
          <span class="divider-line"></span>
          <span class="divider-text">或</span>
          <span class="divider-line"></span>
        </div>
        <button type="button" class="wechat-login-btn" @click="handleWechatLogin" :disabled="isLoading">
          <svg class="wechat-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.496-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.166c-2.016 0-3.666 1.615-3.873 3.682-2.063.177-3.692 1.851-3.692 3.932 0 2.18 1.906 3.944 4.256 3.944a4.256 4.256 0 0 0 3.518-1.848.695.695 0 0 1 .578-.098l1.432.838a.2.2 0 0 0 .228-.01.202.202 0 0 0 .08-.2l-.299-1.137a.585.585 0 0 1 .217-.667c1.236-.946 2.015-2.317 2.015-3.832-.001-2.18-1.907-3.944-4.262-3.944zm-2.582 3.805c.358 0 .649.29.649.648a.642.642 0 0 1-.649.646.642.642 0 0 1-.647-.646c0-.358.29-.648.647-.648zm4.209 0c.358 0 .649.29.649.648a.642.642 0 0 1-.649.646.642.642 0 0 1-.647-.646c0-.358.29-.648.647-.648z"/>
          </svg>
          微信登录
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-else class="login-form" @submit.prevent="handleRegister">
        <!-- 头像选择区域 -->
        <div class="avatar-section">
          <AvatarSelector 
            v-model="registerData.avatar"
            type="person"
            @change="handleAvatarChange"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>电话 *</label>
            <input v-model="registerData.phone" type="tel" required placeholder="请输入电话号码">
          </div>
          <div class="form-group">
            <label>昵称 *</label>
            <input v-model="registerData.nickname" type="text" required placeholder="请输入昵称">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>密码 *</label>
            <input v-model="registerData.password" type="password" required placeholder="请输入密码">
          </div>
          <div class="form-group">
            <label>确认密码 *</label>
            <input v-model="registerData.confirmPassword" type="password" required placeholder="请再次输入密码">
          </div>
        </div>
        
        <!-- 基本信息 -->
        <div class="form-row">
          <div class="form-group">
            <label>性别 *</label>
            <select v-model="registerData.gender" required>
              <option value="other">其他</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div class="form-group">
            <label>邮件</label>
            <input v-model="registerData.email" type="email" placeholder="请输入邮箱地址">
          </div>
        </div>

        <div class="submit-button-container">
          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <!-- 底部链接：切换登录/注册 -->
      <div class="bottom-links">
        <span v-if="!isRegister">还没有账号? </span>
        <span v-else>已经有账号? </span>
        <a href="#" class="register-link" @click.prevent="toggleMode">{{ isRegister ? '去登录' : '立即注册' }}</a>
      </div>
    </div>

    <!-- 微信二维码登录弹窗 -->
    <div v-if="showWechatQR" class="wechat-qr-overlay" @click.self="closeWechatQR">
      <div class="wechat-qr-modal">
        <div class="qr-header">
          <h3>微信扫码登录</h3>
          <button class="qr-close-btn" @click="closeWechatQR">×</button>
        </div>
        <div class="qr-content">
          <div v-if="wechatQRLoading" class="qr-loading">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          <div v-else-if="wechatQRCode" class="qr-image-container">
            <img :src="wechatQRCode" alt="微信登录二维码" class="qr-image" />
            <p class="qr-tip" :class="{
              'qr-tip-scanned': wechatStatus === 'scanned',
              'qr-tip-waiting': wechatStatus === 'waiting'
            }">
              {{ wechatStatusMessage || '请使用微信扫描二维码' }}
            </p>
          </div>
          <div v-else class="qr-error">
            <p>二维码加载失败，请重试</p>
            <button class="retry-btn" @click="initWechatQR">重试</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定手机号弹窗 -->
    <div v-if="showBindPhoneModal" class="wechat-qr-overlay" @click.self="closeBindPhoneModal">
      <div class="wechat-qr-modal bind-phone-modal">
        <div class="qr-header">
          <h3>绑定手机号</h3>
          <button class="qr-close-btn" @click="closeBindPhoneModal">×</button>
        </div>
        <div class="bind-phone-content">
          <p class="bind-phone-tip">为了您的账号安全，首次请绑定手机号</p>
          <form @submit.prevent="handleBindPhone" class="bind-phone-form">
            <div class="form-group">
              <input 
                type="tel" 
                id="bindPhone" 
                v-model="bindPhoneData.phone"
                placeholder="请输入手机号"
                required
              />
            </div>
            <div v-if="bindPhoneError" class="error-message">
              {{ bindPhoneError }}
            </div>
            <div class="bind-phone-buttons">
              <button type="button" class="cancel-btn" @click="closeBindPhoneModal" :disabled="isBindingPhone">
                取消
              </button>
              <button type="submit" class="confirm-btn" :disabled="isBindingPhone">
                <span v-if="isBindingPhone" class="loading-spinner"></span>
                {{ isBindingPhone ? '绑定中...' : '确认绑定' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 设置密码弹窗 -->
    <div v-if="showSetPasswordModal" class="wechat-qr-overlay" @click.self="closeSetPasswordModal">
      <div class="wechat-qr-modal bind-phone-modal">
        <div class="qr-header">
          <h3>设置密码</h3>
          <button class="qr-close-btn" @click="handleSkipPassword">×</button>
        </div>
        <div class="bind-phone-content">
          <p class="bind-phone-tip">设置密码后，您可以使用手机号密码登录</p>
          <form @submit.prevent="handleSetPassword" class="bind-phone-form">
            <div class="form-group">
              <input 
                type="password" 
                id="setPassword" 
                v-model="setPasswordData.password"
                placeholder="请输入密码（至少6位）"
                required
              />
            </div>
            <div class="form-group">
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="setPasswordData.confirmPassword"
                placeholder="请再次输入密码"
                required
              />
            </div>
            <div v-if="setPasswordError" class="error-message">
              {{ setPasswordError }}
            </div>
            <div class="bind-phone-buttons">
              <button type="button" class="cancel-btn" @click="handleSkipPassword" :disabled="isSettingPassword">
                跳过
              </button>
              <button type="submit" class="confirm-btn" :disabled="isSettingPassword">
                <span v-if="isSettingPassword" class="loading-spinner"></span>
                {{ isSettingPassword ? '设置中...' : '确认设置' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { login, register, getWechatQRCode, checkWechatLoginStatus, bindPhoneForWechat, setPassword } from '../api/auth'
import { ElMessage } from 'element-plus'
import AvatarSelector from '../components/AvatarSelector.vue'
import QRCode from 'qrcode'

const router = useRouter()
const globalStore = useGlobalStore()

// 表单数据
const formData = reactive({
  phone: '',
  password: '',
  rememberMe: false
})

// 从localStorage恢复记住的账号密码
const restoreRememberedCredentials = () => {
  try {
    const remembered = localStorage.getItem('rememberedCredentials')
    if (remembered) {
      const credentials = JSON.parse(remembered)
      const now = Date.now()
      
      // 检查是否在15天内
      if (credentials.timestamp && (now - credentials.timestamp) < 15 * 24 * 60 * 60 * 1000) {
        formData.phone = credentials.phone || ''
        formData.password = credentials.password || ''
        formData.rememberMe = true
      } else {
        // 超过15天，清除记住的凭据
        localStorage.removeItem('rememberedCredentials')
      }
    }
  } catch (error) {
    console.error('Failed to restore remembered credentials:', error)
    localStorage.removeItem('rememberedCredentials')
  }
}

// 保存记住的账号密码
const saveRememberedCredentials = () => {
  if (formData.rememberMe) {
    const credentials = {
      phone: formData.phone,
      password: formData.password,
      timestamp: Date.now()
    }
    localStorage.setItem('rememberedCredentials', JSON.stringify(credentials))
  } else {
    localStorage.removeItem('rememberedCredentials')
  }
}

// 注册数据
const registerData = reactive({
  nickname: '',
  avatar: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'owner', // 注册用户默认为拥有者
  gender: 'other' // 默认性别为其他
})


// 加载状态
const isLoading = ref(false)
const errorMessage = ref('')
const isRegister = ref(false)

// 微信登录相关
const showWechatQR = ref(false)
const wechatQRCode = ref('')
const wechatQRLoading = ref(false)
const wechatSceneId = ref('')
const wechatStatus = ref('') // waiting, scanned, expired, confirmed
const wechatStatusMessage = ref('')
let wechatPollingTimer = null

// 绑定手机号相关
const showBindPhoneModal = ref(false)
const bindPhoneData = reactive({
  phone: ''
})
const bindPhoneError = ref('')
const isBindingPhone = ref(false)

// 设置密码相关
const showSetPasswordModal = ref(false)
const setPasswordData = reactive({
  password: '',
  confirmPassword: ''
})
const setPasswordError = ref('')
const isSettingPassword = ref(false)

// 关闭登录弹窗
const closeLogin = () => {
  // 触发关闭事件
  emit('close')
}

// 定义emit
const emit = defineEmits(['close'])

// 处理登录
const handleLogin = async () => {
  // 清除之前的错误信息
  errorMessage.value = ''
  
  // 验证输入
  if (!formData.phone || !formData.password) {
    errorMessage.value = '请输入手机号和密码'
    return
  }
  
  // 设置加载状态
  isLoading.value = true
  globalStore.loading.auth = true
  
  try {
    // 加密密码
    const encryptedPassword = await globalStore.encryptPassword(formData.password)
    
    // 调用登录API
    const response = await login({
      phone: formData.phone,
      password: encryptedPassword
    })

    // 使用 setAuth 方法统一设置认证状态
    // login API 已经返回用户数据，直接使用 response 即可
    globalStore.setAuth(response)
    
    // 保存记住的凭据
    saveRememberedCredentials()
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.error('登录失败:', error)
    errorMessage.value = error.response?.data?.detail || '登录失败，请重试'
  } finally {
    isLoading.value = false
    globalStore.loading.auth = false
  }
}

// 切换模式
const toggleMode = () => {
  errorMessage.value = ''
  isRegister.value = !isRegister.value
}

// 处理注册
const handleRegister = async () => {
  errorMessage.value = ''

  // 基础校验
  if (!registerData.phone || !registerData.password || !registerData.nickname) {
    errorMessage.value = '请填写手机号、密码和昵称'
    return
  }
  if (registerData.password.length < 6) {
    errorMessage.value = '密码至少6位'
    return
  }
  if (registerData.password !== registerData.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  isLoading.value = true
  globalStore.loading.auth = true
  
  try {
    // 加密密码
    const encryptedPassword = await globalStore.encryptPassword(registerData.password)
    
    // 调用注册API
    const response = await register({
      password: encryptedPassword,
      phone: registerData.phone,
      nickname: registerData.nickname,
      gender: registerData.gender,
      email: registerData.email,
      avatar: registerData.avatar
    })
    
    // 注册成功，显示成功消息
    ElMessage.success('注册成功，请登录')
    
    // 将注册的手机号和密码填写到登录表单
    formData.phone = registerData.phone
    formData.password = registerData.password
    
    // 切换到登录模式
    isRegister.value = false
    
    // 清空注册表单
    Object.assign(registerData, {
      nickname: '',
      avatar: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'owner',
      gender: 'other'
    })
  } catch (error) {
    console.error('注册失败:', error)
    errorMessage.value = error.response?.data?.detail || '注册失败，请重试'
  } finally {
    isLoading.value = false
    globalStore.loading.auth = false
  }
}


// 处理头像变化
const handleAvatarChange = (avatar) => {
  registerData.avatar = avatar
}


// 处理"记住我"复选框变化
const onRememberMeChange = () => {
  if (!formData.rememberMe) {
    // 如果取消勾选，清除记住的凭据
    localStorage.removeItem('rememberedCredentials')
  }
}

// 处理忘记密码点击
const handleForgotPassword = () => {
  ElMessage.info('你没忘！')
}

// 处理微信登录 - 统一使用二维码登录
const handleWechatLogin = () => {
  initWechatQR()
}

// 初始化微信二维码
const initWechatQR = async () => {
  showWechatQR.value = true
  wechatQRLoading.value = true
  wechatQRCode.value = ''
  wechatSceneId.value = ''
  wechatStatus.value = ''
  wechatStatusMessage.value = ''
  
  try {
    const response = await getWechatQRCode()
    if (response.qrcode_url && response.scene_id) {
      wechatSceneId.value = response.scene_id
      
      // 将 qrcode_url 转换为二维码图片
      try {
        const qrCodeDataURL = await QRCode.toDataURL(response.qrcode_url, {
          width: 260,
          margin: 2
        })
        wechatQRCode.value = qrCodeDataURL
        wechatStatus.value = 'waiting'
        wechatStatusMessage.value = '等待扫码'
        
        // 开始轮询检查登录状态
        startWechatPolling()
      } catch (qrError) {
        console.error('生成二维码图片失败:', qrError)
        ElMessage.error('生成二维码失败，请重试')
        wechatQRCode.value = ''
      }
    } else {
      ElMessage.error('获取二维码失败')
      wechatQRLoading.value = false
    }
  } catch (error) {
    console.error('获取微信二维码失败:', error)
    wechatQRLoading.value = false
  } finally {
    wechatQRLoading.value = false
  }
}

// 开始轮询检查微信登录状态
const startWechatPolling = () => {
  if (wechatPollingTimer) {
    clearInterval(wechatPollingTimer)
  }
  
  wechatPollingTimer = setInterval(async () => {
    if (!wechatSceneId.value) {
      stopWechatPolling()
      return
    }
    
    try {
      const response = await checkWechatLoginStatus(wechatSceneId.value)
      console.log("response", response)
      // 更新状态显示
      wechatStatus.value = response.status
      wechatStatusMessage.value = response.message || ''
      
      if (response.status === 'confirmed') {
        if (response.need_bind_phone) {
          // 需要绑定手机号
          stopWechatPolling()
          showBindPhoneModal.value = true
        } else if (response.token) {
          // 登录成功，直接使用返回的 token 信息
          stopWechatPolling()
          await completeWechatLogin(response.token)
        }
      } else if (response.status === 'expired') {
        // 二维码过期
        stopWechatPolling()
        ElMessage.warning('二维码已过期，请重新获取')
        initWechatQR()
      }
    } catch (error) {
      console.error('检查微信登录状态失败:', error)
    }
  }, 2000) // 每2秒轮询一次
}

// 停止轮询
const stopWechatPolling = () => {
  if (wechatPollingTimer) {
    clearInterval(wechatPollingTimer)
    wechatPollingTimer = null
  }
}

// 完成微信登录
const completeWechatLogin = async (tokenData) => {
  try {
    isLoading.value = true
    globalStore.loading.auth = true
    
    console.log("tokenData", tokenData)
    globalStore.setAuth(tokenData)
    
    ElMessage.success('微信登录成功')
    closeWechatQR()
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.error('微信登录失败:', error)
  } finally {
    isLoading.value = false
    globalStore.loading.auth = false
  }
}

// 关闭微信二维码弹窗
const closeWechatQR = () => {
  showWechatQR.value = false
  stopWechatPolling()
  wechatQRCode.value = ''
  wechatSceneId.value = ''
  wechatStatus.value = ''
  wechatStatusMessage.value = ''
}

// 处理绑定手机号
const handleBindPhone = async () => {
  bindPhoneError.value = ''
  
  if (!bindPhoneData.phone) {
    bindPhoneError.value = '请输入手机号'
    return
  }
  
  // 简单的手机号验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(bindPhoneData.phone)) {
    bindPhoneError.value = '请输入正确的手机号'
    return
  }
  
  isBindingPhone.value = true
  
  try {
    const response = await bindPhoneForWechat({
      scene_id: wechatSceneId.value,
      phone: bindPhoneData.phone
    })
    
    // 绑定成功后，立即设置认证状态（设置密码需要Authorization header）
    // response 包含 access_token, token_type, role, account (account 中包含 id)
    if (response.access_token) {
      // 立即设置认证状态，保存token到store和localStorage
      globalStore.setAuth(response)
      
      // 关闭绑定手机号弹窗
      closeBindPhoneModal()
      // 显示设置密码弹窗（用户可以选择设置或跳过）
      showSetPasswordModal.value = true
    }
  } catch (error) {
    console.error('绑定手机号失败:', error)
    // 根据文档，错误响应有多种情况，统一显示后端返回的 detail
    const errorMessage = error.response?.data?.detail || '绑定失败，请重试'
    bindPhoneError.value = errorMessage
  } finally {
    isBindingPhone.value = false
  }
}

// 关闭绑定手机号弹窗
const closeBindPhoneModal = () => {
  showBindPhoneModal.value = false
  bindPhoneData.phone = ''
  bindPhoneError.value = ''
  // 注意：不在这里关闭二维码弹窗，因为绑定成功后还需要完成登录流程
}

// 处理设置密码
const handleSetPassword = async () => {
  setPasswordError.value = ''
  
  if (!setPasswordData.password || !setPasswordData.confirmPassword) {
    setPasswordError.value = '请输入密码和确认密码'
    return
  }
  
  if (setPasswordData.password.length < 6) {
    setPasswordError.value = '密码至少6位'
    return
  }
  
  if (setPasswordData.password !== setPasswordData.confirmPassword) {
    setPasswordError.value = '两次输入的密码不一致'
    return
  }
  
  isSettingPassword.value = true
  
  try {
    // 加密密码
    const encryptedPassword = await globalStore.encryptPassword(setPasswordData.password)
    
    await setPassword({
      password: encryptedPassword
    })
    
    // 设置密码成功，关闭弹窗并跳转（auth已经设置，不需要重新设置）
    ElMessage.success('密码设置成功')
    closeSetPasswordModal()
    
    // 关闭二维码弹窗并跳转
    closeWechatQR()
    router.push('/home')
  } catch (error) {
    console.error('设置密码失败:', error)
    const errorMessage = error.response?.data?.detail || '设置密码失败，请重试'
    setPasswordError.value = errorMessage
    // 设置密码失败不影响登录流程，用户已经登录
  } finally {
    isSettingPassword.value = false
  }
}

// 跳过设置密码
const handleSkipPassword = () => {
  closeSetPasswordModal()
  
  // 关闭二维码弹窗并跳转（auth已经设置，不需要重新设置）
  closeWechatQR()
  router.push('/home')
}

// 关闭设置密码弹窗
const closeSetPasswordModal = () => {
  showSetPasswordModal.value = false
  setPasswordData.password = ''
  setPasswordData.confirmPassword = ''
  setPasswordError.value = ''
}

// 组件挂载时恢复记住的凭据
onMounted(() => {
  restoreRememberedCredentials()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopWechatPolling()
})
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-login-overlay);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal {
  background: var(--color-login-modal-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-login-border);
  border-radius: 20px;
  padding: 16px 40px;
  width: 520px;
  max-width: 90vw;
  position: relative;
  box-shadow: 0 25px 50px var(--color-login-shadow);
  max-height: 95vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.login-modal::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--color-login-text-muted);
  font-size: 28px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: var(--color-login-primary-hover);
  color: var(--color-login-gradient-start);
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.platform-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-login-text-primary);
  background: linear-gradient(45deg, var(--color-login-gradient-start), var(--color-login-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.platform-subtitle {
  margin: 0;
  color: var(--color-login-text-muted);
  font-size: 16px;
}

.login-form {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px 12px;
}

.form-group.full-row {
  grid-column: 1 / -1;
}

.form-group select {
  width: 100%;
  padding: 12px;
  background: var(--color-login-input-bg);
  border: 2px solid var(--color-login-border);
  border-radius: 12px;
  color: var(--color-login-text-primary);
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group select.compact {
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
}

.form-group select:focus {
  outline: none;
  border-color: var(--color-login-gradient-start);
  background: var(--color-login-input-bg-focus);
}

.avatar-preview {
  margin-top: 8px;
}

.avatar-preview img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-login-border);
}

.avatar-uploader {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px dashed var(--color-login-border);
  background: var(--color-login-input-bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.avatar-uploader:hover {
  border-color: var(--color-login-gradient-start);
  background: var(--color-login-input-bg-focus);
}

.avatar-uploader .plus {
  color: var(--color-login-text-muted);
  font-size: 28px;
  line-height: 1;
}

.avatar-uploader img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-group {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-login-text-primary);
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: var(--color-login-error-text);
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: var(--color-login-input-bg);
  border: 2px solid var(--color-login-border);
  border-radius: 12px;
  color: var(--color-login-text-primary);
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-login-gradient-start);
  background: var(--color-login-input-bg-focus);
}

.form-group input::placeholder {
  color: var(--color-login-text-muted);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--color-login-text-muted);
  font-size: 14px;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-login-border);
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background-color: var(--color-login-checkbox-bg);
  border-color: var(--color-login-checkbox-bg);
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-login-checkbox-text);
  font-size: 14px;
  font-weight: bold;
}

.forgot-password {
  color: var(--color-login-link);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-login-link-hover);
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-login-gradient-start), var(--color-login-gradient-end));
  color: var(--color-login-checkbox-text);
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  margin-top: 16px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px var(--color-login-btn-shadow);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* 错误信息样式 */
.error-message {
  background: var(--color-login-error-bg);
  color: var(--color-login-error-text);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid var(--color-login-error-border);
  font-size: 14px;
  text-align: center;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-login-spinner-border);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bottom-links {
  text-align: center;
  color: var(--color-login-text-muted);
  font-size: 14px;
}

.register-link {
  color: var(--color-login-gradient-start);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--color-login-gradient-end);
}

/* 表单布局样式 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 0;
}

/* 登录表单特定样式 */
.login-form .form-group {
  margin-bottom: 10px;
}

.login-form .form-group:last-of-type {
  margin-bottom: 0;
}

/* 头像区域样式 */
.avatar-section {
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}


/* 响应式设计 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-modal {
    padding: 30px 20px;
    width: 90vw;
  }
  
  .platform-title {
    font-size: 24px;
  }

  
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* 微信登录样式 */
.social-login-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0 16px;
  gap: 12px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--color-login-border, #e0e0e0);
}

.divider-text {
  color: var(--color-login-text-muted, #999);
  font-size: 14px;
  padding: 0 8px;
}

.wechat-login-btn {
  width: 100%;
  background: #07c160;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.wechat-login-btn:hover {
  background: #06ad56;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(7, 193, 96, 0.3);
}

.wechat-login-btn:active {
  transform: translateY(0);
}

.wechat-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.wechat-icon {
  width: 24px;
  height: 24px;
}

/* 微信二维码弹窗样式 */
.wechat-qr-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.wechat-qr-modal {
  background: var(--color-login-modal-bg, #ffffff);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-login-border, rgba(255, 255, 255, 0.2));
  border-radius: 20px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.qr-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-login-text-primary, #333);
}

.qr-close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: var(--color-login-text-muted, #999);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  line-height: 1;
  padding: 0;
}

.qr-close-btn:hover {
  background-color: var(--color-login-primary-hover, rgba(0, 0, 0, 0.05));
  color: var(--color-login-text-primary, #333);
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.qr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.qr-loading p {
  color: var(--color-login-text-muted, #999);
  font-size: 14px;
}

.qr-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-image {
  width: 260px;
  height: 260px;
  border: 2px solid var(--color-login-border, #e0e0e0);
  border-radius: 12px;
  background: white;
  padding: 12px;
}

.qr-tip {
  color: var(--color-login-text-muted, #666);
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.qr-tip-scanned {
  color: #07c160;
  font-weight: 500;
}

.qr-tip-waiting {
  color: var(--color-login-text-muted, #666);
}

.qr-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-error p {
  color: var(--color-login-error-text, #ff4757);
  font-size: 14px;
  margin: 0;
}

.retry-btn {
  background: linear-gradient(135deg, var(--color-login-gradient-start, #667eea), var(--color-login-gradient-end, #764ba2));
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.retry-btn:active {
  transform: translateY(0);
}

/* 绑定手机号弹窗样式 */
.bind-phone-modal {
  width: 420px;
}

.bind-phone-content {
  padding: 0;
}

.bind-phone-tip {
  color: var(--color-login-text-muted, #666);
  font-size: 14px;
  text-align: center;
  margin: 0 0 24px 0;
}

.bind-phone-form {
  width: 100%;
}

.bind-phone-form .form-group {
  margin-bottom: 16px;
}

.bind-phone-form .form-group:last-of-type {
  margin-bottom: 0;
}

.bind-phone-form .form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-login-text-primary, #333);
  font-weight: 500;
  font-size: 14px;
}

.bind-phone-form .form-group input {
  width: 100%;
  padding: 12px;
  background: var(--color-login-input-bg, #f5f5f5);
  border: 2px solid var(--color-login-border, #e0e0e0);
  border-radius: 12px;
  color: var(--color-login-text-primary, #333);
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.bind-phone-form .form-group input:focus {
  outline: none;
  border-color: var(--color-login-gradient-start, #667eea);
  background: var(--color-login-input-bg-focus, #ffffff);
}

.bind-phone-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cancel-btn {
  background: var(--color-login-input-bg, #f5f5f5);
  color: var(--color-login-text-primary, #333);
}

.cancel-btn:hover {
  background: var(--color-login-border, #e0e0e0);
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-btn {
  background: linear-gradient(135deg, var(--color-login-gradient-start, #667eea), var(--color-login-gradient-end, #764ba2));
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
}

.confirm-btn:active {
  transform: translateY(0);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>
