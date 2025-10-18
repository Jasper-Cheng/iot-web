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
            <!-- Widgets图标 -->
            <svg v-else-if="navItem.id === 'widgets'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="14" y="4" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="4" y="14" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="14" y="14" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- Members图标 -->
            <svg v-else-if="navItem.id === 'members'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="6" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="18" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <!-- Mall图标 -->
            <svg v-else-if="navItem.id === 'mall'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="2" fill="none"/>
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
          <h1 class="greeting">Greetings from home again, {{ globalStore.user?.account?.name || globalStore.user?.account?.account || 'happy' }}</h1>
          <p class="status">Every system and gadget is operating as planned.</p>
        </div>
        <div class="header-right">
          <button 
            class="add-device-btn" 
            :class="{ disabled: globalStore.user?.account?.role === 'member' }"
            :disabled="globalStore.user?.account?.role === 'member'"
            :title="globalStore.user?.account?.role === 'member' ? '只有拥有者可以添加设备' : '添加设备'"
            @click="openAddDeviceModal"
          >
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
              </div>
              
              <div class="dropdown-divider"></div>
              
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
                      <svg v-if="message.level === 'normal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      <svg v-else-if="message.level === 'error'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 8v4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 16h.01" stroke="currentColor" stroke-width="2" fill="none"/>
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
                            {{ message.level === 'normal' ? '普通' : message.level === 'error' ? '错误' : '致命' }}
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
              :alt="globalStore.user?.account?.name || 'User Avatar'" 
              @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
              class="profile-avatar"
            >
            <span class="user-name">{{ globalStore.user?.account?.name || globalStore.user?.account?.account || '用户' }}</span>
            <span class="dropdown-arrow" :class="{ active: showUserMenu }">▼</span>
          </div>
          
          <!-- 用户下拉菜单 -->
          <div v-if="showUserMenu" class="user-dropdown" @click.stop>
            <div class="user-info">
              <img 
                :src="globalStore.user?.account?.avatar || DEFAULT_NO_AVATAR_URL" 
                :alt="globalStore.user?.account?.name || 'User Avatar'" 
                @error="$event.target.src = DEFAULT_NO_AVATAR_URL"
                class="dropdown-avatar"
              >
              <div class="user-details">
                <h4>{{ globalStore.user?.account?.name || globalStore.user?.account?.account || '用户' }}</h4>
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
                  <span class="points-value">{{ userPoints || 0 }}</span>
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

  <!-- 添加设备弹窗 -->
  <div v-if="showAddDeviceModal" class="device-modal" @click="closeAddDeviceModal">
    <div class="delete-modal-content" @click.stop>
      <div class="delete-modal-header">
        <h3>添加设备</h3>
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
          {{ isAddingDevice ? '添加中...' : '添加' }}
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
        <h3>{{ globalStore.user?.account?.role === 'member' ? '确认退出家庭' : '确认注销账户' }}</h3>
      </div>
      <div class="confirm-content">
        <template v-if="globalStore.user?.account?.role === 'member'">
          <p>此操作将<strong>永久删除</strong>您的成员账户，包括：</p>
          <ul>
            <li>您的个人设备权限</li>
            <li>您的个人设置和配置</li>
            <li>您的历史操作记录</li>
          </ul>
          <p class="warning-text">退出家庭后，您将<strong>无法访问</strong>任何家庭设备，请谨慎操作！</p>
        </template>
        <template v-else>
          <p>此操作将<strong>永久删除</strong>您的账户以及所有相关数据，包括：</p>
          <ul>
            <li>所有设备数据</li>
            <li>所有成员信息</li>
            <li>所有历史记录</li>
            <li>所有设置和配置</li>
          </ul>
          <p class="warning-text">此操作<strong>无法撤销</strong>，请谨慎操作！</p>
        </template>
      </div>
      <div class="confirm-actions">
        <button class="btn-cancel" @click="closeDeleteConfirm">取消</button>
        <button class="btn-delete" @click="confirmDelete">
          {{ globalStore.user?.account?.role === 'member' ? '确认退出' : '确认注销' }}
        </button>
      </div>
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
              <svg v-if="message.level === 'normal'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <svg v-else-if="message.level === 'error'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 8v4" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 16h.01" stroke="currentColor" stroke-width="2" fill="none"/>
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
                    {{ message.level === 'normal' ? '普通' : message.level === 'error' ? '错误' : '致命' }}
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
            <p class="header-subtitle">当前积分: {{ userPoints || 0 }}</p>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initTheme, setTheme, DEFAULT_NO_AVATAR_URL } from '../utils/theme.js'
import { useGlobalStore } from '../stores/global'
import { deleteUser, deleteFamilyMember, markAllMessagesAsRead } from '../api/users'
import { bindDeviceBySN, markMessageAsRead as markMessageAsReadAPI } from '../api/devices'
import { getPointsBalance, getPointsHistory } from '../api/points'
import { ElMessage } from 'element-plus'
import { useWebSocketManager } from '../composables/useWebSocketManager'

// Index.vue 现在只作为布局容器，不需要导入具体的widget组件

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

// 使用设备实时数据管理 - 在 Index 层级初始化，确保用户已登录
const { systemMessage, familyMessage } = useWebSocketManager()

// 检查注入是否成功
if (!systemMessage || !familyMessage) {
  console.error('消息管理器注入失败，请检查 useWebSocketManager 是否正确初始化')
}



// 控制用户下拉菜单显示
const showUserMenu = ref(false)

// 控制注销确认弹窗显示
const showDeleteConfirmModal = ref(false)

// 控制添加设备弹窗显示
const showAddDeviceModal = ref(false)

// 添加设备表单数据
const deviceForm = ref({
  sn: ''
})

// 添加设备加载状态
const isAddingDevice = ref(false)

// 通知相关
const showNotificationMenu = ref(false)
const showMessageLogModal = ref(false)
const unreadMessages = ref([])
const readMessages = ref([])
const isLoadingReadMessages = ref(false)
const readMessagesPage = ref(1)
const readMessagesLimit = ref(20)
const hasMoreReadMessages = ref(true)

// 积分相关
const userPoints = ref(0)
const showPointsHistoryModal = ref(false)
const pointsHistory = ref([])
const isLoadingPointsHistory = ref(false)
const pointsHistoryPage = ref(1)
const pointsHistoryLimit = ref(20)
const hasMorePointsHistory = ref(true)

// 当前主题
const currentTheme = ref('dark')

// 系统消息处理
const handleSystemMessage = (data) => {
  console.log('收到系统消息:', data)
  // 根据消息类型调用相应的处理函数
  switch (data.type) {
    case 'device_status_change':
      handleDeviceOnlineChange(data.data)
      break
    case 'system_notification':
      handleSystemNotification(data.data)
      break
    case 'promotion':
      handlePromotion(data.data)
      break
    case 'mall_new_product':
      handleMallNewProduct(data.data)
      break
    case 'user_message':
      handleUserMessage(data.data)
      break
    case 'system_update':
      handleSystemUpdate(data.data)
      break
    default:
      console.warn('未知的系统消息类型:', data.type)
  }
}

// 具体的系统消息处理方法
const handleDeviceOnlineChange = (data) => {
  const { deviceId, deviceName, oldStatus, newStatus, timestamp } = data
  if (globalStore.devices) {
    const device = globalStore.devices.find(d => d.id === deviceId)
    if (device) {
      device.status = newStatus
      device.lastSeen = timestamp
    }
  }
  console.log(`设备 ${deviceName} 状态从 ${oldStatus} 变更为 ${newStatus}`)
}

const handleSystemNotification = (data) => {
  const { title, message, level } = data
  console.log(`系统通知 [${level}]: ${title} - ${message}`)
}

const handlePromotion = (data) => {
  const { title, message, actionUrl } = data
  console.log(`优惠活动: ${title} - ${message}`)
}

const handleMallNewProduct = (data) => {
  const { productName, price, category } = data
  console.log(`商场上新: ${productName} - ¥${price} (${category})`)
}

const handleUserMessage = (data) => {
  const { title, content, priority, deviceId } = data
  console.log(`用户消息 [${priority}]: ${title} - ${content}`)
}

const handleSystemUpdate = (data) => {
  const { version, features, updateUrl } = data
  console.log(`系统更新: 版本 ${version} - ${features}`)
}

// 家庭消息处理
const handleFamilyMessage = (data) => {
  console.log('收到家庭消息:', data)
  // 根据消息类型调用相应的处理函数
  switch (data.type) {
    case 'update.permission':
      handleFamilyPermissionUpdate(data.data)
      break
    case 'update.message':
      handleFamilyMessageUpdate(data.data)
      break
    case 'update.member':
      handleFamilyMemberUpdate(data.data)
      break
   case 'update.device':
      handleFamilyDeviceUpdate(data.data)
      break
    case 'update.room':
      handleFamilyRoomUpdate(data.data)
      break
    case 'update.roomDevices':
      handleFamilyRoomDevicesUpdate(data.data)
      break
    default:
      console.warn('未知的家庭消息类型:', data.type)
  }
}

// 具体的家庭消息处理方法
const handleFamilyPermissionUpdate = async (data) => {
  const { title, message, level } = data
  await globalStore.loadMembers(globalStore.user?.user_id)
  console.log(`家庭权限更新 [${level}]: ${title} - ${message}`)
}

const handleFamilyMessageUpdate = (data) => {
  const { title, message, level } = data
  console.log(`家庭消息更新 [${level}]: ${title} - ${message}`)
}

const handleFamilyMemberUpdate = async (data) => {
  const { title, message, level } = data
  await globalStore.loadMembers(globalStore.user?.user_id)
  console.log(`家庭成员更新 [${level}]: ${title} - ${message}`)
}

const handleFamilyDeviceUpdate = async (data) => {
  const { title, message, level } = data
  console.log(`家庭设备更新 [${level}]: ${title} - ${message}`)
  await globalStore.loadDevices(globalStore.user?.user_id)
  await globalStore.loadMembers(globalStore.user?.user_id)
}

const handleFamilyRoomUpdate = async (data) => {
  const { title, message, level } = data
  console.log(`家庭房间更新 [${level}]: ${title} - ${message}`)
  await globalStore.loadRooms(globalStore.user?.user_id)
}

const handleFamilyRoomDevicesUpdate = async (data) => {
  const { title, message, level } = data
  console.log(`家庭房间设备更新 [${level}]: ${title} - ${message}`)
  await globalStore.loadRooms(globalStore.user?.user_id)
}


// Index.vue 现在只作为布局容器，不需要房间和设备数据

// 导航配置
const navigationItems = ref([
  { id: 'home', name: 'Home', route: '/home', icon: 'home' },
  { id: 'widgets', name: 'Widgets', route: '/widgets', icon: 'widgets' },
  { id: 'members', name: 'Members', route: '/members', icon: 'members' },
  { id: 'mall', name: 'Mall', route: '/mall', icon: 'mall' }
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
    'owner': '拥有者',
    'member': '成员',
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
const logout = () => {
  // 清除认证状态
  globalStore.clearAuth()
  showUserMenu.value = false
  
  // 跳转到登录页
  router.push('/login')
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
  unreadMessages.value = globalStore.messages.filter(msg => msg.status === 'new')
}

// 加载已读消息（分页）
const loadReadMessages = async (page = 1, append = false) => {
  if (!globalStore.user?.user_id) return
  
  isLoadingReadMessages.value = true
  try {
    const messages = await globalStore.loadReadMessages(globalStore.user.user_id, {
      limit: readMessagesLimit.value,
      skip: (page - 1) * readMessagesLimit.value
    })
    
    if (append) {
      readMessages.value = [...readMessages.value, ...messages]
    } else {
      readMessages.value = messages
    }
    
    // 判断是否还有更多数据
    hasMoreReadMessages.value = messages.length === readMessagesLimit.value
    readMessagesPage.value = page
    
  } catch (error) {
    console.error('加载已读消息失败:', error)
  } finally {
    isLoadingReadMessages.value = false
  }
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
    // 计算累积的 limit 和 skip
    const currentSkip = readMessages.value.length
    const nextLimit = currentSkip + 20  // limit = skip + 20
    
    loadMoreReadMessagesDirect(currentSkip, nextLimit)
  }
}

// 直接加载更多消息的函数
const loadMoreReadMessagesDirect = async (skip, limit) => {
  if (!globalStore.user?.user_id) return
  
  isLoadingReadMessages.value = true
  try {
    const messages = await globalStore.loadReadMessages(globalStore.user.user_id, {
      limit: limit,
      skip: skip
    })
    
    // 追加到现有消息列表
    readMessages.value = [...readMessages.value, ...messages]
    
    // 判断是否还有更多数据
    hasMoreReadMessages.value = messages.length === (limit - skip)
    readMessagesPage.value = Math.floor(skip / 20) + 1
    
  } catch (error) {
    console.error('加载已读消息失败:', error)
  } finally {
    isLoadingReadMessages.value = false
  }
}

// 积分相关方法
const loadUserPoints = async () => {
  if (!globalStore.user?.account?.id) return
  
  try {
    const response = await getPointsBalance(globalStore.user.account.id)
    userPoints.value = response.available_balance || 0
  } catch (error) {
    console.error('加载积分余额失败:', error)
  }
}

const loadPointsHistory = async (page = 1, append = false) => {
  if (!globalStore.user?.account?.id) return
  
  isLoadingPointsHistory.value = true
  try {
    const response = await getPointsHistory(globalStore.user.account.id, {
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
    console.error('加载积分历史失败:', error)
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

// 直接加载更多积分记录的函数
const loadMorePointsHistoryDirect = async (skip, limit) => {
  if (!globalStore.user?.account?.id) return
  
  isLoadingPointsHistory.value = true
  try {
    const response = await getPointsHistory(globalStore.user.account.id, {
      skip: skip,
      limit: limit
    })
    
    // 追加到现有积分历史列表
    pointsHistory.value = [...pointsHistory.value, ...response]
    
    // 判断是否还有更多数据
    hasMorePointsHistory.value = response.length === (limit - skip)
    pointsHistoryPage.value = Math.floor(skip / 20) + 1
    
  } catch (error) {
    console.error('加载积分历史失败:', error)
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
  try {
    console.log('标记所有消息为已读')
    
    // 调用API标记所有消息为已读
    await markAllMessagesAsRead(globalStore.user?.user_id)
    
    // 清空未读消息列表
    unreadMessages.value = []
    
    // 更新全局消息状态
    globalStore.messages.forEach(message => {
      if (message.status === 'new') {
        message.status = 'read'
      }
    })
    
    ElMessage.success('所有消息已标记为已读')
    closeNotificationMenu()
  } catch (error) {
    console.error('标记已读失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 标记单条消息为已读
const markMessageAsRead = async (message) => {
  try {
    console.log('标记消息为已读:', message.id)
    
    // 调用API标记消息为已读
    await markMessageAsReadAPI(message.id, 'read')
    
    // 直接移除消息，无动画效果
    const index = unreadMessages.value.findIndex(m => m.id === message.id)
    if (index > -1) {
      unreadMessages.value.splice(index, 1)
    }
    
    // 更新全局消息状态
    const globalMessage = globalStore.messages.find(m => m.id === message.id)
    if (globalMessage) {
      globalMessage.status = 'read'
    }
    
    console.log('消息已成功标记为已读')
  } catch (error) {
    console.error('标记消息已读失败:', error)
    ElMessage.error('操作失败，请重试')
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

// 打开添加设备弹窗
const openAddDeviceModal = () => {
  // 检查权限
  if (globalStore.user?.account?.role === 'member') {
    ElMessage.warning('只有拥有者可以添加设备')
    return
  }
  showAddDeviceModal.value = true
  deviceForm.value.sn = ''
}

// 关闭添加设备弹窗
const closeAddDeviceModal = () => {
  showAddDeviceModal.value = false
  deviceForm.value.sn = ''
  isAddingDevice.value = false
}

// 提交添加设备表单
const submitAddDevice = async () => {
  if (!deviceForm.value.sn.trim()) {
    ElMessage.warning('请输入设备序列号')
    return
  }

  isAddingDevice.value = true
  
  try {
    const response = await bindDeviceBySN(deviceForm.value.sn.trim(), globalStore.user?.user_id)
    
    if (response) {
      ElMessage.success('设备添加成功')
      closeAddDeviceModal()
      
      // 发送家庭消息通知设备添加
      try {
        await familyMessage.sendFamilyMessage('update.device', {
          title: '设备添加',
          message: `设备"${response.name || deviceForm.value.sn}"已被用户"${globalStore.user?.account?.name || globalStore.user?.account?.account || '未知用户'}"添加`,
          level: 'normal'
        })
      } catch (messageError) {
        console.warn('发送家庭消息失败:', messageError)
      }
    }
  } catch (error) {
    console.error('添加设备失败:', error)
    
    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        ElMessage.error(error.response.data.detail)
      } else if (error.response.data.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('添加设备失败，请重试')
      }
    } else {
      ElMessage.error('添加设备失败，请重试')
    }
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
    let response
    
    // 根据用户角色调用不同的API
    if (globalStore.user?.account?.role === 'member') {
      // 成员调用删除家庭成员API
      response = await deleteFamilyMember(globalStore.user?.user_id)
    } else {
      // 拥有者调用删除用户API
      response = await deleteUser(globalStore.user?.user_id)
    }
    
    if (response.message) {
      ElMessage.success(response.message)
    } else {
      ElMessage.success('账户注销成功')
    }
    
    // 清除认证状态并跳转到登录页
    globalStore.clearAuth()
    showDeleteConfirmModal.value = false
    router.push('/login')
  } catch (error) {
    console.error('注销账户失败:', error)
    
    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        ElMessage.error(error.response.data.detail)
      } else if (error.response.data.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('注销失败，请重试')
      }
    } else {
      ElMessage.error('注销失败，请重试')
    }
    
    showDeleteConfirmModal.value = false
  }
}

// 监听未读消息变化，自动更新未读消息列表
watch(() => globalStore.messages, () => {
  updateUnreadMessages()
}, { deep: true })

// 初始化主题
onMounted(() => {
  const theme = initTheme()
  currentTheme.value = theme
  
  // 加载所有数据
  globalStore.loadAll()
  
  // 加载积分数据
  loadUserPoints()
})

// 监听WebSocket连接状态
watch(() => systemMessage?.connectionState?.value, (newState, oldState) => {
  
  // 检查是否获取到了正确的 manager 对象
  if (!systemMessage || !familyMessage || !systemMessage.setSystemMessageHandler || !familyMessage.setFamilyMessageHandler) {
    console.warn('消息管理器未正确初始化，跳过状态处理')
    return
  }
  
  switch (newState) {
    case 'connected':
      console.log('WebSocket已连接，设置消息处理器')
      // 连接成功时设置处理器
      systemMessage.setSystemMessageHandler(handleSystemMessage)
      familyMessage.setFamilyMessageHandler(handleFamilyMessage)
      break
    case 'connecting':
      console.log('WebSocket正在连接...')
      break
    case 'disconnected':
      console.log('WebSocket已断开连接，清除消息处理器')
      // 断开连接时清除处理器
      systemMessage.clearSystemMessageHandler()
      familyMessage.clearFamilyMessageHandler()
      break
    case 'error':
      console.log('WebSocket连接出错，清除消息处理器')
      // 连接错误时清除处理器
      systemMessage.clearSystemMessageHandler()
      familyMessage.clearFamilyMessageHandler()
      break
    default:
      console.log('未知的连接状态:', newState)
  }
})

// 组件销毁时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
  
  // 清除消息处理器
  systemMessage.clearSystemMessageHandler()
  familyMessage.clearFamilyMessageHandler()
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
  padding: 0;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
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

.message-icon.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-icon.level-error {
  background: var(--color-message-error-bg);
  color: var(--color-message-error);
}

.message-icon.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-icon svg {
  width: 12px;
  height: 12px;
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

.message-level.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-level.level-error {
  background: var(--color-message-error-bg);
  color: var(--color-message-error);
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

.message-log-item .message-icon.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-log-item .message-icon.level-error {
  background: var(--color-message-error-bg);
  color: var(--color-message-error);
}

.message-log-item .message-icon.level-fatal {
  background: var(--color-message-fatal-bg);
  color: var(--color-message-fatal);
}

.message-log-item .message-icon svg {
  width: 12px;
  height: 12px;
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

.message-log-item .message-level.level-normal {
  background: var(--color-message-normal-bg);
  color: var(--color-message-normal);
}

.message-log-item .message-level.level-error {
  background: var(--color-message-error-bg);
  color: var(--color-message-error);
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
  min-width: 320px;
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

/* 添加设备弹窗样式 - 统一为Widgets样式 */
.device-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-widgets-modal-overlay);
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
  box-shadow: 0 12px 32px var(--color-widgets-modal-shadow);
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

</style>
