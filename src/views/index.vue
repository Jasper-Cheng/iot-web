<template>
  <div class="home">
    <!-- 左侧导航栏 -->
    <nav class="sidebar">
      <!-- Logo区域 -->
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#BFFE01" stroke-width="2" fill="none"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="#BFFE01" stroke-width="2" fill="none"/>
            <!-- 添加电路线条 -->
            <path d="M7 22 L7 25 M11 22 L11 25 M15 22 L15 25" stroke="#BFFE01" stroke-width="1" fill="none"/>
            <path d="M5 25 L19 25" stroke="#BFFE01" stroke-width="1" fill="none"/>
          </svg>
        </div>
      </div>

      <!-- 导航菜单 -->
      <ul class="nav-menu">
        <li class="nav-item active">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" fill="none"/>
              <!-- Wi-Fi符号 -->
              <path d="M12 16 L12 18" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M9 13 L15 13" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M7 10 L17 10" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Home</span>
        </li>
        <li class="nav-item">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 2x2网格图标 -->
              <rect x="4" y="4" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="14" y="4" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="4" y="14" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="14" y="14" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Widgets</span>
        </li>
        <li class="nav-item">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 三个人的图标 -->
              <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="6" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="18" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Members</span>
        </li>
        <li class="nav-item">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 购物袋图标 -->
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Mall</span>
        </li>
      </ul>

      <!-- 退出按钮 -->
      <div class="logout">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 左箭头然后弯曲的图标 -->
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M3 12h12" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M15 6c0 0 3 3 3 6s-3 6-3 6" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <span>Logout</span>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部头部 -->
      <header class="header">
        <div class="header-left">
          <h1 class="greeting">Greetings from home again, Bala</h1>
          <p class="status">Every system and gadget is operating as planned.</p>
        </div>
        <div class="header-right">
          <button class="add-device-btn">
            <span class="plus-icon">+</span>
            Add Device
          </button>
          <!-- 主题切换：胶囊+滑块 -->
          <div class="theme-toggle" role="group" aria-label="Theme toggle">
            <span 
              class="toggle-option" 
              :class="{ active: currentTheme === 'light' }" 
              @click="setToLight"
              aria-label="Light"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="toggle-icon">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </span>
            <span 
              class="toggle-option" 
              :class="{ active: currentTheme === 'dark' }" 
              @click="setToDark"
              aria-label="Dark"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="toggle-icon">
                <!-- Crescent moon: outer arc with inner subtraction mimic -->
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
              </svg>
            </span>
            <span class="toggle-knob" :class="{ right: currentTheme === 'dark' }"></span>
          </div>
          <button class="notification-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
          <div class="user-profile">
            <img src="https://api.dicebear.com/7.x/adventurer/png?size=80&seed=bala" alt="Profile Avatar" class="profile-avatar">
            <span class="user-name">Bala Hatun</span>
            <span class="dropdown-arrow">▼</span>
          </div>
        </div>
      </header>
      
      <!-- Home 内容区域 -->
      <Home />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Login from './Login.vue'
import Home from './Home.vue'
import { initTheme, setTheme } from '../utils/theme.js'

// 控制登录弹窗显示（预留）
const showLogin = ref(false)

// 当前主题
const currentTheme = ref('dark')

// 操作：设置为明亮/黑暗
const setToLight = () => {
  setTheme('light')
  currentTheme.value = 'light'
}
const setToDark = () => {
  setTheme('dark')
  currentTheme.value = 'dark'
}

// 初始化主题
onMounted(() => {
  const theme = initTheme()
  currentTheme.value = theme
})
</script>

<style>
@import '../styles/colors.css';

/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.home {
  display: flex;
  height: 100vh;
  background: var(--gradient-bg);
  color: var(--color-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 隐藏滚动条 */
.home::-webkit-scrollbar {
  display: none;
}

.home {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 左侧导航栏 */
.sidebar {
  width: 110px;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 12px 0 32px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 36px 0px 0px 0px;
  flex: 1;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px;
  margin: 20px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
  text-align: center;
  background-color: var(--color-nav-idle);
}

.nav-item:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.nav-item.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}

.nav-item span {
  font-weight: 500;
  font-size: 13px;
}

.logout {
  padding: 16px 12px;
  margin: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
  text-align: center;
}

.logout:hover {
  color: var(--color-primary);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-left p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.add-device-btn {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-device-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.plus-icon {
  font-size: 16px;
  font-weight: bold;
}

/* 主题胶囊开关 */
.theme-toggle {
  position: relative;
  width: 100px;
  height: 40px;
  background: var(--color-bg-card);
  border-radius: 20px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 0;
}

.toggle-option {
  z-index: 2;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.toggle-option.active {
  color: var(--color-text-primary);
}

.toggle-knob {
  position: absolute;
  top: 8px;
  left: 10px;
  width: 40px;
  height: 24px;
  background: rgba(255,255,255,0.08);
  border-radius: 16px;
  transition: left 0.25s ease;
  box-shadow: inset 0 0 0 1px var(--color-border-light);
}

.toggle-knob.right {
  left: calc(100% - 10px - 40px);
}

.notification-btn {
  background-color: var(--color-bg-card);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
}

.notification-btn svg {
  width: 20px;
  height: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: var(--color-bg-card);
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.dropdown-arrow {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.toggle-icon {
  width: 18px;
  height: 18px;
  stroke: var(--color-text-secondary);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.toggle-option.active .toggle-icon {
  stroke: var(--color-text-primary);
}


</style>
