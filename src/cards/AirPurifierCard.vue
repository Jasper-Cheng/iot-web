<template>
  <div class="air-card">
    <div class="card-header">
      <div class="air-card-info">
        <h3>{{ device.name || 'Air Purifier' }}</h3>
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
      <div class="power-switch">
        <span class="switch-label">{{ effectiveAirPurifierPower ? 'On' : 'Off' }}</span>
        <div 
          :class="['switch-button', { 
            active: effectiveAirPurifierPower,
            disabled: !deviceOnline 
          }]"
          @click="toggleAirPurifier"
        ></div>
      </div>
    </div>

    <div class="air-status-section">
      <div class="air-summary">
        <div class="aqi-circle" :class="airQualityLevel">
          <div class="aqi-value">{{ sensors.pm25 }}</div>
          <div class="aqi-label">PM2.5</div>
        </div>
        <div class="air-summary-text">
          <h4>{{ airQualityText }}</h4>
          <p>CO₂ {{ sensors.co2 }} ppm · VOC {{ sensors.voc }} ppb</p>
        </div>
      </div>

      <div class="air-sensors-grid">
        <div class="sensor-item"><div class="label">PM2.5</div><div class="value">{{ sensors.pm25 }} μg/m³</div></div>
        <div class="sensor-item"><div class="label">PM10</div><div class="value">{{ sensors.pm10 }} μg/m³</div></div>
        <div class="sensor-item"><div class="label">甲醛</div><div class="value">{{ sensors.hcho }} mg/m³</div></div>
        <div class="sensor-item"><div class="label">CO₂</div><div class="value">{{ sensors.co2 }} ppm</div></div>
        <div class="sensor-item"><div class="label">温度</div><div class="value">{{ sensors.temp.toFixed(1) }} °C</div></div>
        <div class="sensor-item"><div class="label">湿度</div><div class="value">{{ sensors.humidity.toFixed(1) }} %</div></div>
        <div class="sensor-item"><div class="label">VOC</div><div class="value">{{ sensors.voc }} ppb</div></div>
      </div>
    </div>

    <div class="air-controls">
      <div class="mode-row">
        <button 
          class="mode-btn"
          :class="{ active: autoMode, disabled: !airPurifierPower }"
          :disabled="!airPurifierPower"
          @click="toggleAutoMode"
        >自动模式</button>

        <div class="speed-control" :class="{ disabled: !airPurifierPower || autoMode }">
          <span class="speed-label">风速</span>
          <div class="speed-dots">
            <button 
              v-for="n in 5" :key="n"
              class="dot"
              :class="{ active: fanSpeed >= n }"
              :disabled="!airPurifierPower || autoMode"
              @click="setFanSpeed(n)"
            ></button>
          </div>
        </div>
      </div>

      <div class="timer-row">
        <div class="timer-toggle">
          <label class="switch">
            <input type="checkbox" v-model="timerEnabled" :disabled="!airPurifierPower" />
            <span class="slider"></span>
          </label>
          <span class="timer-label">定时关机</span>
        </div>
        <div class="timer-options">
          <button 
            v-for="h in [1,2,4,8]" :key="h"
            class="timer-btn"
            :class="{ active: timerEnabled && timerOffHours === h, disabled: !airPurifierPower || !timerEnabled }"
            :disabled="!airPurifierPower || !timerEnabled"
            @click="setTimerOff(h)"
          >{{ h }}h</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

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

// =========================
// Air Purifier state and modes
// =========================
const airPurifierPower = ref(false)
const autoMode = ref(true)
const fanSpeed = ref(3)
const timerEnabled = ref(false)

// 确保离线时开关始终为Off
const effectiveAirPurifierPower = computed(() => {
  // 如果设备离线，强制为Off
  if (!deviceOnline.value) {
    return false
  }
  return airPurifierPower.value
})
const timerOffHours = ref(2)
let airTimerId = null

// 传感器数据（模拟）
const sensors = ref({
  pm25: 35, pm10: 50, hcho: 0.05, co2: 680, temp: 24.0, humidity: 48.0, voc: 180
})

const airQualityLevel = computed(() => {
  const v = sensors.value.pm25
  if (v <= 35) return 'good'
  if (v <= 75) return 'moderate'
  if (v <= 115) return 'unhealthy'
  return 'very-bad'
})

const airQualityText = computed(() => {
  const v = sensors.value.pm25
  if (v <= 35) return '空气优'
  if (v <= 75) return '良 · 建议通风'
  if (v <= 115) return '轻度污染 · 建议净化'
  return '重度污染 · 建议强力净化'
})

const toggleAirPurifier = () => {
  // 设备不在线时不允许操作
  if (!deviceOnline.value) {
    console.warn('设备离线，无法控制设备')
    return
  }
  airPurifierPower.value = !airPurifierPower.value
  if (!airPurifierPower.value) stopAirSimulation()
  else startAirSimulation()
}

const toggleAutoMode = () => {
  if (!airPurifierPower.value) return
  autoMode.value = !autoMode.value
}

const setFanSpeed = (n) => {
  if (!airPurifierPower.value || autoMode.value) return
  fanSpeed.value = n
}

const setTimerOff = (h) => {
  if (!airPurifierPower.value || !timerEnabled.value) return
  timerOffHours.value = h
}

let sensorsInterval = null
const startAirSimulation = () => {
  if (sensorsInterval) clearInterval(sensorsInterval)
  sensorsInterval = setInterval(() => {
    const drift = (v, d, min, max) => Math.min(max, Math.max(min, v + (Math.random() * d * 2 - d)))
    const powerFactor = airPurifierPower.value ? (autoMode.value ? 1.0 : (1.2 - fanSpeed.value * 0.04)) : 1.0
    sensors.value.pm25 = Math.max(5, Math.round(drift(sensors.value.pm25 * powerFactor, 2, 3, 180)))
    sensors.value.pm10 = Math.max(8, Math.round(drift(sensors.value.pm10 * powerFactor, 2.5, 5, 200)))
    sensors.value.hcho = Number(drift(sensors.value.hcho * powerFactor, 0.005, 0.01, 0.3).toFixed(3))
    sensors.value.co2 = Math.round(drift(sensors.value.co2 * powerFactor, 5, 380, 2000))
    sensors.value.temp = Number(drift(sensors.value.temp, 0.05, 16, 32).toFixed(1))
    sensors.value.humidity = Number(drift(sensors.value.humidity, 0.2, 20, 80).toFixed(1))
    sensors.value.voc = Math.max(50, Math.round(drift(sensors.value.voc * powerFactor, 4, 50, 800)))
  }, 1000)

  if (airTimerId) clearTimeout(airTimerId)
  if (timerEnabled.value) {
    airTimerId = setTimeout(() => {
      airPurifierPower.value = false
      stopAirSimulation()
    }, timerOffHours.value * 60 * 60 * 1000)
  }
}

const stopAirSimulation = () => {
  if (sensorsInterval) { clearInterval(sensorsInterval); sensorsInterval = null }
  if (airTimerId) { clearTimeout(airTimerId); airTimerId = null }
}

onBeforeUnmount(() => stopAirSimulation())
</script>

<style scoped>
@import '../styles/colors.css';

.air-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.air-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.air-card-info h3 { 
  margin: 0 0 4px 0; 
  font-size: 16px; 
  font-weight: 700; 
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

.air-status-section { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}

.air-summary { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
}

.aqi-circle {
  width: 64px; 
  height: 64px; 
  border-radius: 50%;
  background: var(--color-button-dark); 
  color: var(--color-text-secondary);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
}

.aqi-circle.good { 
  background: var(--color-green-500); 
  color: var(--color-text-primary); 
}

.aqi-circle.moderate { 
  background: var(--color-yellow-500); 
  color: var(--color-text-primary); 
}

.aqi-circle.unhealthy { 
  background: var(--color-orange-500); 
  color: var(--color-text-primary); 
}

.aqi-circle.very-bad { 
  background: var(--color-red-500); 
  color: var(--color-text-primary); 
}

.aqi-value { 
  font-weight: 700; 
  font-size: 18px; 
  line-height: 1; 
}

.aqi-label { 
  font-size: 10px; 
  opacity: 0.9; 
}

.air-summary-text h4 { 
  margin: 0 0 6px 0; 
  font-size: 14px; 
  color: var(--color-text-primary); 
}

.air-summary-text p { 
  margin: 0; 
  font-size: 12px; 
  color: var(--color-text-secondary); 
}

.air-sensors-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sensor-item {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px;
  display: flex; 
  justify-content: space-between;
}

.sensor-item .label { 
  font-size: 12px; 
  color: var(--color-text-secondary); 
}

.sensor-item .value { 
  font-size: 12px; 
  color: var(--color-text-primary); 
  font-weight: 600; 
}

.air-controls { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.mode-row { 
  display: flex; 
  gap: 12px; 
  align-items: center; 
}

.mode-row .mode-btn {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-row .mode-btn.active { 
  background: var(--color-primary); 
  color: var(--color-primary-text); 
  border-color: var(--color-primary); 
}

.mode-row .mode-btn.disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
}

.speed-control { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.speed-control.disabled { 
  opacity: 0.6; 
  pointer-events: none; 
}

.speed-label { 
  font-size: 12px; 
  color: var(--color-text-secondary); 
}

.speed-dots { 
  display: flex; 
  gap: 8px; 
}

.speed-dots .dot {
  width: 10px; 
  height: 10px; 
  border-radius: 50%;
  border: 1px solid var(--color-border); 
  background: var(--color-bg);
}

.speed-dots .dot.active { 
  background: var(--color-primary); 
  border-color: var(--color-primary); 
}

.timer-row { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
}

.timer-toggle { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.timer-label { 
  font-size: 12px; 
  color: var(--color-text-secondary); 
}

.timer-options { 
  display: flex; 
  gap: 8px; 
}

.timer-btn {
  height: 28px; 
  padding: 0 10px; 
  border-radius: 6px;
  border: 1px solid var(--color-border); 
  background: var(--color-bg);
  color: var(--color-text-primary); 
  font-size: 12px;
}

.timer-btn.active { 
  background: var(--color-primary); 
  border-color: var(--color-primary); 
  color: var(--color-primary-text); 
}

.timer-btn.disabled { 
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

.switch-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-button.disabled:hover {
  transform: none;
}

/* Switch styles */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
