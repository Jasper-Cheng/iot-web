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
              <!-- 闪电图标 -->
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Electricity</span>
        </li>
        <li class="nav-item">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 音符图标 -->
              <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Player</span>
        </li>
        <li class="nav-item">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 时钟/饼图图标 -->
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>Bills</span>
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
          <button class="add-device-btn">+ Add Device</button>
          <div class="header-controls">
            <button class="theme-toggle">☀️</button>
            <button class="notification-btn">🔔</button>
            <div class="user-profile">
              <img src="https://via.placeholder.com/40x40" alt="Profile" class="profile-avatar">
              <span class="user-name">Bala Hatun</span>
              <span class="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 房间选择 -->
      <div class="room-selection">
        <button class="room-btn active">Living Room</button>
        <button class="room-btn">Dining Room</button>
        <button class="room-btn">Bed Room</button>
        <button class="room-btn">Bath Room</button>
        <button class="room-btn">Backyard</button>
        <button class="add-room-btn">+ Add Room</button>
      </div>

      <!-- 主内容区域 -->
      <div class="content-area">
        <!-- 这里后续会添加设备面板等内容 -->
        <div class="placeholder">
          <h2>Home Content</h2>
          <p>设备面板和控件将在这里实现</p>
          <button class="show-login-btn" @click="showLogin = true">显示登录弹窗</button>
        </div>
      </div>

      <!-- 登录弹窗 -->
      <Login v-if="showLogin" @close="showLogin = false" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Login from './Login.vue'

// 控制登录弹窗显示
const showLogin = ref(false)
</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
  background-color: #09090B;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 左侧导航栏 */
.sidebar {
  width: 280px;
  background-color: #27272A;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #71717A;
}

.logo {
  padding: 0 24px 32px;
  border-bottom: 1px solid #71717A;
  margin-bottom: 32px;
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
  margin: 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  margin: 4px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #71717A;
}

.nav-item:hover {
  background-color: rgba(191, 254, 1, 0.1);
  color: #BFFE01;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #BFFE01;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
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
  font-size: 16px;
}

.logout {
  padding: 16px 24px;
  margin: 16px;
  border-top: 1px solid #71717A;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #71717A;
  transition: color 0.3s ease;
}

.logout:hover {
  color: #BFFE01;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #09090B;
}

/* 顶部头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px;
  border-bottom: 1px solid #71717A;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
}

.header-left p {
  margin: 0;
  color: #71717A;
  font-size: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.add-device-btn {
  background-color: #BFFE01;
  color: #09090B;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-device-btn:hover {
  background-color: #A8E600;
  transform: translateY(-2px);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle,
.notification-btn {
  background: none;
  border: none;
  color: #71717A;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.theme-toggle:hover,
.notification-btn:hover {
  background-color: #27272A;
  color: #BFFE01;
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
  background-color: #27272A;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #FFFFFF;
}

.dropdown-arrow {
  color: #71717A;
  font-size: 12px;
}

/* 房间选择 */
.room-selection {
  display: flex;
  gap: 16px;
  padding: 24px 40px;
  border-bottom: 1px solid #71717A;
}

.room-btn {
  background: none;
  border: 2px solid #71717A;
  color: #71717A;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.room-btn:hover {
  border-color: #BFFE01;
  color: #BFFE01;
}

.room-btn.active {
  border-color: #BFFE01;
  background-color: #BFFE01;
  color: #09090B;
}

.add-room-btn {
  background: none;
  border: 2px dashed #71717A;
  color: #71717A;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-room-btn:hover {
  border-color: #BFFE01;
  color: #BFFE01;
}

/* 主内容区域 */
.content-area {
  flex: 1;
  padding: 40px;
}

.placeholder {
  text-align: center;
  color: #71717A;
}

.placeholder h2 {
  color: #FFFFFF;
  margin-bottom: 16px;
}

.show-login-btn {
  background: linear-gradient(135deg, #BFFE01, #38A0FF);
  color: #09090B;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.show-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(191, 254, 1, 0.3);
}
</style>
