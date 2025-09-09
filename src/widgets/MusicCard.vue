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
      <h4>Music</h4>
      <p>{{ musicStatus ? 'On' : 'Off' }}</p>
    </div>
    <div class="music-switch">
      <div 
        :class="['switch-button', { active: musicStatus }]"
        @click="toggleMusic"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Music状态
const musicStatus = ref(false)

// 切换Music状态
const toggleMusic = () => {
  musicStatus.value = !musicStatus.value
}
</script>

<style scoped>
@import '../styles/colors.css';

.music-card {
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

.music-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow-light);
}

.music-icon {
  width: 40px;
  height: 40px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.music-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-text-primary);
}

.music-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.music-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.music-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.music-switch {
  display: flex;
  align-items: center;
  gap: 8px;
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
