<template>
  <div class="sockets-card">
    <div class="sockets-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M9 9h6v6H9z" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="9" cy="9" r="1" fill="currentColor"/>
        <circle cx="15" cy="9" r="1" fill="currentColor"/>
        <circle cx="9" cy="15" r="1" fill="currentColor"/>
        <circle cx="15" cy="15" r="1" fill="currentColor"/>
      </svg>
    </div>
    <div class="sockets-info">
      <div class="sockets-card-info">
        <h3>{{ device.name || 'Sockets' }}</h3>
        <div class="connection-status">
          <div 
            :class="['status-indicator', { 
              'connected': deviceOnline,
              'disconnected': !deviceOnline 
            }]"
          ></div>
          <span class="status-text">
            {{ deviceOnline ? '在线' : '离线' }}
          </span>
          <span v-if="device.sn" class="device-sn">{{ device.sn }}</span>
        </div>
      </div>
      <div class="sockets-status-row">
        <p>{{ effectiveSocketsStatus ? 'On' : 'Off' }}</p>
        <div class="sockets-switch">
          <div 
            :class="['switch-button', { 
              active: effectiveSocketsStatus,
              disabled: !deviceOnline 
            }]"
            @click="toggleSockets"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 设备在线状态
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// Sockets状态
const socketsStatus = ref(false)

// 确保离线时开关始终为Off
const effectiveSocketsStatus = computed(() => {
  // 如果设备离线，强制为Off
  if (!deviceOnline.value) {
    return false
  }
  return socketsStatus.value
})

// 切换Sockets状态
const toggleSockets = () => {
  // 设备不在线时不允许操作
  if (!deviceOnline.value) {
    console.warn('设备离线，无法控制设备')
    return
  }
  socketsStatus.value = !socketsStatus.value
}
</script>

<style scoped>
@import '../styles/colors.css';

.sockets-card {
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

.sockets-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow-light);
}

.sockets-icon {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 12px;
}

.sockets-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-primary);
}

.sockets-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sockets-card-info h3 {
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

.sockets-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sockets-status-row p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.sockets-switch {
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
