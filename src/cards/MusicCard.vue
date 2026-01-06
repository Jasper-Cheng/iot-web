<template>
  <div class="music-card">
    <div class="music-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </div>
    <div class="music-info">
      <div class="music-card-info">
        <h3>{{ device.name || 'Music' }}</h3>
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
      <div class="music-status-row">
        <p>{{ effectiveMusicStatus ? 'On' : 'Off' }}</p>
        <div class="music-switch">
          <div 
            :class="['switch-button', { 
              active: effectiveMusicStatus,
              disabled: !deviceOnline 
            }]"
            @click="toggleMusic"
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

// Music状态
const musicStatus = ref(false)

// 确保离线时开关始终为Off
const effectiveMusicStatus = computed(() => {
  // 如果设备离线，强制为Off
  if (!deviceOnline.value) {
    return false
  }
  return musicStatus.value
})

// 切换Music状态
const toggleMusic = () => {
  // 设备不在线时不允许操作
  if (!deviceOnline.value) {
    console.warn('设备离线，无法控制设备')
    return
  }
  musicStatus.value = !musicStatus.value
}
</script>

<style scoped>
@import '../styles/colors.css';

.music-card {
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

.music-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow-light);
}

.music-icon {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 12px;
}

.music-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-primary);
}

.music-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.music-card-info h3 {
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

.music-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.music-status-row p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.music-switch {
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
