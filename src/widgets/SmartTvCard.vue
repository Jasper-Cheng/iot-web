<template>
  <div class="device-card">
    <div class="device-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7h18v10H3zM7 17v2M17 17v2" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </div>
    <div class="device-info">
      <h4>{{ device.name }}</h4>
      <p>{{ device.model }}</p>
    </div>
    <div class="device-switch">
      <span class="switch-label">{{ device.power ? 'On' : 'Off' }}</span>
      <div 
        :class="['switch-button', { active: device.power }]"
        @click="toggleDevice"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Device information
const device = ref({
  id: 2,
  name: 'Smart TV',
  model: 'Samsung QBOC',
  type: 'tv',
  power: true
})

// Methods
const toggleDevice = () => {
  device.value.power = !device.value.power
}
</script>

<style scoped>
@import '../styles/colors.css';

.device-card {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-card:hover {
  border: 1px solid var(--color-primary);
}

.device-icon {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.device-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-info p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 13px;
}

.device-switch {
  display: flex;
  margin-left: auto;
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
</style>
