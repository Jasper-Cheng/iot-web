<template>
  <div class="refrigerator-card">
    <div class="card-header">
      <div class="refrigerator-card-info">
        <h3>Refrigerator</h3>
        <p>Haier Smart Fridge</p>
      </div>
      
      <!-- 冰箱模式选择 -->
      <div class="refrigerator-modes-header">
        <div class="mode-buttons">
          <button 
            v-for="mode in [{ id: 'normal', name: '标准' }, { id: 'eco', name: '节能' }, { id: 'vacation', name: '度假' }]"
            :key="mode.id"
            :class="['mode-btn', { active: mode.id === refrigeratorMode && refrigeratorPower, disabled: !refrigeratorPower }]"
            :disabled="!refrigeratorPower"
            @click="setRefrigeratorMode(mode.id)">
            {{ mode.name }}
          </button>
        </div>
      </div>
      
      <div class="power-switch">
        <span class="switch-label">{{ refrigeratorPower ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { active: refrigeratorPower }]"
          @click="toggleRefrigerator"
        ></div>
      </div>
    </div>
    
    <div class="refrigerator-status-section">
      <div class="refrigerator-info">
        <div class="status-display">
          <div class="status-icon" :class="refrigeratorStatus">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16v16H4V4zM6 6v12h12V6H6zM8 8h8v2H8V8zM8 12h8v2H8v-2z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="status-text">
            <h4>{{ refrigeratorStatusText }}</h4>
            <p>Smart Refrigeration System</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 冷藏室控制 -->
    <div class="refrigerator-controls">
      <div class="compartment-control cooling-compartment">
        <div class="compartment-header">
          <h4>冷藏室</h4>
          <div class="temperature-display">
            {{ refrigeratorSettings.coolingTemperature }}°C
          </div>
        </div>
        
        <div class="temperature-control">
          <label>温度设置</label>
          <div class="temp-slider-container">
            <input 
              type="range" 
              min="-2" 
              max="20" 
              step="1"
              :value="refrigeratorSettings.coolingTemperature"
              :disabled="!refrigeratorPower"
              @input="setCoolingTemperature(parseInt($event.target.value))"
              class="temp-slider">
            <div class="temp-labels">
              <span>-2°C</span>
              <span>4°C</span>
              <span>10°C</span>
              <span>16°C</span>
              <span>20°C</span>
            </div>
          </div>
        </div>
        
        <div class="sterilization-control">
          <label>杀菌功能</label>
          <div 
            :class="['sterilization-switch', { active: refrigeratorSettings.coolingSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
            @click="toggleCoolingSterilization">
            <div class="switch-indicator"></div>
          </div>
        </div>
      </div>
      
      <!-- 冷冻室控制 -->
      <div class="compartment-control freezer-compartment">
        <div class="compartment-header">
          <h4>冷冻室</h4>
          <div class="temperature-display">
            {{ freezerSettings.freezerTemperature }}°C
          </div>
        </div>
        
        <div class="temperature-control">
          <label>温度设置</label>
          <div class="temp-slider-container">
            <input 
              type="range" 
              min="-12" 
              max="0" 
              step="1"
              :value="freezerSettings.freezerTemperature"
              :disabled="!refrigeratorPower"
              @input="setFreezerTemperature(parseInt($event.target.value))"
              class="temp-slider">
            <div class="temp-labels">
              <span>-12°C</span>
              <span>-9°C</span>
              <span>-6°C</span>
              <span>-3°C</span>
              <span>0°C</span>
            </div>
          </div>
        </div>
        
        <div class="sterilization-control">
          <label>杀菌功能</label>
          <div 
            :class="['sterilization-switch', { active: freezerSettings.freezerSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
            @click="toggleFreezerSterilization">
            <div class="switch-indicator"></div>
          </div>
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

// =========================
// Refrigerator state and modes
// =========================
const refrigeratorPower = ref(false)
const refrigeratorStatus = ref('idle') // idle, cooling, defrosting, error
const refrigeratorMode = ref('normal') // normal, eco, vacation

// 冷藏室设置
const refrigeratorSettings = ref({
  coolingTemperature: 4, // 冷藏温度
  coolingSterilization: false, // 冷藏杀菌
  coolingStatus: 'idle' // 冷藏状态
})

// 冷冻室设置
const freezerSettings = ref({
  freezerTemperature: -6, // 冷冻温度
  freezerSterilization: false, // 冷冻杀菌
  freezerStatus: 'idle' // 冷冻状态
})

// 冰箱状态文本
const refrigeratorStatusText = computed(() => {
  if (!refrigeratorPower.value) return 'Offline'
  switch (refrigeratorStatus.value) {
    case 'idle': return 'Idle'
    case 'cooling': return 'Cooling'
    case 'defrosting': return 'Defrosting'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

// 切换冰箱开关
const toggleRefrigerator = () => {
  refrigeratorPower.value = !refrigeratorPower.value
  if (!refrigeratorPower.value) {
    // 关闭电源时，重置所有状态
    refrigeratorStatus.value = 'idle'
    refrigeratorSettings.value.coolingStatus = 'idle'
    freezerSettings.value.freezerStatus = 'idle'
  } else {
    // 打开电源时，开始制冷
    refrigeratorStatus.value = 'cooling'
    refrigeratorSettings.value.coolingStatus = 'cooling'
    freezerSettings.value.freezerStatus = 'cooling'
  }
}

// 设置冰箱模式
const setRefrigeratorMode = (mode) => {
  if (!refrigeratorPower.value) return
  refrigeratorMode.value = mode
}

// 设置冷藏温度
const setCoolingTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingTemperature = temp
}

// 设置冷冻温度
const setFreezerTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerTemperature = temp
}

// 切换冷藏杀菌
const toggleCoolingSterilization = () => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingSterilization = !refrigeratorSettings.value.coolingSterilization
}

// 切换冷冻杀菌
const toggleFreezerSterilization = () => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerSterilization = !freezerSettings.value.freezerSterilization
}
</script>

<style scoped>
@import '../styles/colors.css';

.refrigerator-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.refrigerator-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.refrigerator-card-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refrigerator-status-section {
  margin-bottom: 24px;
}

.refrigerator-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-button-dark);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.status-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.status-icon.cooling {
  background: var(--color-blue-500);
  color: white;
  animation: pulse 2s infinite;
}

.status-icon.defrosting {
  background: var(--color-orange-500);
  color: var(--color-white);
  animation: pulse 2s infinite;
}

.status-icon.error {
  background: var(--color-red-500);
  color: var(--color-white);
  animation: pulse 2s infinite;
}

.status-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refrigerator-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.compartment-control {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
}

.compartment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.compartment-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.temperature-display {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.temperature-control,
.sterilization-control {
  margin-bottom: 16px;
}

.temperature-control:last-child,
.sterilization-control:last-child {
  margin-bottom: 0;
}

.temperature-control label,
.sterilization-control label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.temp-slider-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.temp-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-medium);
}

.temp-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px var(--color-shadow-light);
  transition: all 0.3s ease;
}

.temp-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px var(--color-shadow-medium);
}

.temp-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.temp-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.temp-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.temp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.sterilization-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sterilization-switch {
  width: 40px;
  height: 20px;
  background: var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sterilization-switch.active {
  background: var(--color-primary);
}

.sterilization-switch.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-indicator {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.sterilization-switch.active .switch-indicator {
  transform: translateX(20px);
}

.refrigerator-modes-header {
  display: flex;
  align-items: center;
}

.refrigerator-modes-header .mode-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.refrigerator-modes-header .mode-btn {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.refrigerator-modes-header .mode-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.refrigerator-modes-header .mode-btn.active {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
  font-weight: 600;
}

.refrigerator-modes-header .mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
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

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .refrigerator-controls {
    gap: 16px;
  }
}
</style>
