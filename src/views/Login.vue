<template>
  <div class="login-overlay">
    <div class="login-modal">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeLogin">×</button>
      
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

      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
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
            <input type="checkbox" v-model="formData.rememberMe" />
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

      <!-- 底部链接 -->
      <div class="bottom-links">
        <span>还没有账号? </span>
        <a href="#" class="register-link">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 加载状态
const isLoading = ref(false)
const errorMessage = ref('')

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
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 验证登录凭据
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // 登录成功
      localStorage.setItem('token', 'admin-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString()
      }))
      
      // 跳转到Index界面
      router.push('/home')
    } else {
      // 登录失败
      errorMessage.value = '用户名或密码错误'
    }
  } catch (error) {
    errorMessage.value = '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}
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
  padding: 40px;
  width: 420px;
  max-width: 90vw;
  position: relative;
  box-shadow: 0 25px 50px var(--color-login-shadow);
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
  margin-bottom: 30px;
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

.form-group input {
  width: 100%;
  padding: 16px;
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
  margin-bottom: 30px;
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

/* 响应式设计 */
@media (max-width: 480px) {
  .login-modal {
    padding: 30px 20px;
    width: 90vw;
  }
  
  .platform-title {
    font-size: 24px;
  }
  
  .form-group input {
    padding: 14px;
  }
}
</style>
