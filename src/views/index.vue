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

</style>
