<template>
  <div class="tv-card">
    <div class="tv-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <div class="tv-info">
      <div class="tv-card-info">
        <h3>{{ device.name || 'TV' }}</h3>
        <div class="connection-status">
          <div 
            :class="['status-indicator', { 
              'connected': wsConnected && deviceOnline,
              'disconnected': !wsConnected || !deviceOnline 
            }]"
          ></div>
          <span class="status-text">
            {{ wsConnected && deviceOnline ? '在线' : '离线' }}
          </span>
          <span v-if="device.sn" class="device-sn">{{ device.sn }}</span>
        </div>
      </div>
      <div class="tv-status-row">
        <p>{{ effectiveTvStatus ? 'On' : 'Off' }}</p>
        <div class="tv-switch">
          <div 
            :class="['switch-button', { 
              active: effectiveTvStatus,
              disabled: !wsConnected || !deviceOnline 
            }]"
            @click="toggleTV"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWebSocketManager } from '../composables/useWebSocketManager'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 使用设备管理器
const { deviceManager } = useWebSocketManager()

// 设备在线状态
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// WebSocket连接状态
const wsConnected = computed(() => deviceManager.connectionState.value === 'connected')

// TV状态
const tvStatus = ref(false)

// 确保离线时开关始终为Off
const effectiveTvStatus = computed(() => {
  // 如果设备离线或WebSocket未连接，强制为Off
  if (!deviceOnline.value || !wsConnected.value) {
    return false
  }
  return tvStatus.value
})

// 切换TV状态
const toggleTV = () => {
  // 设备不在线或WebSocket未连接时不允许操作
  if (!deviceOnline.value || !wsConnected.value) {
    console.warn('设备离线或WebSocket未连接，无法控制设备')
    return
  }
  tvStatus.value = !tvStatus.value
}
</script>

<style scoped>
@import '../styles/colors.css';

.tv-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  min-height: 80px;
}

.tv-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow-light);
}

.tv-icon {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 12px;
}

.tv-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-primary);
}

.tv-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tv-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-indicator.connected {
  background: var(--color-success);
  box-shadow: 0 0 6px var(--color-blue-shadow);
}

.status-indicator.disconnected {
  background: var(--color-danger);
  box-shadow: 0 0 6px var(--color-blue-shadow);
}

.status-text {
  font-size: 10px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.device-sn {
  font-size: 9px;
  color: var(--color-text-muted);
  font-weight: 400;
  opacity: 0.7;
  margin-left: 8px;
}

.tv-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tv-status-row p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.tv-switch {
  display: flex;
  align-items: center;
}

.switch-button {
  width: 32px;
  height: 20px;
  background: var(--color-switch-indicator);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: var(--color-switch-indicator-active);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-button.active::after {
  left: 16px;
}

.switch-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-button.disabled:hover {
  transform: none;
}
</style>
