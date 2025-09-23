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
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username"
            placeholder="请输入用户名"
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
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>

        <!-- 错误信息显示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-else class="login-form" @submit.prevent="handleRegister">
        <!-- 头像选择区域 -->
        <div class="avatar-section">
          <AvatarSelector 
            v-model="registerData.avatar"
            @change="handleAvatarChange"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>电话 *</label>
            <input v-model="registerData.phone" type="tel" required placeholder="请输入电话号码">
          </div>
          <div class="form-group">
            <label>账号 *</label>
            <input v-model="registerData.username" type="text" required placeholder="请输入账号">
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
            <label>姓名 *</label>
            <input v-model="registerData.name" type="text" required placeholder="请输入姓名">
          </div>
          <div class="form-group">
            <label>性别 *</label>
            <select v-model="registerData.gender" required>
              <option value="">请选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>邮件</label>
            <input v-model="registerData.email" type="email" placeholder="请输入邮箱地址">
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="submit-button-container">
          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>

      <!-- 底部链接：切换登录/注册 -->
      <div class="bottom-links">
        <span v-if="!isRegister">还没有账号? </span>
        <span v-else>已经有账号? </span>
        <a href="#" class="register-link" @click.prevent="toggleMode">{{ isRegister ? '去登录' : '立即注册' }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { login, register } from '../api/auth'
import { getMemberDetail, getUserDetail } from '../api/users'
import { ElMessage } from 'element-plus'
import AvatarSelector from '../widgets/AvatarSelector.vue'

const router = useRouter()
const globalStore = useGlobalStore()

// 表单数据
const formData = reactive({
  username: '',
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
        formData.username = credentials.username || ''
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
      username: formData.username,
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
  username: '',
  name: '',
  avatar: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'owner', // 注册用户默认为拥有者
  gender: ''
})


// 加载状态
const isLoading = ref(false)
const errorMessage = ref('')
const isRegister = ref(false)

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
  if (!formData.username || !formData.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  
  // 设置加载状态
  isLoading.value = true
  globalStore.loading.auth = true
  
  try {
    // 调用登录API
    const response = await login({
      username: formData.username,
      password: formData.password
    })
    
    // 先保存token到全局状态
    globalStore.token = response.access_token
    localStorage.setItem('token', response.access_token)
    
    try {
      let userData = response
      
      if (response.role === 'member') {
        // 如果是member，调用/members/{member_id}接口
        const memberResponse = await getMemberDetail(response.id)
        // 将user_id添加到登录response中
        userData = {
          ...response,
          user_id: memberResponse.user_id
        }
      }else if(response.role === 'owner'){
        // 如果是owner，不同再调用接口
        userData = {
          ...response,
          user_id: response.id
        }
      }
      
      // 将更新后的response保存到全局状态
      globalStore.user = userData
      globalStore.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
      
      // 打印 userData
      console.log('userData after login:', userData)
      
    } catch (userError) {
      console.error('获取用户详情失败:', userError)
      // 即使获取用户详情失败，也继续登录流程，保存原始响应
      globalStore.user = response
      globalStore.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(response))
      
      // 打印 userData（错误情况）
      console.log('userData after login (error):', response)
    }
    
    // 保存记住的凭据
    saveRememberedCredentials()
    
    // 显示成功消息
    ElMessage.success('登录成功')
    
    // 跳转到首页
    router.push('/home')
    
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
    
    // 处理错误响应
    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        // 处理detail数组或字符串
        if (Array.isArray(error.response.data.detail)) {
          errorMessage.value = error.response.data.detail.join(', ')
        } else {
          errorMessage.value = error.response.data.detail
        }
      } else if (error.response.data.message) {
        errorMessage.value = error.response.data.message
      } else if (typeof error.response.data === 'string') {
        errorMessage.value = error.response.data
      } else {
        errorMessage.value = `登录失败 (${error.response.status}): ${JSON.stringify(error.response.data)}`
      }
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '登录失败，请重试'
    }
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
  if (!registerData.username || !registerData.password) {
    errorMessage.value = '请填写用户名和密码'
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
    // 调用注册API
    const response = await register({
      username: registerData.username,
      password: registerData.password,
      phone: registerData.phone,
      name: registerData.name || registerData.username, // 使用姓名，如果没有则使用用户名
      gender: registerData.gender,
      email: registerData.email,
      avatar: registerData.avatar
    })
    
    // 注册成功，显示成功消息
    ElMessage.success('注册成功，请登录')
    
    // 切换到登录模式
    isRegister.value = false
    
    // 清空注册表单
    Object.assign(registerData, {
      username: '',
      name: '',
      avatar: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'owner',
      gender: 'other'
    })
    
  } catch (error) {
    console.error('Register failed:', error.response?.data || error.message)
    
    // 处理错误响应
    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage.value = error.response.data.detail.join(', ')
        } else {
          errorMessage.value = error.response.data.detail
        }
      } else if (error.response.data.message) {
        errorMessage.value = error.response.data.message
      } else if (typeof error.response.data === 'string') {
        errorMessage.value = error.response.data
      } else {
        errorMessage.value = `注册失败 (${error.response.status}): ${JSON.stringify(error.response.data)}`
      }
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '注册失败，请重试'
    }
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

// 组件挂载时恢复记住的凭据
onMounted(() => {
  restoreRememberedCredentials()
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
  margin-bottom: 40px;
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
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-login-error-border);
  margin-bottom: 16px;
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
</style>
