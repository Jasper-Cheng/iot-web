<template>
  <div class="device-card">
    <div class="card-header">
      <div class="device-card-info">
        <h3>{{ device.name || 'Smart Socket' }}</h3>
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
    <div class="device-switch">
        <span class="switch-label">{{ effectivePower ? 'On' : 'Off' }}</span>
      <div 
          :class="['switch-button', { 
            active: effectivePower,
            disabled: !deviceOnline 
          }]"
        @click="toggleDevice"
      ></div>
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

// Device information
const device = ref({
  id: 4,
  name: 'Smart Socket',
  model: 'Tuya Zigbe',
  type: 'socket',
  power: false
})

// 确保离线时开关始终为Off
const effectivePower = computed(() => {
  // 如果设备离线，强制为Off
  if (!deviceOnline.value) {
    return false
  }
  return device.value.power
})

// Methods
const toggleDevice = () => {
  // 设备不在线时不允许操作
  if (!deviceOnline.value) {
    console.warn('设备离线，无法控制设备')
    return
  }
  device.value.power = !device.value.power
}
</script>

<style scoped>
@import '../styles/colors.css';

.device-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.device-card:hover {
  border: 1px solid var(--color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.device-card-info h3 {
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

.device-switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 12px;
  color: var(--color-text-secondary);
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
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
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
