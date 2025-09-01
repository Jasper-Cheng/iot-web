<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <i class="el-icon-monitor"></i>
            <h1>IoT 管理平台</h1>
          </div>
          <p class="subtitle">智能设备管理与监控系统</p>
        </div>
        
        <div class="form-container">
          <div class="tab-switch">
            <button 
              :class="['tab-btn', { active: activeTab === 'login' }]"
              @click="activeTab = 'login'"
            >
              登录
            </button>
            <button 
              :class="['tab-btn', { active: activeTab === 'register' }]"
              @click="activeTab = 'register'"
            >
              注册
            </button>
          </div>

          <!-- 登录表单 -->
          <el-form 
            v-if="activeTab === 'login'"
            :model="loginForm" 
            :rules="loginRules"
            ref="loginFormRef"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <div class="flex-between">
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">忘记密码？</a>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                class="submit-btn" 
                size="large"
                :loading="loginLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 注册表单 -->
          <el-form 
            v-if="activeTab === 'register'"
            :model="registerForm" 
            :rules="registerRules"
            ref="registerFormRef"
            class="register-form"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="email">
              <el-input 
                v-model="registerForm.email" 
                placeholder="请输入邮箱"
                prefix-icon="el-icon-message"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="请确认密码"
                prefix-icon="el-icon-lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="registerForm.agree">我已阅读并同意服务条款</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                class="submit-btn" 
                size="large"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    
    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="showForgotPassword"
      title="忘记密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="forgotPasswordForm" :rules="forgotPasswordRules" ref="forgotPasswordFormRef">
        <el-form-item prop="email">
          <el-input 
            v-model="forgotPasswordForm.email" 
            placeholder="请输入注册邮箱"
            prefix-icon="el-icon-message"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showForgotPassword = false">取消</el-button>
          <el-button type="primary" @click="handleForgotPassword" :loading="forgotPasswordLoading">
            发送重置邮件
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register, forgotPassword } from '../api/auth'

const router = useRouter()
const activeTab = ref('login')
const loginLoading = ref(false)
const registerLoading = ref(false)
const forgotPasswordLoading = ref(false)
const showForgotPassword = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()
const forgotPasswordFormRef = ref()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

// 忘记密码表单
const forgotPasswordForm = reactive({
  email: ''
})

// 登录验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ]
}

// 注册验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true
    
    try {
      console.log('开始登录请求...')
      console.log('请求数据:', {
        username: loginForm.username,
        password: loginForm.password
      })
      
      // 使用真实API调用
      const response = await login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      console.log('登录成功，响应数据:', response)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify({
        username: loginForm.username,
        remember: loginForm.remember,
        ...response.data.user
      }))
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } catch (error) {
      console.error('登录失败:', error)
      console.error('错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      })
      ElMessage.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
    } finally {
      loginLoading.value = false
    }
  } catch (error) {
    loginLoading.value = false
    ElMessage.error('请检查输入信息')
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    
    if (!registerForm.agree) {
      ElMessage.warning('请先同意服务条款')
      return
    }
    
    registerLoading.value = true
    
    try {
      // 使用真实API调用
      await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      })
      
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
      registerForm.username = ''
      registerForm.email = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
      registerForm.agree = false
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '注册失败，请稍后重试')
    } finally {
      registerLoading.value = false
    }
  } catch (error) {
    registerLoading.value = false
    ElMessage.error('请检查输入信息')
  }
}

// 忘记密码验证规则
const forgotPasswordRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 处理忘记密码
const handleForgotPassword = async () => {
  try {
    await forgotPasswordFormRef.value.validate()
    forgotPasswordLoading.value = true
    
    try {
      // 使用真实API调用
      await forgotPassword({
        email: forgotPasswordForm.email
      })
      
      ElMessage.success('重置邮件已发送，请检查邮箱')
      showForgotPassword.value = false
      forgotPasswordForm.email = ''
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '发送失败，请稍后重试')
    } finally {
      forgotPasswordLoading.value = false
    }
  } catch (error) {
    forgotPasswordLoading.value = false
    ElMessage.error('请检查输入信息')
  }
}
</script>

<style scoped>
/* 全局样式重置 */
:global(body), :global(html) {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.login-background {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.login-background::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  z-index: -1;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.logo i {
  font-size: 32px;
  color: #667eea;
  margin-right: 10px;
}

.logo h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.form-container {
  margin-top: 20px;
}

.tab-switch {
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.login-form,
.register-form {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #667eea;
  border-color: #667eea;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #667eea;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
  text-decoration: underline;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
    max-height: 95vh;
  }
  
  .logo h1 {
    font-size: 20px;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
