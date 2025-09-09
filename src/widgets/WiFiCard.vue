<template>
  <div class="wifi-card">
    <div class="wifi-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9z" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M9 17l2 2c1.33-1.33 3.67-1.33 5 0l2-2" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="21" r="1" fill="currentColor"/>
      </svg>
    </div>
    <div class="wifi-info">
      <h4>Wi-Fi</h4>
      <div class="wifi-status-row">
        <p>{{ wifiStatus ? 'On' : 'Off' }}</p>
        <div class="wifi-switch">
          <div 
            :class="['switch-button', { active: wifiStatus }]"
            @click="toggleWiFi"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// WiFi状态
const wifiStatus = ref(true)

// 切换WiFi状态
const toggleWiFi = () => {
  wifiStatus.value = !wifiStatus.value
}
</script>

<style scoped>
@import '../styles/colors.css';

.wifi-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  min-height: 80px;
}

.wifi-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow-light);
}

.wifi-icon {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 12px;
}

.wifi-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-primary);
}

.wifi-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wifi-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.wifi-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wifi-status-row p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.wifi-switch {
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
</style>
