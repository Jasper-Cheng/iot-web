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
      <h4>TV</h4>
      <div class="tv-status-row">
        <p>{{ tvStatus ? 'On' : 'Off' }}</p>
        <div class="tv-switch">
          <div 
            :class="['switch-button', { active: tvStatus }]"
            @click="toggleTV"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// TV状态
const tvStatus = ref(false)

// 切换TV状态
const toggleTV = () => {
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

.tv-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
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
</style>
