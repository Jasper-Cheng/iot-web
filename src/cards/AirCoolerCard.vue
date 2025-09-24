<template>
  <div class="air-cooler-card">
    <div class="card-header">
      <div class="air-card-info">
        <h3>Air Cooler</h3>
        <p>GTA AC00L4</p>
      </div>
      <div class="power-switch">
        <span class="switch-label">{{ acPower ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { active: acPower }]"
          @click="toggleAC"
        ></div>
      </div>
    </div>

    <div class="temperature-section">
      <div class="ac-temp">
         <div class="temp-header">
           <h4>AC Temperature</h4>
         </div>
        <div class="temp-display" :style="{ '--temp-end-color': tempEndColor }">{{ acTemp }}°</div>
      </div>
      <div class="room-temp">
        <h4>Room Temperature</h4>
        <div class="room-image" :style="{ '--room-tint': roomTint }">
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop" alt="Living Room">
          <div class="temp-overlay">20°</div>
        </div>
      </div>
    </div>

    <div class="mode-controls">
      <div v-for="mode in acModes" class="mode-div">
        <button :key="mode.id"
          :class="['mode-btn', { active: mode.id === activeMode, disabled: !acPower }]"
          :disabled="!acPower"
          @click="setActiveMode(mode.id)">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-if="mode.id === 'heat'" d="M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M12 1v2 M12 21v2 M1 12h2 M21 12h2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path v-else-if="mode.id === 'dry'" d="M12 4 C5 12, 3 20, 12 23 C21 20, 19 12, 12 4 Z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'cool'" d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19 M8 4 L12 8 L16 4 M8 20 L12 16 L16 20 M4 8 L8 12 L4 16 M20 8 L16 12 L20 16" stroke="currentColor" stroke-width="2" fill="none"/>
            <path v-else-if="mode.id === 'auto'" d="M7 16 L12 5 L17 16 M9 12 L15 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </button>
        <span>{{ mode.name }}</span>
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

const acModes = ref([
  { id: 'heat', name: 'Heat' },
  { id: 'dry', name: 'Dry' },
  { id: 'cool', name: 'Cool' },
  { id: 'auto', name: 'Auto' }
])

const activeMode = ref('cool')
const lastActiveMode = ref(activeMode.value)
const acPower = ref(true)
const acTemp = ref(16)

const tempEndColor = computed(() => {
  const t = acTemp.value
  if (t <= 10) return 'var(--temp-color-1)'
  if (t <= 16) return 'var(--temp-color-2)'
  if (t <= 22) return 'var(--temp-color-3)'
  if (t <= 26) return 'var(--temp-color-4)'
  if (t <= 30) return 'var(--temp-color-5)'
  return 'var(--temp-color-6)'
})

const roomTint = computed(() => {
  if (!acPower.value) return 'transparent'
  switch (activeMode.value) {
    case 'heat':
      return 'var(--mode-heat-overlay)'
    case 'dry':
      return 'var(--mode-dry-overlay)'
    case 'cool':
      return 'var(--mode-cool-overlay)'
    case 'auto':
      return 'transparent'
    default:
      return 'transparent'
  }
})

const setActiveMode = (modeId) => {
  if (!acPower.value) return
  activeMode.value = modeId
  lastActiveMode.value = modeId
}

const toggleAC = () => {
  acPower.value = !acPower.value
  if (!acPower.value) {
    lastActiveMode.value = activeMode.value
    activeMode.value = null
  } else {
    activeMode.value = lastActiveMode.value || 'cool'
  }
}
</script>

<style scoped>
@import '../styles/colors.css';

.air-cooler-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.air-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.air-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.power-switch {
  display: flex;
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

.temperature-section {
  display: flex;
  gap: 24px;
  align-items: center;
}

.ac-temp{
  text-align: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.room-temp {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 3;
  align-items: center;
  justify-content: center;
}

.temp-header h4 {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.room-temp h4 {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.temp-display {
  margin-top: 0;
  font-size: 18px;
  font-weight: 400;
  color: white;
  background: linear-gradient(180deg, var(--color-temp-gradient-start) 0%, var(--temp-end-color, var(--color-blue-500)) 100%);
  border-radius: 16px;
  text-align: center;
  width: 100px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.room-image {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  width: 240px;
  height: 160px;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--room-tint, transparent);
  pointer-events: none;
}

.temp-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 400;
  color: white;
  text-shadow: 0 2px 4px var(--color-border-light);
  padding: 12px 10px;
  border-radius: 50%;
  backdrop-filter: blur(6px);
}

.mode-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.mode-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.mode-btn {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  background: var(--color-button-dark-hover);
  transform: translateY(-2px);
}

.mode-btn.active {
  border: 1px solid var(--color-primary);
  color: white;
}

.mode-btn svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.mode-btn.active svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.mode-btn span {
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: center;
}
</style>


