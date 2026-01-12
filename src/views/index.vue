<template>
  <div class="home" @click="closeAllMenus">
    <!-- 左侧导航栏 -->
    <nav class="sidebar">
      <!-- Logo区域 -->
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="var(--color-primary)" stroke-width="2" fill="none"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="var(--color-primary)" stroke-width="2" fill="none"/>
            <!-- 添加电路线条 -->
            <path d="M7 22 L7 25 M11 22 L11 25 M15 22 L15 25" stroke="var(--color-primary)" stroke-width="1" fill="none"/>
            <path d="M5 25 L19 25" stroke="var(--color-primary)" stroke-width="1" fill="none"/>
          </svg>
        </div>
      </div>

      <!-- 导航菜单 -->
      <ul class="nav-menu">
        <li 
          v-for="navItem in navigationItems" 
          :key="navItem.id"
          :class="['nav-item', { active: activeNavItem === navItem.id }]"
          @click="navigateTo(navItem)"
        >
          <div class="nav-icon">
            <!-- Home图标 -->
            <svg v-if="navItem.id === 'home'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" fill="none"/>
              <!-- Wi-Fi符号 -->
              <path d="M12 16 L12 18" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M9 13 L15 13" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M7 10 L17 10" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- Family图标 -->
            <svg v-else-if="navItem.id === 'family'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- Mall图标 -->
            <svg v-else-if="navItem.id === 'mall'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- Settings图标 -->
            <svg v-else-if="navItem.id === 'settings'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <span>{{ navItem.name }}</span>
        </li>
      </ul>

      <!-- 退出按钮 -->
      <div class="logout" @click="logout">
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
          <h1 class="greeting">Greetings from home again, {{ globalStore.user?.account?.nickname || 'happy' }}</h1>
          <p class="status">Every system and gadget is operating as planned.</p>
        </div>
        <div class="header-right">
          <button 
            class="add-device-btn" 
            title="绑定设备"
            @click="openAddDeviceModal"
          >
            <span class="plus-icon">+</span>
            Bind Device
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
          <div class="notification-container">
            <button class="notification-btn" @click.stop="toggleNotificationMenuAndCloseUserMenu">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <!-- 未读消息数量徽章 -->
              <span v-if="unreadMessages.length > 0" class="notification-badge">{{ unreadMessages.length }}</span>
            </button>
            
            <!-- 通知下拉菜单 -->
            <div v-if="showNotificationMenu" class="notification-dropdown" @click.stop>
              <!-- 通知头部信息 -->
              <div class="notification-info">
                <div class="notification-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="notification-details">
                  <h4>消息通知</h4>
                  <p class="notification-count">{{ unreadMessages.length }} 条未读消息</p>
                </div>
                <div class="notification-actions">
                  <button 
                    class="system-message-btn" 
                    @click="openSystemMessageModal"
                    title="查看系统消息"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    系统消息
                  </button>
                </div>
              </div>
              
              <!-- 消息列表 -->
              <div class="notification-content">
                <div v-if="unreadMessages.length === 0" class="no-messages">
                  <div class="no-messages-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                  </div>
                  <p>暂无未读消息</p>
                </div>
                <div v-else class="message-list">
                  <div 
                    v-for="message in unreadMessages" 
                    :key="message.id" 
                    :data-message-id="message.id"
                    class="message-item"
                  >
                    <div class="message-icon" :class="`level-${message.level}`">
                      <svg v-if="message.level === 'low'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      <svg v-else-if="message.level === 'normal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      <svg v-else-if="message.level === 'error'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <svg v-else-if="message.level === 'fatal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 8v4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 16h.01" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                    </div>
                    <div class="message-content">
                      <div class="message-text">{{ message.message }}</div>
                      <div class="message-footer">
                        <div v-if="getDeviceName(message.device_id)" class="message-device">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
                          </svg>
                          {{ getDeviceName(message.device_id) }}
                        </div>
                        <div class="message-meta">
                          <span class="message-level" :class="`level-${message.level}`">
                            {{ message.level === 'low' ? '低' : message.level === 'normal' ? '普通' : message.level === 'error' ? '错误' : message.level === 'fatal' ? '致命' : '未知' }}
                          </span>
                          <span class="message-time">{{ formatTime(message) }}</span>
                          <button 
                            class="mark-read-single-btn" 
                            @click="markMessageAsRead(message)"
                            :title="'标记为已读'"
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <!-- 操作按钮 -->
              <div class="dropdown-menu">
                <div class="dropdown-actions">
                  <a href="#" class="dropdown-item" @click.prevent="markAllAsRead" :class="{ disabled: unreadMessages.length === 0 }">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    一键已读
                  </a>
                  <a href="#" class="dropdown-item" @click.prevent="openMessageLogModal">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" fill="none"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    消息日志
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="user-profile" @click.stop="toggleUserMenuAndCloseNotificationMenu">
            <img 
              :src="globalStore.user?.account?.avatar || DEFAULT_NO_AVATAR_URL" 
              :alt="globalStore.user?.account?.nickname || 'User Avatar'" 
              @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
              class="profile-avatar"
            >
            <span class="user-name">{{ globalStore.user?.account?.nickname || '用户' }}</span>
            <span class="dropdown-arrow" :class="{ active: showUserMenu }">▼</span>
          </div>
          
          <!-- 用户下拉菜单 -->
          <div v-if="showUserMenu" class="user-dropdown" @click.stop>
            <div class="user-info">
              <img 
                :src="globalStore.user?.account?.avatar || DEFAULT_NO_AVATAR_URL" 
                :alt="globalStore.user?.account?.nickname || 'User Avatar'" 
                @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
                class="dropdown-avatar"
              >
              <div class="user-details">
                <h4>{{ globalStore.user?.account?.nickname || '用户' }}</h4>
                <p class="user-email">{{ globalStore.user?.account?.email || '未设置邮箱' }}</p>
                <p class="user-phone">{{ globalStore.user?.account?.phone || '未设置手机号' }}</p>
                <div class="user-meta">
                  <span class="user-role">{{ getRoleText(globalStore.user?.account?.role) }}</span>
                  <span class="user-gender">{{ getGenderText(globalStore.user?.account?.gender) }}</span>
                </div>
              </div>
            </div>
            <div class="user-points-section">
              <div class="user-points">
                <div class="points-left">
                  <div class="points-icon-small">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                  </div>
                  <span class="points-value">{{ globalStore.userPoints || 0 }}</span>
                </div>
                <button class="points-history-btn" @click.prevent="openPointsHistoryModal" title="查看积分记录">
                  <span class="points-history-text">积分记录</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
              <div class="dropdown-actions">
                <a href="#" class="dropdown-item" @click.prevent="openEditUserModal">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                  修改信息
                </a>
                <a href="#" class="dropdown-item" @click.prevent="logout">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" fill="none"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  退出登录
                </a>
                <a 
                  href="#" 
                  class="dropdown-item delete-account" 
                  @click.prevent="handleDeleteClick"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18l-2 13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 6z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"/>
                    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  注销
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 主要内容区域 -->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </main>
  </div>

  <!-- 绑定设备弹窗 -->
  <div v-if="showAddDeviceModal" class="device-modal" @click="closeAddDeviceModal">
    <div class="delete-modal-content" @click.stop>
      <div class="delete-modal-header">
        <h3>绑定设备</h3>
        <button class="delete-close-btn" @click="closeAddDeviceModal">X</button>
      </div>
      <div class="delete-modal-body">
        <input 
          class="input" 
          v-model="deviceForm.sn" 
          placeholder="请输入设备序列号 (SN)"
          @keyup.enter="submitAddDevice"
          :disabled="isAddingDevice"
        />
      </div>
      <div class="delete-modal-footer">
        <button class="cancel-btn" @click="closeAddDeviceModal" :disabled="isAddingDevice">
          取消
        </button>
        <button class="action-btn success" @click="submitAddDevice" :disabled="isAddingDevice || !deviceForm.sn.trim()">
          {{ isAddingDevice ? '绑定中...' : '绑定' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 注销确认弹窗 -->
  <div v-if="showDeleteConfirmModal" class="confirm-overlay" @click="closeDeleteConfirm">
    <div class="confirm-modal" @click.stop>
      <div class="confirm-header">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v4" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M12 17h.01" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <h3>确认注销账户</h3>
      </div>
      <div class="confirm-content">
        <p>此操作将<strong>永久删除</strong>您的账户以及所有相关数据，包括：</p>
        <ul>
          <li>所有设备数据</li>
          <li>所有历史记录</li>
          <li>所有设置和配置</li>
        </ul>
        <p class="warning-text">此操作<strong>无法撤销</strong>，请谨慎操作！</p>
      </div>
      <div class="confirm-actions">
        <button class="btn-cancel" @click="closeDeleteConfirm">取消</button>
        <button class="btn-delete" @click="confirmDelete">
          确认注销
        </button>
      </div>
    </div>
  </div>

  <!-- 修改用户信息弹窗 -->
  <div v-if="showEditUserModal" class="modal-overlay" @click="handleEditUserModalOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>修改信息</h2>
        <button class="close-btn" @click="closeEditUserModal">×</button>
      </div>
      <form @submit.prevent="updateUserInfo" class="user-form">
        <!-- 头像选择区域 -->
        <div class="avatar-section">
          <AvatarSelector 
            v-model="editUserForm.avatar"
            type="person"
            :current-user-avatar="globalStore.user?.account?.avatar || ''"
            @change="handleAvatarChange"
          />
        </div>
        
        <!-- 基本信息 -->
        <div class="form-row">
          <div class="form-group">
            <label>昵称 *</label>
            <input v-model="editUserForm.nickname" type="text" required placeholder="请输入昵称">
          </div>
          <div class="form-group">
            <label>性别 *</label>
            <select v-model="editUserForm.gender" required>
              <option value="other">其他</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>邮件</label>
            <input v-model="editUserForm.email" type="email" placeholder="请输入邮箱地址">
          </div>
          <div class="form-group">
            <label>电话 *</label>
            <input v-model="editUserForm.phone" type="tel" required placeholder="请输入电话号码">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>密码 <span class="field-hint">(至少6位，不填写则不修改)</span></label>
            <input v-model="editUserForm.password" type="password" placeholder="不填写则默认不修改">
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input v-model="editUserForm.confirmPassword" type="password" placeholder="请再次输入密码">
          </div>
        </div>
        
        <!-- 错误信息显示 -->
        <div v-if="editUserFormError" class="error-message">
          {{ editUserFormError }}
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeEditUserModal" class="cancel-btn">取消</button>
          <button type="submit" class="submit-btn" :disabled="isUpdatingUser">更新</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 消息日志弹窗 -->
  <div v-if="showMessageLogModal" class="device-modal" @click="closeMessageLogModal">
    <div class="message-log-modal-content" @click.stop>
      <div class="message-log-header">
        <h3>消息日志</h3>
        <button class="delete-close-btn" @click="closeMessageLogModal">X</button>
      </div>
      <div class="message-log-body">
        <div v-if="isLoadingReadMessages && readMessages.length === 0" class="loading-messages">
          加载中...
        </div>
        <div v-else-if="readMessages.length === 0" class="no-messages">
          暂无已读消息
        </div>
        <div v-else class="message-log-list">
          <div 
            v-for="message in readMessages" 
            :key="message.id" 
            class="message-log-item"
          >
            <div class="message-icon" :class="`level-${message.level}`">
              <svg v-if="message.level === 'low'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else-if="message.level === 'normal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else-if="message.level === 'error'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else-if="message.level === 'fatal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 8v4" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 16h.01" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.message }}</div>
              <div class="message-footer">
                <div v-if="getDeviceName(message.device_id)" class="message-device">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ getDeviceName(message.device_id) }}
                </div>
                <div class="message-meta">
                  <span class="message-level" :class="`level-${message.level}`">
                    {{ message.level === 'low' ? '低' : message.level === 'normal' ? '普通' : message.level === 'error' ? '错误' : message.level === 'fatal' ? '致命' : '未知' }}
                  </span>
                  <span class="message-time">{{ formatTime(message) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 加载更多按钮或没有更多提示 -->
          <div class="load-more-container">
            <button 
              v-if="hasMoreReadMessages"
              class="load-more-btn" 
              @click="loadMoreReadMessages"
              :disabled="isLoadingReadMessages"
            >
              {{ isLoadingReadMessages ? '加载中...' : '加载更多' }}
            </button>
            <div v-else-if="readMessages.length > 0" class="no-more-messages">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span>没有更多消息了</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 积分记录弹窗 -->
  <div v-if="showPointsHistoryModal" class="device-modal" @click="closePointsHistoryModal">
    <div class="points-history-modal-content" @click.stop>
      <div class="points-history-header">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="header-title">
            <h3>积分记录</h3>
            <p class="header-subtitle">当前积分: {{ globalStore.userPoints || 0 }}</p>
          </div>
        </div>
        <button class="delete-close-btn" @click="closePointsHistoryModal">X</button>
      </div>
      <div class="points-history-body">
        <div v-if="isLoadingPointsHistory && pointsHistory.length === 0" class="loading-messages">
          加载中...
        </div>
        <div v-else-if="pointsHistory.length === 0" class="no-messages">
          暂无积分记录
        </div>
        <div v-else class="points-history-list">
          <div 
            v-for="record in pointsHistory" 
            :key="record.id" 
            class="points-history-item"
          >
            <div class="points-content">
              <div class="points-description">
                {{ record.description }}
                <span class="points-amount" :class="{ 'positive': record.points > 0, 'negative': record.points < 0 }">
                  {{ record.points > 0 ? '+' : '' }}{{ record.points }}
                </span>
              </div>
              <div class="points-details">
                <span class="points-balance">余额: {{ record.balance }}</span>
                <span class="points-time">{{ formatPointsTime(record.created_at) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 加载更多按钮或没有更多提示 -->
          <div class="load-more-container">
            <button 
              v-if="hasMorePointsHistory"
              class="load-more-btn" 
              @click="loadMorePointsHistory"
              :disabled="isLoadingPointsHistory"
            >
              {{ isLoadingPointsHistory ? '加载中...' : '加载更多' }}
            </button>
            <div v-else-if="pointsHistory.length > 0" class="no-more-messages">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span>没有更多记录了</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 系统消息弹窗 -->
  <div v-if="showSystemMessageModal" class="device-modal" @click="closeSystemMessageModal">
    <div class="message-log-modal-content" @click.stop>
      <div class="message-log-header">
        <h3>系统消息</h3>
        <button class="delete-close-btn" @click="closeSystemMessageModal">X</button>
      </div>
      <div class="message-log-body">
        <div v-if="isLoadingSystemMessages && globalStore.systemMessages.length === 0" class="loading-messages">
          加载中...
        </div>
        <div v-else-if="globalStore.systemMessages.length === 0" class="no-messages">
          暂无系统消息
        </div>
        <div v-else class="message-log-list">
          <div 
            v-for="message in globalStore.systemMessages" 
            :key="message.id" 
            class="message-log-item"
          >
            <div class="message-icon" :class="`level-${message.priority}`">
              <!-- 根据消息类型显示不同图标 -->
              <svg v-if="message.type === 'announcement'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else-if="message.type === 'maintenance'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else-if="message.type === 'update'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M8 12h8" stroke="currentColor" stroke-width="2"/>
                <path d="M8 16h8" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else-if="message.type === 'alert'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.title }}</div>
              <div class="message-footer">
                <div class="message-meta">
                  <span class="message-level" :class="`level-${message.priority}`">{{ message.priority }}</span>
                  <span class="message-time">{{ new Date(message.created_at).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多按钮或没有更多提示 -->
        <div class="load-more-container">
          <button 
            v-if="hasMoreSystemMessages"
            class="load-more-btn" 
            @click="loadMoreSystemMessages"
            :disabled="isLoadingSystemMessages"
          >
            {{ isLoadingSystemMessages ? '加载中...' : '加载更多' }}
          </button>
          <div v-else-if="globalStore.systemMessages.length > 0" class="no-more-messages">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <span>没有更多消息了</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 系统通知弹窗 -->
  <div v-if="showSystemNotificationModal" class="device-modal" @click="closeSystemNotificationModal">
    <div class="message-log-modal-content" @click.stop>
      <div class="message-log-header">
        <h3>{{ currentSystemNotification?.typeText || getSystemMessageTypeText(currentSystemNotification?.type) || '系统通知' }}</h3>
        <button class="delete-close-btn" @click="closeSystemNotificationModal">X</button>
      </div>
      <div class="message-log-body" v-if="currentSystemNotification">
        <div class="notification-content">
          <div class="notification-icon" :class="`level-${currentSystemNotification.priority}`">
            <!-- 通知 -->
            <svg v-if="currentSystemNotification.type === 'notification'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- 公告 -->
            <svg v-else-if="currentSystemNotification.type === 'announcement'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- 警告 -->
            <svg v-else-if="currentSystemNotification.type === 'alert'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- 维护 -->
            <svg v-else-if="currentSystemNotification.type === 'maintenance'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- 更新 -->
            <svg v-else-if="currentSystemNotification.type === 'update'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- 默认图标 -->
            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="notification-details">
            <h4 class="notification-title">{{ currentSystemNotification.title }}</h4>
            <p class="notification-text">{{ currentSystemNotification.content }}</p>
            <div class="notification-meta">
              <span class="notification-type" :class="`type-${currentSystemNotification.type}`">
                {{ currentSystemNotification.typeText || getSystemMessageTypeText(currentSystemNotification.type) }}
              </span>
              <span class="notification-priority" :class="`level-${currentSystemNotification.priority}`">
                {{ currentSystemNotification.priority === 'low' ? '低' : currentSystemNotification.priority === 'normal' ? '普通' : currentSystemNotification.priority === 'high' ? '高' : currentSystemNotification.priority === 'urgent' ? '紧急' : currentSystemNotification.priority }}
              </span>
              <span class="notification-time">
                {{ new Date(currentSystemNotification.timestamp).toLocaleString('zh-CN') }}
              </span>
            </div>
            <div v-if="currentSystemNotification.device_id" class="notification-device">
              <span class="device-label">设备:</span>
              <span class="device-id">{{ currentSystemNotification.device_id }}</span>
            </div>
            <div v-if="currentSystemNotification.service_name" class="notification-service">
              <span class="service-label">服务:</span>
              <span class="service-name">{{ currentSystemNotification.service_name }}</span>
            </div>
          </div>
        </div>
        <div class="notification-actions">
          <button class="confirm-btn" @click="closeSystemNotificationModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initTheme, setTheme, DEFAULT_NO_AVATAR_URL } from '../utils/theme.js'
import { useGlobalStore } from '../stores/global'
import { deleteUser, markAllMessagesAsRead, updateUser, updateCurrentFamily } from '../api/users'
import { bindDeviceBySN, markMessageAsRead as markMessageAsReadAPI } from '../api/devices'
import { getPointsBalance, getPointsHistory } from '../api/points'
import { logout as logoutApi } from '../api/auth'
import { ElMessage } from 'element-plus'
import { getMQTTManager, clearMQTTManager } from '../utils/mqtt.js'
import AvatarSelector from '../components/AvatarSelector.vue'

// Index.vue 现在只作为布局容器，不需要导入具体的widget组件

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

// MQTT 管理器实例
let mqttManager = null
const mqttConnectionState = ref('disconnected')
// 跟踪当前已订阅的设备 SN 列表
const subscribedDeviceSNs = ref(new Set())

/**
 * 初始化MQTT连接
 */
const initMQTTConnection = async () => {
  try {
    const token = globalStore.token
    if (!token) {
      console.warn('MQTT连接失败: 缺少token')
      return
    }

    // 检查是否需要重新创建 MQTT 管理器（token 变化时）
    const currentToken = mqttManager?.options?.username || null
    
    if (!mqttManager || currentToken !== token) {
      // 先断开旧连接
      if (mqttManager) {
        mqttManager.disconnect()
      }
      // 清除全局 MQTT 实例
      clearMQTTManager()
      // 创建新的 MQTT 管理器
      // clientId 将在 connect 时自动生成，格式为: web_iot_${userId}_${时间戳}
      mqttManager = getMQTTManager({
        host: 'localhost', // 根据实际情况修改
        port: 8083, // 根据实际情况修改
        protocol: 'ws', // ws 或 wss
        path: '',
        // clientId 不在这里设置，由 mqtt.js 在 connect 时自动生成
        username: '', // 使用 token 作为用户名
        password: '', // 根据实际情况设置
        reconnectPeriod: 3000,
        connectTimeout: 30000,
        keepalive: 60,
        debug: false
      })

      // 监听连接状态变化
      mqttManager.on('stateChange', (state) => {
        mqttConnectionState.value = state
        
        // 根据连接状态设置或清除消息处理器
        switch (state) {
          case 'connected':
            console.log('MQTT已连接，设置消息处理器')
            // 连接成功时设置系统消息处理器
            mqttManager.setSystemMessageHandler(handleSystemMessage)
            // 设置家庭消息处理器
            mqttManager.setFamilyMessageHandler(handleFamilyMessage)
            // 更新家庭订阅（MQTT会自动订阅）
            mqttManager.updateHomeSubscription()
            
            // 订阅个人通知（暂时屏蔽）
            // const accountId = globalStore.user?.account?.id
            // if (accountId) {
            //   mqttManager.subscribePersonalNotice(accountId, handlePersonalNotice)
            //     .then(() => {
            //       console.log(`已订阅个人通知: client/${accountId}/notice`)
            //     })
            //     .catch((error) => {
            //       console.error('订阅个人通知失败:', error)
            //     })
            // }
            
            // 订阅所有设备的通知
            subscribeAllDeviceNotices()
            break
          case 'connecting':
            console.log('MQTT正在连接...')
            break
          case 'disconnected':
            console.log('MQTT已断开连接，清除消息处理器')
            // 断开连接时清除处理器
            mqttManager.clearSystemMessageHandler()
            mqttManager.clearFamilyMessageHandler()
            break
          case 'error':
            console.log('MQTT连接出错，清除消息处理器')
            // 连接错误时清除处理器
            mqttManager.clearSystemMessageHandler()
            mqttManager.clearFamilyMessageHandler()
            break
          default:
            console.log('未知的连接状态:', state)
        }
      })
    }

    // 连接MQTT（若已连接/连接中，内部会忽略）
    await mqttManager.connect()
  } catch (error) {
    console.error('MQTT连接失败:', error)
  }
}

/**
 * 断开MQTT连接
 */
const disconnectMQTT = async () => {
  try {
    if (mqttManager) {
      mqttManager.disconnect()
      mqttManager = null
    }
    clearMQTTManager()
  } catch (error) {
    console.warn('断开连接过程中出现错误:', error)
  }
}




// 控制用户下拉菜单显示
const showUserMenu = ref(false)

// 控制注销确认弹窗显示
const showDeleteConfirmModal = ref(false)

// 控制修改用户信息弹窗显示
const showEditUserModal = ref(false)
const isUpdatingUser = ref(false)
const editUserFormError = ref('')
const editUserForm = ref({
  nickname: '',
  gender: 'other',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  avatar: ''
})

// 控制绑定设备弹窗显示
const showAddDeviceModal = ref(false)

// 绑定设备表单数据
const deviceForm = ref({
  sn: ''
})

// 绑定设备加载状态
const isAddingDevice = ref(false)

// 通知相关
const showNotificationMenu = ref(false)
const showMessageLogModal = ref(false)
const unreadMessages = ref([])
const readMessages = ref([])
const isLoadingReadMessages = ref(false)
const readMessagesPage = ref(1)
const readMessagesLimit = ref(50)
const hasMoreReadMessages = ref(true)

// 积分相关
const showPointsHistoryModal = ref(false)
const pointsHistory = ref([])
const isLoadingPointsHistory = ref(false)
const pointsHistoryPage = ref(1)
const pointsHistoryLimit = ref(20)
const hasMorePointsHistory = ref(true)

// 系统消息相关
const showSystemMessageModal = ref(false)
const isLoadingSystemMessages = ref(false)
const systemMessagesPage = ref(1)
const systemMessagesLimit = ref(20)
const hasMoreSystemMessages = ref(true)

// 系统通知弹窗相关
const showSystemNotificationModal = ref(false)
const currentSystemNotification = ref(null)

// 当前主题
const currentTheme = ref('dark')

// 系统消息处理
const handleSystemMessage = (data) => {
  // 如果 data 为 undefined 或 null，直接返回
  if (!data) {
    console.warn('[系统消息] 收到空数据，跳过处理')
    return
  }
  
  // data 结构: { type, message, id, title, priority, platforms, extra, operator_account_id }
  // 直接使用 data，因为消息格式已经是扁平结构
  const messageType = data.type
  
  // 根据消息类型调用相应的处理函数
  if (messageType && ['notification', 'announcement', 'alert', 'maintenance', 'update'].includes(messageType)) {
    handleSystemMessageType(data)
  } else {
    console.warn('未知的系统消息类型:', messageType, data)
  }
}

// 获取系统消息类型的中文描述
const getSystemMessageTypeText = (type) => {
  const typeMap = {
    'notification': '通知',
    'announcement': '公告',
    'alert': '警告',
    'maintenance': '维护',
    'update': '更新'
  }
  return typeMap[type] || '通知'
}

// 处理系统消息类型（notification, announcement, alert, maintenance, update）
const handleSystemMessageType = (data) => {
  // 提取 message, type, priority
  const { id, message, type, priority, title, platforms, extra, operator_account_id } = data
  
  // 检查 message 是否为空
  if (!message || message.trim() === '') {
    console.log('[系统消息] message 为空，跳过 ElMessage 显示')
    // 即使 message 为空，也要保存到系统消息列表
    const timestampISO = new Date().toISOString()
    const systemMessage = {
      id: id || Date.now(),
      title: title || '系统消息',
      content: message || '',
      type: type || 'notification',
      priority: priority || 'normal',
      platforms: platforms || ['web'],
      extra: extra || {},
      created_at: timestampISO,
      updated_at: timestampISO
    }
    if (!globalStore.systemMessages) {
      globalStore.systemMessages = []
    }
    globalStore.systemMessages.unshift(systemMessage)
    // 刷新系统消息列表
    loadSystemMessages(1, false)
    return
  }
  
  // 非空，继续处理
  // 获取类型名称
  const typeName = getSystemMessageTypeText(type || 'notification')
  
  // 构建显示文本 "[类型] 消息内容"
  const displayText = `[${typeName}] ${message}`
  
  // 将时间戳转换为 ISO 字符串格式
  const timestampISO = new Date().toISOString()
  
  // 构建系统消息对象（符合 globalStore.systemMessages 的数据结构）
  const systemMessage = {
    id: id || Date.now(),
    title: title || '系统消息',
    content: message || '',
    type: type || 'notification',
    priority: priority || 'normal',
    platforms: platforms || ['web'],
    extra: extra || {},
    created_at: timestampISO,
    updated_at: timestampISO
  }
  
  // 更新 systemMessages（添加到数组开头）
  if (!globalStore.systemMessages) {
    globalStore.systemMessages = []
  }
  globalStore.systemMessages.unshift(systemMessage)
  
  // 根据优先级选择 ElMessage 类型（颜色）
  // low, normal → 绿色（success）
  // high → 黄色（warning）
  // urgent → 红色（error）
  let messageType = 'success' // 默认绿色
  if (priority === 'urgent') {
    messageType = 'error' // 红色
  } else if (priority === 'high') {
    messageType = 'warning' // 黄色
  }
  
  // 显示 ElMessage（5秒）
  ElMessage({
    message: displayText,
    type: messageType,
    duration: 5000,
    showClose: true
  })
  
  // 刷新系统消息列表
  loadSystemMessages(1, false)
}

// 设备消息处理
const handleDeviceNotice = (data) => {
  console.log('收到设备通知:', data)
  
  const messageType = data.type
  
  switch (messageType) {
    case 'message_read':
      handleDeviceMessageRead(data)
      break
    case 'all_messages_read':
      handleDeviceAllMessagesRead(data)
      break
    case 'device_name_updated':
      handleDeviceNameUpdated(data)
      break
    case 'device_unbind':
      handleDeviceUnbindNotice(data)
      break
    case 'device_bind':
      handleDeviceBindNotice(data)
      break
    default:
      console.warn('未知的设备消息类型:', messageType)
      ElMessage({
        message: data.message || '收到设备通知',
        type: 'info',
        duration: 3000,
        showClose: true
      })
  }
}

// 处理单条消息标记为已读
const handleDeviceMessageRead = (data) => {
  const { message, message_id, device_id, device_name, level } = data
  console.log(`[设备消息] 消息已读: ${message}`, { message_id, device_id, device_name })
  
  // 如果消息在当前未读列表中，移除它
  if (message_id) {
    const index = unreadMessages.value.findIndex(m => m.id === message_id)
    if (index > -1) {
      unreadMessages.value.splice(index, 1)
    }
    
    // 更新全局消息状态
    if (globalStore.deviceMessages && Array.isArray(globalStore.deviceMessages)) {
      const globalMessage = globalStore.deviceMessages.find(m => m.id === message_id)
      if (globalMessage) {
        globalMessage.status = 'read'
      }
    }
  }
  
  // 不显示通知，因为这是用户自己的操作
}

// 处理所有消息标记为已读
const handleDeviceAllMessagesRead = (data) => {
  const { message, device_id, account_id, operator_account_id } = data
  console.log(`[设备消息] 所有消息已读: ${message}`, { device_id, account_id })
  
  const currentAccountId = globalStore.user?.account?.id
  
  // 如果指定了设备ID，只清空该设备的未读消息
  if (device_id) {
      unreadMessages.value = unreadMessages.value.filter(msg => msg.device_id !== device_id)
      
      // 更新全局消息状态
      if (globalStore.deviceMessages && Array.isArray(globalStore.deviceMessages)) {
        globalStore.deviceMessages.forEach(msg => {
          if (msg.device_id === device_id) {
            msg.status = 'read'
          }
        })
      }
    } else {
      // 如果没有指定设备ID，清空所有未读消息
      unreadMessages.value = []
      
      // 更新全局消息状态
      if (globalStore.deviceMessages && Array.isArray(globalStore.deviceMessages)) {
        globalStore.deviceMessages.forEach(msg => {
          msg.status = 'read'
        })
      }
    }
  
  // 不显示通知，因为这是用户自己的操作
}

// 处理设备名称更新
const handleDeviceNameUpdated = (data) => {
  const { message, device_id, device_name, old_name, device_sn } = data
  console.log(`[设备消息] 设备名称更新: ${message}`, { device_id, device_name, old_name })
  
  // 更新全局设备列表中对应设备的名称
  if (device_id && device_name && globalStore.devices) {
    const device = globalStore.devices.find(d => d.id === device_id)
    if (device) {
      device.name = device_name
    }
  }
  
  ElMessage.success(message || '设备名称已更新')
}

// 处理设备绑定通知
const handleDeviceBindNotice = async (data) => {
  const { message, device_id, device_name, device_sn, account_id, family_id, operator_account_id } = data
  console.log(`[设备消息] 设备绑定: ${message}`, { device_id, device_name, device_sn, account_id, family_id })
  
  // 重新加载设备列表以获取新绑定的设备
  // watch 会自动监听设备列表变化并重新订阅
  await globalStore.loadDevices()
  
  // 重新加载设备消息以刷新消息列表
  await globalStore.loadDeviceMessages()
  
  // 更新未读消息列表
  updateUnreadMessages()
  
  ElMessage.success(message || '设备已绑定')
}

// 处理设备解绑通知
const handleDeviceUnbindNotice = async (data) => {
  const { message, device_id, device_name, device_sn, sn } = data
  console.log(`[设备消息] 设备解绑: ${message}`, { device_id, device_sn, sn })
  
  // 获取设备序列号
  const deviceSerialNumber = device_sn || sn
  
  // 取消订阅设备通知
  if (deviceSerialNumber && mqttManager && mqttManager.isConnected()) {
    try {
      await mqttManager.unsubscribeDeviceNotice(deviceSerialNumber)
      subscribedDeviceSNs.value.delete(deviceSerialNumber)
      console.log(`已取消订阅设备通知: device/${deviceSerialNumber}/notice`)
    } catch (error) {
      console.error(`取消订阅设备通知失败 (${deviceSerialNumber}):`, error)
    }
  }
  
  // 从未读消息列表中移除该设备的消息
  if (device_id) {
    unreadMessages.value = unreadMessages.value.filter(msg => msg.device_id !== device_id)
  }
  
  // 重新加载设备列表以移除已解绑的设备
  await globalStore.loadDevices()
  
  // 重新加载设备消息以刷新消息列表
  await globalStore.loadDeviceMessages()
  
  // 更新未读消息列表
  updateUnreadMessages()
  
  ElMessage.success(message || '设备已解绑')
}

/**
 * 订阅所有设备的通知
 */
const subscribeAllDeviceNotices = async () => {
  if (!mqttManager || !mqttManager.isConnected()) {
    return
  }
  
  if (!globalStore.devices || !Array.isArray(globalStore.devices)) {
    return
  }
  
  const currentDeviceSNs = new Set()
  
  // 订阅所有设备的通知
  for (const device of globalStore.devices) {
    if (device.sn) {
      currentDeviceSNs.add(device.sn)
      
      // 如果还未订阅，则订阅
      if (!subscribedDeviceSNs.value.has(device.sn)) {  
        try {
          await mqttManager.subscribeDeviceNotice(device.sn, handleDeviceNotice)
          subscribedDeviceSNs.value.add(device.sn)
          console.log(`已订阅设备通知: device/${device.sn}/notice`)
        } catch (error) {
          console.error(`订阅设备通知失败 (${device.sn}):`, error)
        }
      }
    }
  }
  
  // 取消订阅不在当前设备列表中的设备
  for (const sn of subscribedDeviceSNs.value) {
    if (!currentDeviceSNs.has(sn)) {
      try {
        await mqttManager.unsubscribeDeviceNotice(sn)
        subscribedDeviceSNs.value.delete(sn)
        console.log(`已取消订阅设备通知: device/${sn}/notice`)
      } catch (error) {
        console.error(`取消订阅设备通知失败 (${sn}):`, error)
      }
    }
  }
}

// 个人消息处理（暂时屏蔽）
const handlePersonalNotice = (data) => {
  // 暂时屏蔽个人消息处理
  return
  
  console.log('收到个人通知:', data)
  
  // 根据消息类型进行不同处理
  const messageType = data.type
  
  // 获取当前用户的 account_id
  const currentAccountId = globalStore.user?.account?.id
  const operatorAccountId = data.operator_account_id
  
  // 判断是否是当前用户自己操作产生的通知
  // points_adjusted 和 feedback_replied 的 operator_account_id 是管理员 ID，不会与当前用户相同
  const shouldSkipSelfOperation = currentAccountId && 
                                   operatorAccountId && 
                                   currentAccountId === operatorAccountId
  
  if (shouldSkipSelfOperation) {
    console.log('[个人通知] 忽略当前用户自己操作产生的通知:', messageType)
    return
  }
  
  // 1. feedback_created: 反馈创建通知
  if (messageType === 'feedback_created') {
    ElMessage({
      message: data.message || '反馈已创建',
      type: 'success',
      duration: 3000,
      showClose: true
    })
    return
  }
  
  // 2. check_in_success: 签到成功通知
  if (messageType === 'check_in_success') {
    const { message, points_earned, continuous_days, check_in_type } = data
    const displayMessage = message || `签到成功！获得 ${points_earned || 0} 积分，连续签到 ${continuous_days || 0} 天`
    
    ElMessage({
      message: displayMessage,
      type: check_in_type === 'bonus' ? 'success' : 'success', // 连续7天及以上显示成功
      duration: 4000,
      showClose: true
    })
    
    // 更新积分显示（如果 store 中有积分相关状态）
    if (globalStore.user?.account && points_earned) {
      // 可以在这里更新积分显示，具体实现取决于 store 结构
      console.log(`[签到] 获得积分: ${points_earned}, 连续签到: ${continuous_days} 天`)
    }
    
    return
  }
  
  // 3. points_adjusted: 积分调整通知
  if (messageType === 'points_adjusted') {
    const { message, points, old_balance, new_balance, points_type, description } = data
    const isReward = points > 0
    const displayMessage = message || `${isReward ? '奖励' : '扣除'} ${Math.abs(points)} 积分`
    
    ElMessage({
      message: displayMessage,
      type: isReward ? 'success' : 'warning',
      duration: 4000,
      showClose: true
    })
    
    // 更新积分显示
    if (globalStore.user?.account) {
      // 可以在这里更新积分显示，具体实现取决于 store 结构
      console.log(`[积分调整] ${isReward ? '奖励' : '扣除'} ${Math.abs(points)} 积分, 余额: ${old_balance} -> ${new_balance}, 类型: ${points_type}`)
    }
    
    return
  }
  
  // 4. feedback_replied: 反馈回复通知
  if (messageType === 'feedback_replied') {
    const { message, feedback_id } = data
    ElMessage({
      message: message || '反馈已回复',
      type: 'success',
      duration: 4000,
      showClose: true
    })
    
    // 可以在这里添加跳转到反馈详情的逻辑
    if (feedback_id) {
      console.log(`[反馈回复] 反馈ID: ${feedback_id}`)
    }
    
    return
  }
  
  // 其他未知类型的消息，显示通用通知
  ElMessage({
    message: data.message || data.title || '收到个人通知',
    type: 'info',
    duration: 3000,
    showClose: true
  })
}

// 家庭消息处理
const handleFamilyMessage = (data) => {
  console.log('收到家庭消息:', data)
  
  // 扁平化结构，直接在顶层包含所有字段
  // 根据消息类型调用相应的处理函数
  switch (data.type) {
    case 'family_member_added':
      handleFamilyMemberAdded(data)
      break
    case 'family_member_updated':
      handleFamilyMemberUpdated(data)
      break
    case 'family_member_removed':
      handleFamilyMemberRemoved(data)
      break
    case 'family_deleted':
      handleFamilyDeleted(data)
      break
    case 'device_added_to_family':
      handleDeviceAddedToFamily(data)
      break
    case 'device_removed_from_family':
      handleDeviceRemovedFromFamily(data)
      break
    case 'member_info_updated':
      handleMemberInfoUpdated(data)
      break
    case 'account_deleted':
      handleAccountDeleted(data)
      break
    default:
      console.warn('未知的家庭消息类型:', data.type)
  }
}

// 新的家庭消息处理函数（扁平化格式）

// 处理成员加入家庭事件
const handleFamilyMemberAdded = async (data) => {
  const { message, family_id, family_name, operator_account_id } = data
  console.log(`[家庭消息] 成员加入: ${message}`)
  
  // 如果当前正在查看该家庭，重新加载成员数据和设备列表
  const currentFamilyId = globalStore.user?.account?.current_family_id
  if (currentFamilyId === family_id) {
    await globalStore.loadAll()
  }
  
  ElMessage.success(message || '成员已加入家庭')
}

// 处理成员昵称更新事件
const handleFamilyMemberUpdated = async (data) => {
  const { message, family_id, family_name, operator_account_id } = data
  console.log(`[家庭消息] 成员昵称更新: ${message}`)
  
  const currentFamilyId = globalStore.user?.account?.current_family_id
  
  // 检查是否是当前家庭的成员更新
  if (family_id !== currentFamilyId || !globalStore.familyMembers?.length) {
    return
  }
  
  // 重新加载成员数据以获取最新的昵称
  await globalStore.loadFamilyMembers(family_id)
  
  ElMessage.success(message || '成员昵称已更新')
}

// 处理成员被移除事件
const handleFamilyMemberRemoved = async (data) => {
  const { message, family_id, family_name, operator_account_id, removed_account_id } = data
  console.log(`[家庭消息] 成员被移除: ${message}`)
  
  const currentAccountId = globalStore.user?.account?.id
  const currentFamilyId = globalStore.user?.account?.current_family_id
  const isCurrentUser = removed_account_id === currentAccountId
  
  // 如果移除的是当前用户，切回个人设备管理
  if (isCurrentUser && currentFamilyId === family_id) {
    try {
      // 调用切换家庭 API，传入 null 表示切回个人设备管理
      const accountData = await updateCurrentFamily(null)
      
      // 根据返回的数据更新本地 user 数据
      if (accountData) {
        globalStore.updateUserInfo({
          nickname: accountData.nickname,
          gender: accountData.gender,
          phone: accountData.phone,
          email: accountData.email,
          avatar: accountData.avatar,
          current_family_id: accountData.current_family_id
        })
      }
      
      // 清空家庭成员数据
      globalStore.familyMembers = []
      
      // 重新加载设备列表（个人设备）
      await globalStore.loadDevices()
      
      // 如果当前在 Family 页面，跳转到 Home 页面
      if (route.path === '/family') {
        router.push('/home')
      }
      
      ElMessage.success('您已被移除，已切回个人设备管理')
      return
    } catch (error) {
      console.error('切回个人设备管理失败:', error)
      ElMessage.error('切回个人设备管理失败，请刷新页面')
      return
    }
  }
  
  // 如果移除的是其他成员，重新加载成员数据和设备列表
  if (currentFamilyId === family_id) {
    await globalStore.loadAll()
  }
  
  ElMessage.success(message || '成员已移除')
}

// 处理家庭被删除事件
const handleFamilyDeleted = async (data) => {
  const { message, family_id, family_name, deleted_by_account_id, platform, operator_account_id, removed_account_id } = data
  console.log(`[家庭消息] 家庭被删除: ${message}`)
  
  const currentAccountId = globalStore.user?.account?.id
  const currentFamilyId = globalStore.user?.account?.current_family_id
  const isCurrentUser = removed_account_id === currentAccountId
  
  // 如果删除的是当前家庭
  if (currentFamilyId === family_id) {
    globalStore.familyMembers = []
    // 清空当前家庭ID
    globalStore.updateUserInfo({ current_family_id: null })
    // 重新加载设备列表（会加载个人设备）
    await globalStore.loadDevices()
    
    // 如果当前用户被移除导致家庭被删除，且当前在 Family 页面，跳转到 Home 页面
    if (isCurrentUser && route.path === '/family') {
      router.push('/home')
    }
  }
  
  // 重新加载家庭列表
  await globalStore.loadFamilys()
  
  ElMessage.success(message || '家庭已删除')
}

// 处理设备添加到家庭事件
const handleDeviceAddedToFamily = async (data) => {
  const { message, device_id, device_name, device_sn, operator_account_id } = data
  console.log(`[家庭消息] 设备添加到家庭: ${message}`)
  
  // 重新加载设备列表以获取新添加的设备
  // watch 会自动监听设备列表变化并重新订阅
  await globalStore.loadDevices()
  
  ElMessage.success(message || '设备已添加到家庭')
}

// 处理设备从家庭移除事件
const handleDeviceRemovedFromFamily = async (data) => {
  const { message, device_id, device_name, device_sn, operator_account_id } = data
  console.log(`[家庭消息] 设备从家庭移除: ${message}`)
  
  // 取消订阅设备通知
  if (device_sn && mqttManager && mqttManager.isConnected()) {
    mqttManager.unsubscribeDeviceNotice(device_sn)
      .then(() => {
        console.log(`已取消订阅设备通知: device/${device_sn}/notice`)
      })
      .catch((error) => {
        console.error(`取消订阅设备通知失败 (${device_sn}):`, error)
      })
  }
  
  // 重新加载设备列表以移除已移除的设备
  await globalStore.loadDevices()
  
  ElMessage.success(message || '设备已从家庭中移除')
}

// 处理成员信息更新事件
const handleMemberInfoUpdated = async (data) => {
  const { message, account_id, updated_fields, platform, operator_account_id } = data
  console.log(`[家庭消息] 成员信息更新: ${message}`, { account_id, updated_fields, platform })
  
  const currentAccountId = globalStore.user?.account?.id
  const currentFamilyId = globalStore.user?.account?.current_family_id
  
  // 如果是当前用户更新了信息
  if (account_id === currentAccountId) {
    // 如果当前在家庭中，重新加载家庭成员数据（包含账户信息）
    if (currentFamilyId) {
      await globalStore.loadFamilyMembers(currentFamilyId)
      // 从家庭成员数据中更新当前用户信息
      const currentMember = globalStore.familyMembers?.find(m => m.account?.id === currentAccountId)
      if (currentMember?.account) {
        globalStore.updateUserInfo({
          nickname: currentMember.account.nickname,
          gender: currentMember.account.gender,
          phone: currentMember.account.phone,
          email: currentMember.account.email,
          avatar: currentMember.account.avatar
        })
      }
    } else {
      // 如果不在家庭中，重新加载所有数据以获取最新用户信息
      await globalStore.loadAll()
    }
  } else if (currentFamilyId) {
    // 如果是其他成员更新了信息，且当前在家庭中，重新加载家庭成员数据
    await globalStore.loadFamilyMembers(currentFamilyId)
  }
  
  ElMessage.success(message || '成员信息已更新')
}

// 处理账号注销事件
const handleAccountDeleted = async (data) => {
  const { message, account_id, reason, platform, operator_account_id, home_id, family_id } = data
  console.log(`[家庭消息] 账号注销: ${message}`, { account_id, reason, platform, home_id, family_id })
  
  const currentAccountId = globalStore.user?.account?.id
  const currentFamilyId = globalStore.user?.account?.current_family_id
  const deletedAccountFamilyId = family_id || (home_id ? parseInt(home_id) : null)
  
  // 如果是当前用户注销了账号，需要退出登录
  if (account_id === currentAccountId) {
    // 显示警告消息
    ElMessage.warning({
      message: '您的账号已注销',
      duration: 5000,
      showClose: true
    })
    
    // 断开 MQTT 连接
    if (mqttManager && mqttManager.isConnected()) {
      disconnectMQTT().then(() => {
        console.log('MQTT 连接已断开（账号注销）')
      }).catch(disconnectError => {
        console.warn('断开 MQTT 连接失败:', disconnectError)
      })
    }
    
    // 延迟后执行退出登录流程
    setTimeout(() => {
      // 清除认证状态并跳转
      globalStore.clearAuth()
      showUserMenu.value = false
      router.push('/login')
    }, 500)
    return
  }
  
  // 如果被注销账号所在的家庭是当前家庭，切换到个人设备管理
  if (deletedAccountFamilyId && currentFamilyId === deletedAccountFamilyId) {
    try {
      // 调用切换家庭 API，传入 null 表示切回个人设备管理
      const accountData = await updateCurrentFamily(null)
      
      // 根据返回的数据更新本地 user 数据
      if (accountData) {
        globalStore.updateUserInfo({
          nickname: accountData.nickname,
          gender: accountData.gender,
          phone: accountData.phone,
          email: accountData.email,
          avatar: accountData.avatar,
          current_family_id: accountData.current_family_id
        })
      }
      
      // 清空家庭成员数据
      globalStore.familyMembers = []
      
      // 重新加载设备列表（个人设备）
      await globalStore.loadDevices()
      
      // 如果当前在 Family 页面，跳转到 Home 页面
      if (route.path === '/family') {
        router.push('/home')
      }
      
      ElMessage.warning('该家庭有成员注销账号，已切回个人设备管理')
      return
    } catch (error) {
      console.error('切回个人设备管理失败:', error)
      ElMessage.error('切回个人设备管理失败，请刷新页面')
    }
  }
  
  // 如果是当前家庭的其他成员注销，重新加载成员数据以移除已注销的成员
  if (currentFamilyId && currentFamilyId === deletedAccountFamilyId) {
    await globalStore.loadFamilyMembers(currentFamilyId)
  }
  
  ElMessage.info(message || '成员账号已注销')
}

// 导航配置
const navigationItems = ref([
  { id: 'home', name: 'Home', route: '/home', icon: 'home' },
  { id: 'family', name: 'Family', route: '/family', icon: 'family' },
  { id: 'mall', name: 'Mall', route: '/mall', icon: 'mall' },
  { id: 'settings', name: '设置', route: '/settings', icon: 'settings' }
])

// 当前活动导航项
const activeNavItem = computed(() => {
  const currentPath = route.path
  const navItem = navigationItems.value.find(item => item.route === currentPath)
  return navItem ? navItem.id : 'home'
})

// 导航切换函数
const navigateTo = (navItem) => {
  if (navItem.route) {
    router.push(navItem.route)
  }
}

// 角色文本转换
const getRoleText = (role) => {
  const roleMap = {
    'user': '用户',
    'admin': '管理员'
  }
  return roleMap[role] || '未知'
}

// 性别文本转换
const getGenderText = (gender) => {
  const genderMap = {
    'male': '男',
    'female': '女',
    'other': '其他'
  }
  return genderMap[gender] || '未知'
}

// 退出登录
const logout = async () => {
  // 调用退出登录 API（即使失败也继续执行退出流程）
  try {
    await logoutApi()
  } catch (error) {
    console.error('退出登录失败:', error)
    // request.js 已统一处理错误，这里只确保即使失败也继续执行后续流程
  }
  
  //延迟500毫秒后执行退出登录流程
  setTimeout(() => {
    // 断开 MQTT 连接（不等待结果）
    disconnectMQTT().then(() => {
      console.log('MQTT 连接已断开')
    }).catch(disconnectError => {
      console.warn('断开 MQTT 连接失败:', disconnectError)
    })
    // 立即清除认证状态并跳转
    globalStore.clearAuth()
    showUserMenu.value = false
    router.push('/login')
  }, 500)
}

// 操作：设置为明亮/黑暗
const setToLight = () => {
  setTheme('light')
  currentTheme.value = 'light'
}
const setToDark = () => {
  setTheme('dark')
  currentTheme.value = 'dark'
}

// 切换用户下拉菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 关闭用户下拉菜单
const closeUserMenu = () => {
  showUserMenu.value = false
}

// 打开修改用户信息弹窗
const openEditUserModal = () => {
  const user = globalStore.user?.account
  if (user) {
    editUserForm.value = {
      nickname: user.nickname || '',
      gender: user.gender || 'other',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
      avatar: user.avatar || ''
    }
    editUserFormError.value = ''
    showEditUserModal.value = true
    showUserMenu.value = false
  }
}

// 关闭修改用户信息弹窗
const closeEditUserModal = () => {
  showEditUserModal.value = false
  editUserFormError.value = ''
  editUserForm.value = {
    nickname: '',
    gender: 'other',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: ''
  }
}

// 处理模态框背景点击
const handleEditUserModalOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    closeEditUserModal()
  }
}

// 处理头像变化
const handleAvatarChange = (avatar) => {
  editUserForm.value.avatar = avatar
}

// 验证密码
const validatePassword = (password, confirmPassword, isEdit = false) => {
  // 编辑模式下，密码为空则不验证
  if (isEdit && !password && !confirmPassword) {
    return { valid: true }
  }
  
  if (!password || password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  
  if (password !== confirmPassword) {
    return { valid: false, message: '两次输入的密码不一致' }
  }
  
  return { valid: true }
}

// 更新用户信息
const updateUserInfo = async () => {
  editUserFormError.value = ''
  
  // 验证密码
  const passwordValidation = validatePassword(editUserForm.value.password, editUserForm.value.confirmPassword, true)
  if (!passwordValidation.valid) {
    editUserFormError.value = passwordValidation.message
    return
  }
  
  isUpdatingUser.value = true
  
  try {
    // 构建更新数据
    const updateData = {
      nickname: editUserForm.value.nickname,
      gender: editUserForm.value.gender,
      email: editUserForm.value.email,
      phone: editUserForm.value.phone,
      avatar: editUserForm.value.avatar
    }
    
    // 如果有密码，需要加密
    if (editUserForm.value.password) {
      updateData.password = await globalStore.encryptPassword(editUserForm.value.password)
    }

    await updateUser(updateData)
    
    // 当用户没有选择家庭时，接口调用成功后更新用户信息
    const currentFamilyId = globalStore.user?.account?.current_family_id
    if (currentFamilyId === null || currentFamilyId === undefined) {
      globalStore.updateUserInfo(updateData)
    }
    
    closeEditUserModal()
  } catch (error) {
    console.error('更新用户信息失败:', error)
    editUserFormError.value = error.response?.data?.detail || '更新用户信息失败，请重试'
  } finally {
    isUpdatingUser.value = false
  }
}

// 通知相关方法
const toggleNotificationMenu = () => {
  showNotificationMenu.value = !showNotificationMenu.value
  if (showNotificationMenu.value) {
    updateUnreadMessages()
  }
}

const closeNotificationMenu = () => {
  showNotificationMenu.value = false
}

// 关闭所有菜单
const closeAllMenus = () => {
  closeUserMenu()
  closeNotificationMenu()
}

// 切换消息通知菜单并关闭用户菜单
const toggleNotificationMenuAndCloseUserMenu = () => {
  closeUserMenu()
  toggleNotificationMenu()
}

// 切换用户菜单并关闭消息通知菜单
const toggleUserMenuAndCloseNotificationMenu = () => {
  closeNotificationMenu()
  toggleUserMenu()
}

// 更新未读消息（从已加载的数据中过滤）
const updateUnreadMessages = () => {
  if (!globalStore.deviceMessages || !Array.isArray(globalStore.deviceMessages)) {
    unreadMessages.value = []
    return
  }
  unreadMessages.value = globalStore.deviceMessages.filter(msg => msg.status === 'new')
}

// 加载已读消息（分页）
const loadReadMessages = async (page = 1, append = false) => {
  if (!globalStore.user) return
  
  isLoadingReadMessages.value = true
  
  const messages = await globalStore.loadReadDeviceMessages({
    limit: readMessagesLimit.value,
    skip: (page - 1) * readMessagesLimit.value
  }).finally(() => {
    isLoadingReadMessages.value = false
  })
  
  if (append) {
    readMessages.value = [...readMessages.value, ...messages]
  } else {
    readMessages.value = messages
  }
  
  // 判断是否还有更多数据
  hasMoreReadMessages.value = messages.length === readMessagesLimit.value
  readMessagesPage.value = page
}

// 打开消息日志弹窗
const openMessageLogModal = () => {
  showMessageLogModal.value = true
  showNotificationMenu.value = false
  // 重置分页状态并加载第一页
  readMessagesPage.value = 1
  hasMoreReadMessages.value = true
  loadReadMessages(1, false)
}

// 关闭消息日志弹窗
const closeMessageLogModal = () => {
  showMessageLogModal.value = false
  // 清空已读消息列表
  readMessages.value = []
}

// 加载更多已读消息
const loadMoreReadMessages = () => {
  if (!isLoadingReadMessages.value && hasMoreReadMessages.value) {
    // 加载下一页：skip = 当前已加载的数量，limit = 每页数量
    const nextPage = readMessagesPage.value + 1
    loadReadMessages(nextPage, true)
  }
}

// 直接加载更多消息的函数
const loadMoreReadMessagesDirect = async (skip, limit) => {
  if (!globalStore.user) return
  
  isLoadingReadMessages.value = true
  
  const messages = await globalStore.loadReadDeviceMessages({
    limit: limit,
    skip: skip
  }).finally(() => {
    isLoadingReadMessages.value = false
  })
  
  // 追加到现有消息列表
  readMessages.value = [...readMessages.value, ...messages]
  
  // 判断是否还有更多数据：如果返回的消息数量等于请求的limit，说明可能还有更多
  hasMoreReadMessages.value = messages.length === limit
  readMessagesPage.value = Math.floor(skip / readMessagesLimit.value) + 1
}

// 积分相关方法
const loadUserPoints = async () => {
  try {
    const response = await getPointsBalance()
    // API 返回格式: { balance: number }
    globalStore.userPoints = response.balance || 0
    console.log('[积分] 已加载积分余额:', globalStore.userPoints)
  } catch (error) {
    console.error('获取积分余额失败:', error)
    globalStore.userPoints = 0
  }
}

const loadPointsHistory = async (page = 1, append = false) => {
  if (!globalStore.user?.account?.id) return
  
  isLoadingPointsHistory.value = true
  
  try {
    const response = await getPointsHistory({
      skip: (page - 1) * pointsHistoryLimit.value,
      limit: pointsHistoryLimit.value
    })
    
    if (append) {
      pointsHistory.value = [...pointsHistory.value, ...response]
    } else {
      pointsHistory.value = response
    }
    
    // 判断是否还有更多数据
    hasMorePointsHistory.value = response.length === pointsHistoryLimit.value
    pointsHistoryPage.value = page
  } catch (error) {
    console.error('获取积分历史失败:', error)
  } finally {
    isLoadingPointsHistory.value = false
  }
}

const openPointsHistoryModal = () => {
  showPointsHistoryModal.value = true
  showUserMenu.value = false
  // 重置分页状态并加载第一页
  pointsHistoryPage.value = 1
  hasMorePointsHistory.value = true
  loadPointsHistory(1, false)
}

const closePointsHistoryModal = () => {
  showPointsHistoryModal.value = false
  // 清空积分历史列表
  pointsHistory.value = []
}

const loadMorePointsHistory = () => {
  if (!isLoadingPointsHistory.value && hasMorePointsHistory.value) {
    // 计算累积的 limit 和 skip
    const currentSkip = pointsHistory.value.length
    const nextLimit = currentSkip + 20  // limit = skip + 20
    
    loadMorePointsHistoryDirect(currentSkip, nextLimit)
  }
}

// 系统消息相关方法
const loadSystemMessages = async (page = 1, append = false) => {
  if (!globalStore.user) return
  
  isLoadingSystemMessages.value = true
  
  const messages = await globalStore.loadSystemMessages({
    limit: systemMessagesLimit.value,
    skip: (page - 1) * systemMessagesLimit.value
  }).finally(() => {
    isLoadingSystemMessages.value = false
  })
  
  if (append) {
    globalStore.systemMessages = [...globalStore.systemMessages, ...messages]
  } else {
    globalStore.systemMessages = messages
  }
  
  // 判断是否还有更多数据
  hasMoreSystemMessages.value = messages.length === systemMessagesLimit.value
  systemMessagesPage.value = page
}

const openSystemMessageModal = () => {
  showSystemMessageModal.value = true
  showNotificationMenu.value = false
  // 重置分页状态并加载第一页
  systemMessagesPage.value = 1
  hasMoreSystemMessages.value = true
  loadSystemMessages(1, false)
}

const closeSystemMessageModal = () => {
  showSystemMessageModal.value = false
  // 清空系统消息列表
  globalStore.systemMessages = []
}

const loadMoreSystemMessages = () => {
  if (!isLoadingSystemMessages.value && hasMoreSystemMessages.value) {
    loadSystemMessages(systemMessagesPage.value + 1, true)
  }
}

// 直接加载更多积分记录的函数
const loadMorePointsHistoryDirect = async (skip, limit) => {
  if (!globalStore.user?.account?.id) return
  
  isLoadingPointsHistory.value = true
  
  try {
    const response = await getPointsHistory({
      skip: skip,
      limit: limit
    })
    
    // 追加到现有积分历史列表
    pointsHistory.value = [...pointsHistory.value, ...response]
    
    // 判断是否还有更多数据
    hasMorePointsHistory.value = response.length === (limit - skip)
    pointsHistoryPage.value = Math.floor(skip / 20) + 1
  } catch (error) {
    console.error('加载更多积分历史失败:', error)
  } finally {
    isLoadingPointsHistory.value = false
  }
}

const formatPointsTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 一键已读
const markAllAsRead = async () => {
  console.log('标记所有消息为已读')
  
  try {
    // 调用API标记所有消息为已读
    const currentFamilyId = globalStore.user?.account?.current_family_id
    await markAllMessagesAsRead(currentFamilyId)
    
    // 当用户没有选择家庭时，接口调用成功后本地更新消息状态
    if (currentFamilyId === null || currentFamilyId === undefined) {
      // 更新全局消息状态为已读
      if (globalStore.deviceMessages && Array.isArray(globalStore.deviceMessages)) {
        globalStore.deviceMessages.forEach(msg => {
          msg.status = 'read'
        })
      }
      // 清空未读消息列表
      unreadMessages.value = []
    }
    
    closeNotificationMenu()
  } catch (error) {
    console.error('标记所有消息为已读失败:', error)
  }
}

// 标记单条消息为已读
const markMessageAsRead = async (message) => {
  console.log('标记消息为已读:', message.id)
  
  try {
    // 调用API标记消息为已读
    const currentFamilyId = globalStore.user?.account?.current_family_id
    await markMessageAsReadAPI(message.id, currentFamilyId)
    
    // 当用户没有选择家庭时，接口调用成功后本地更新消息状态
    if (currentFamilyId === null || currentFamilyId === undefined) {
      // 更新全局消息状态为已读
      if (globalStore.deviceMessages && Array.isArray(globalStore.deviceMessages)) {
        const globalMessage = globalStore.deviceMessages.find(m => m.id === message.id)
        if (globalMessage) {
          globalMessage.status = 'read'
        }
      }
      // 从未读消息列表中移除该消息
      const index = unreadMessages.value.findIndex(m => m.id === message.id)
      if (index > -1) {
        unreadMessages.value.splice(index, 1)
      }
    }
  } catch (error) {
    console.error('标记消息为已读失败:', error)
  }
}

// 格式化时间 - 优先显示updated_at，否则显示created_at
const formatTime = (message) => {
  // 优先使用updated_at，如果为null则使用created_at
  const timeString = message.updated_at || message.created_at
  if (!timeString) return ''
  
  const date = new Date(timeString)
  
  // 格式化为 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取设备名字
const getDeviceName = (deviceId) => {
  const device = globalStore.devices.find(d => d.id === deviceId)
  return device ? device.name : '未知设备'
}

// 显示注销确认弹窗
const showDeleteConfirm = () => {
  showDeleteConfirmModal.value = true
  showUserMenu.value = false
}

// 处理注销按钮点击
const handleDeleteClick = () => {
  showDeleteConfirm()
}

// 打开绑定设备弹窗
const openAddDeviceModal = () => {
  showAddDeviceModal.value = true
  deviceForm.value.sn = ''
}

// 关闭绑定设备弹窗
const closeAddDeviceModal = () => {
  showAddDeviceModal.value = false
  deviceForm.value.sn = ''
  isAddingDevice.value = false
}

// 提交绑定设备表单
const submitAddDevice = async () => {
  if (!deviceForm.value.sn.trim()) {
    ElMessage.warning('请输入设备序列号')
    return
  }

  isAddingDevice.value = true
  
  try {
    const currentFamilyId = globalStore.user?.account?.current_family_id
    await bindDeviceBySN(deviceForm.value.sn.trim(), currentFamilyId)
    
    // 重新加载设备列表（watch 会自动监听设备列表变化并重新订阅）
    await globalStore.loadDevices()
    
    // 重新加载设备消息以刷新消息列表
    await globalStore.loadDeviceMessages()
    
    // 更新未读消息列表
    updateUnreadMessages()
    
    closeAddDeviceModal()
    ElMessage.success('设备绑定成功')
  } catch (error) {
    console.error('绑定设备失败:', error)
  } finally {
    isAddingDevice.value = false
  }
}

// 关闭注销确认弹窗
const closeDeleteConfirm = () => {
  showDeleteConfirmModal.value = false
}

// 确认注销账户
const confirmDelete = async () => {
  try {
    // 调用删除用户API
    await deleteUser()
    
      // 当用户没有选择家庭时，接口调用成功后执行清理操作
      const currentFamilyId = globalStore.user?.account?.current_family_id
      if (currentFamilyId === null || currentFamilyId === undefined) {
        // 断开 MQTT 连接（不等待结果）
        disconnectMQTT().then(() => {
          console.log('MQTT 连接已断开（注销账户）')
        }).catch(disconnectError => {
          console.warn('断开 MQTT 连接失败:', disconnectError)
        })
      
      // 延迟500毫秒后执行清理流程
      setTimeout(() => {
        // 清除认证状态并跳转
        globalStore.clearAuth()
        showDeleteConfirmModal.value = false
        showUserMenu.value = false
        router.push('/login')
      }, 500)
    } else {
      // 如果选择了家庭，只关闭弹窗
      showDeleteConfirmModal.value = false
    }
  } catch (error) {
    console.error('注销账户失败:', error)
  }
}

// 监听未读消息变化，自动更新未读消息列表
watch(() => globalStore.deviceMessages, () => {
  updateUnreadMessages()
}, { deep: true })

// 初始化主题
onMounted(async () => {
  const theme = initTheme()
  currentTheme.value = theme
  
  // 确保用户认证状态已恢复后再初始化 MQTT 连接
  // App.vue 的 onMounted 会在 index.vue 之前执行，所以这里应该已经有 token 了
  // 但为了保险起见，添加一个短暂的延迟确保 restoreAuth 完成
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 初始化 MQTT 连接
  if (globalStore.token) {
    await initMQTTConnection()
  }
  
  // 加载所有数据
  globalStore.loadAll()
  
  // 加载积分数据
  loadUserPoints()
  
})

// 监听当前家庭ID变化，切换家庭时更新订阅
watch(() => globalStore.user?.account?.current_family_id, async (newFamilyId, oldFamilyId) => {
  if (mqttConnectionState.value !== 'connected' || !mqttManager) {
    return
  }
  
  // 如果家庭ID发生变化，更新订阅
  if (newFamilyId !== oldFamilyId) {
    // MQTT会自动处理家庭订阅的更新
    mqttManager.updateHomeSubscription()
    // watch 会自动监听设备列表变化并重新订阅
  }
})

// 监听设备列表变化，重新订阅设备通知
watch(() => globalStore.devices, async (newDevices, oldDevices) => {
  if (mqttConnectionState.value !== 'connected' || !mqttManager) {
    return
  }
  
  // 只有当设备列表真正变化时才重新订阅
  // 比较设备 SN 列表是否变化
  const newDeviceSNs = new Set((newDevices || []).map(d => d.sn).filter(Boolean))
  const oldDeviceSNs = new Set((oldDevices || []).map(d => d.sn).filter(Boolean))
  
  // 如果设备 SN 列表相同，不需要重新订阅
  if (newDeviceSNs.size === oldDeviceSNs.size && 
      [...newDeviceSNs].every(sn => oldDeviceSNs.has(sn))) {
    return
  }
  
  // 设备列表已变化，重新订阅
  subscribeAllDeviceNotices()
}, { deep: true })

// 组件销毁时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})

// 关闭系统通知弹窗
const closeSystemNotificationModal = () => {
  showSystemNotificationModal.value = false
  currentSystemNotification.value = null
}
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
  width: 100vw;
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
  overflow: hidden;
}

/* 顶部头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px;
  position: relative;
  z-index: 100;
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

.add-device-btn:disabled,
.add-device-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  border-color: var(--color-disabled-border);
}

.add-device-btn:disabled:hover,
.add-device-btn.disabled:hover {
  background-color: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  transform: none;
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

/* 通知容器 */
.notification-container {
  position: relative;
}

/* 通知徽章 */
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--color-danger);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 18px;
}

/* 通知下拉菜单样式 */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  min-width: 380px;
  z-index: 9999;
  overflow: hidden;
  margin-top: 0;
}

.notification-info {
  background: var(--color-bg-secondary);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon svg {
  width: 14px;
  height: 14px;
  color: var(--color-bg-primary);
}

.notification-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.notification-details p {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.notification-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 4px 4px;
}

.system-message-btn {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 8px;
  padding: 6px 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.system-message-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.system-message-btn svg {
  width: 14px;
  height: 14px;
}

.notification-content {
  max-height: 320px;
  overflow-y: auto;
  background: var(--color-bg-secondary);
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.notification-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.no-messages {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.no-messages-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: var(--color-text-muted);
}

.no-messages-icon svg {
  width: 100%;
  height: 100%;
}

.message-list {
  padding: 4px 12px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease-out;
  min-height: 60px;
  overflow: hidden;
}

.message-item:hover {
  background-color: var(--color-hover);
}

.message-item:last-child {
  border-bottom: none;
}

.message-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-icon.level-low {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
  opacity: 0.7;
}

.message-icon.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-icon.level-error {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-icon.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-icon svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
  fill: none;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-text {
  font-size: 13px;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
  font-weight: 500;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.message-level.level-low {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
  opacity: 0.7;
}

.message-level.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-level.level-error {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-level.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-time {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}


.message-device {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.message-device svg {
  width: 12px;
  height: 12px;
  color: var(--color-text-muted);
}

/* 单条消息标记已读按钮 */
.mark-read-single-btn {
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 1;
  transform: scale(1);
  margin-left: 6px;
}

.mark-read-single-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.mark-read-single-btn svg {
  width: 10px;
  height: 10px;
}


/* 消息日志弹窗 */
.message-log-modal-content {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 积分记录弹窗 */
.points-history-modal-content {
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.message-log-header {
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
}

.message-log-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.points-history-header {
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
  flex-shrink: 0;
}

.header-icon svg {
  width: 12px;
  height: 12px;
}

.header-title h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.message-log-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: var(--color-bg-secondary);
  min-height: 0; /* 确保flex子元素可以收缩 */
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border-radius: 0 0 16px 16px;
}

.points-history-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: var(--color-bg-secondary);
  min-height: 0; /* 确保flex子元素可以收缩 */
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border-radius: 0 0 16px 16px;
}

.message-log-body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.message-log-list {
  padding: 0;
}

.message-log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease-out;
  min-height: 60px;
  overflow: hidden;
}

.message-log-item:hover {
  background-color: var(--color-hover);
}

.message-log-item:last-child {
  border-bottom: none;
}

.points-history-list {
  padding: 0;
}

.points-history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.points-history-item:hover {
  background-color: var(--color-hover);
}

.points-history-item:last-child {
  border-bottom: none;
}


.points-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.points-description {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.points-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.points-amount {
  font-weight: 600;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.points-amount.positive {
  color: var(--color-success);
  background: var(--color-success);
  color: white;
}

.points-amount.negative {
  color: var(--color-danger);
  background: var(--color-danger);
  color: white;
}

.points-balance {
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 11px;
}

.points-time {
  font-size: 11px;
  color: var(--color-text-muted);
  margin: 0;
  font-weight: 500;
}

/* 消息日志弹窗中的消息样式 - 与通知下拉菜单保持一致 */
.message-log-item .message-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-log-item .message-icon.level-low {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
  opacity: 0.7;
}

.message-log-item .message-icon.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-log-item .message-icon.level-error {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-log-item .message-icon.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-log-item .message-icon svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
  fill: none;
}

.message-log-item .message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-log-item .message-text {
  font-size: 13px;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
  font-weight: 500;
}

.message-log-item .message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-log-item .message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-log-item .message-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.message-log-item .message-level.level-low {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
  opacity: 0.7;
}

.message-log-item .message-level.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-log-item .message-level.level-error {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-log-item .message-level.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-log-item .message-time {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.message-log-item .message-device {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.message-log-item .message-device svg {
  width: 12px;
  height: 12px;
  color: var(--color-text-muted);
}

/* 加载更多按钮 */
.load-more-container {
  padding: 20px;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.load-more-btn {
  padding: 10px 24px;
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 没有更多消息提示 */
.no-more-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
}

.no-more-messages svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  position: relative;
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
  transition: transform 0.3s ease;
}

.dropdown-arrow.active {
  transform: rotate(180deg);
}

/* 用户下拉菜单样式 */
.user-dropdown {
  position: absolute;
  top: calc(100% - 36px);
  right: 16px;
  background: var(--color-shadow-overlay);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--shadow-soft);
  min-width: 380px;
  z-index: 9999;
  overflow: hidden;
  margin-top: 0;
}

.user-info {
  background: var(--color-bg-secondary);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.dropdown-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-details h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.user-points-section {
  background: var(--color-bg-secondary);
  padding: 12px 20px;
}

.user-points {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.points-icon-small {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
  flex-shrink: 0;
}

.points-icon-small svg {
  width: 12px;
  height: 12px;
}

.points-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.points-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
}

.points-history-btn {
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
}

.points-history-btn:hover {
  background: var(--color-hover);
  color: var(--color-primary);
}

.points-history-text {
  font-size: 12px;
  font-weight: 500;
}

.points-history-btn svg {
  width: 14px;
  height: 14px;
}

.user-details p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.user-email {
  font-weight: 500;
  color: var(--color-text-primary);
}

.user-phone {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.user-meta {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.user-role {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.user-gender {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0;
}

.dropdown-menu {
  background: var(--color-bg-secondary);
  padding: 8px 0;
}

.dropdown-actions {
  display: flex;
  gap: 0;
}

.dropdown-actions .dropdown-item {
  flex: 1;
  justify-content: center;
  border-radius: 0;
  margin: 0;
}

.dropdown-actions .dropdown-item:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 1px solid var(--color-border);
}

.dropdown-actions .dropdown-item:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.delete-account {
  color: var(--color-danger) !important;
}

.delete-account:hover {
  background-color: var(--color-danger-light) !important;
  color: var(--color-danger-dark) !important;
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.dropdown-item.disabled:hover {
  background: transparent !important;
  color: var(--color-text-muted) !important;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.dropdown-item svg {
  width: 14px;
  height: 14px;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.dropdown-item:hover svg {
  color: var(--color-text-primary);
}

.dropdown-item.logout {
  color: var(--color-danger);
}

.dropdown-item.logout:hover {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.dropdown-item.logout svg {
  color: var(--color-danger);
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

/* 确认弹窗样式 - 参考项目其他弹窗 */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-shadow-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 10px 30px var(--shadow-soft);
}

.confirm-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.confirm-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-warning-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-warning);
  margin-right: 12px;
}

.confirm-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
}

.confirm-content {
  margin: 0 0 20px;
}

.confirm-content p {
  margin: 0 0 12px 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 14px;
}

.confirm-content ul {
  margin: 0 0 12px 0;
  padding-left: 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.confirm-content li {
  margin-bottom: 6px;
  line-height: 1.5;
}

.warning-text {
  color: var(--color-danger) !important;
  font-weight: 500;
  font-size: 14px;
}


.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

/* 系统消息优先级样式 */
.message-level.level-low {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-level.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-level.level-high {
  background: var(--color-message-error-bg);
  color: var(--color-message-error);
}

.message-level.level-urgent {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}


.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon svg {
  width: 20px;
  height: 20px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--color-text-primary);
}

.notification-text {
  font-size: 13px;
  line-height: 1.4;
  margin: 0 0 10px 0;
  color: var(--color-text-primary);
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.notification-priority {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.notification-time {
  font-size: 11px;
  color: var(--color-text-primary);
}

.notification-device,
.notification-service {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
}

.device-label,
.service-label {
  color: var(--color-text-primary);
  font-weight: 500;
}

.device-id,
.service-name {
  color: var(--color-text-primary);
  font-family: monospace;
  background: var(--color-bg-secondary);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.confirm-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 6px 20px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background: var(--color-primary-hover);
}

.btn-cancel,
.btn-delete {
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
  font-size: 14px;
}

.btn-cancel {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.btn-cancel:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.btn-delete {
  background: color-mix(in oklab, var(--color-danger) 10%, transparent);
  color: var(--color-danger);
  border-color: color-mix(in oklab, var(--color-danger) 30%, transparent);
}

.btn-delete:hover {
  background: var(--color-danger);
  color: var(--color-white);
  border-color: var(--color-danger);
}

/* 添加设备弹窗样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal-content {
  background: var(--color-bg-card);
  border-radius: 14px;
  padding: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 12px 32px var(--color-modal-shadow);
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.delete-modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.delete-close-btn {
  background: none;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.delete-close-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

.delete-modal-body {
  margin: 8px 0 16px;
}

.delete-modal-body .input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
  box-sizing: border-box;
}

.delete-modal-body .input:focus {
  border-color: var(--color-primary);
}

.delete-modal-body .input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.success {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.action-btn.success:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* 修改用户信息模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-shadow-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 20px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px var(--shadow-soft);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* 隐藏滚动条但保持滚动功能 */
.modal-content::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.modal-content {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-primary);
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.user-form {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group .field-hint {
  font-size: 12px;
  font-weight: normal;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}

.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.submit-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: var(--color-primary-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 头像选择器样式 */
.avatar-section {
  margin-bottom: 16px;
  padding: 4px 0 12px 0;
  border-bottom: 1px solid var(--color-border);
}

/* 错误信息样式 */
.error-message {
  color: var(--color-danger);
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--color-danger-light);
  border-radius: 6px;
  border: 1px solid var(--color-danger);
}

</style>

