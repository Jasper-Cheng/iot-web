<template>
  <div class="environment-card">
    <div class="card-header">
      <div class="environment-card-info">
        <h3>{{ device.name || '环境监测' }}</h3>
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
    </div>

    <div class="environment-status-section">
      <div class="environment-summary">
        <div class="aqi-circle" :class="airQualityLevel">
          <div class="aqi-value">{{ sensors.pm25 }}</div>
          <div class="aqi-label">PM2.5</div>
        </div>
        <div class="environment-summary-text">
          <h4>{{ airQualityText }}</h4>
          <p>CO₂ {{ sensors.co2 }} ppm · TVOC {{ sensors.tvoc }} ppb</p>
        </div>
      </div>

      <div class="environment-sensors-grid">
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">CO₂</div>
            <div class="value">{{ sensors.co2 }} ppm</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">甲醛</div>
            <div class="value">{{ sensors.hcho }} mg/m³</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">TVOC</div>
            <div class="value">{{ sensors.tvoc }} ppb</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">PM2.5</div>
            <div class="value">{{ sensors.pm25 }} μg/m³</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">PM10</div>
            <div class="value">{{ sensors.pm10 }} μg/m³</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">温度</div>
            <div class="value">{{ formatTemp }} °C</div>
          </div>
        </div>
        
        <div class="sensor-item">
          <div class="sensor-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sensor-content">
            <div class="label">湿度</div>
            <div class="value">{{ formatHumi }} %</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useGlobalStore } from '../stores/global'
import { getMQTTManager } from '../utils/mqtt'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 使用全局 store
const globalStore = useGlobalStore()

// 获取 MQTT 管理器
const mqttManager = getMQTTManager()

// 设备序列号 - 从props中获取
const deviceSn = computed(() => props.device?.sn || 'M701001-250922-000123')

// 设备在线状态
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// 传感器数据
const sensors = ref({
  co2: 517,
  hcho: 12,
  tvoc: 19,
  pm25: 20,
  pm10: 24,
  temp: 26.1,
  humi: 40.1
})

// 安全的数值格式化
const formatTemp = computed(() => {
  const v = sensors.value.temp
  return typeof v === 'number' && !isNaN(v) ? v.toFixed(1) : (v || '0.0')
})

const formatHumi = computed(() => {
  const v = sensors.value.humi
  return typeof v === 'number' && !isNaN(v) ? v.toFixed(1) : (v || '0.0')
})

// 空气质量等级计算
const airQualityLevel = computed(() => {
  const v = sensors.value.pm25
  if (typeof v !== 'number' || isNaN(v)) return 'good'
  if (v <= 35) return 'good'
  if (v <= 75) return 'moderate'
  if (v <= 115) return 'unhealthy'
  return 'very-bad'
})

// 空气质量文本
const airQualityText = computed(() => {
  const v = sensors.value.pm25
  if (typeof v !== 'number' || isNaN(v)) return '空气优'
  if (v <= 35) return '空气优'
  if (v <= 75) return '良 · 建议通风'
  if (v <= 115) return '轻度污染 · 建议净化'
  return '重度污染 · 建议强力净化'
})

// =========================
// MQTT 设备消息处理
// =========================

/**
 * 处理设备数据消息
 * @param {Object} data - 设备数据
 */
const handleDeviceData = (data) => {
  console.log(`[环境监测] 收到设备数据:`, data)
  
  // 更新传感器数据
  if (data.co2 !== undefined) sensors.value.co2 = data.co2
  if (data.hcho !== undefined) sensors.value.hcho = data.hcho
  if (data.tvoc !== undefined) sensors.value.tvoc = data.tvoc
  if (data.pm25 !== undefined) sensors.value.pm25 = data.pm25
  if (data.pm10 !== undefined) sensors.value.pm10 = data.pm10
  if (data.temp !== undefined) sensors.value.temp = data.temp
  if (data.humi !== undefined) sensors.value.humi = data.humi
}

/**
 * 处理设备状态消息
 * @param {Object} data - 设备状态
 */
const handleDeviceStatus = (data) => {
  console.log(`[环境监测] 收到设备状态:`, data)
  // 设备状态变化处理（如果需要）
}

/**
 * 订阅设备 MQTT 消息
 */
const subscribeDevice = async () => {
  if (!deviceSn.value) {
    console.warn('[环境监测] 设备序列号为空，无法订阅')
    return
  }

  if (!mqttManager.isConnected()) {
    console.warn('[环境监测] MQTT 未连接，无法订阅设备')
    return
  }

  try {
    // 订阅设备主题并注册处理器
    await mqttManager.subscribeDeviceTopics(
      deviceSn.value,
      handleDeviceData,    // data 消息处理器
      handleDeviceStatus   // status 消息处理器
    )
    console.log(`[环境监测] 已订阅设备: ${deviceSn.value}`)
  } catch (error) {
    console.error('[环境监测] 订阅设备失败:', error)
  }
}

/**
 * 取消订阅设备 MQTT 消息
 */
const unsubscribeDevice = async () => {
  if (!deviceSn.value) {
    return
  }

  try {
    await mqttManager.unsubscribeDeviceTopics(deviceSn.value)
    console.log(`[环境监测] 已取消订阅设备: ${deviceSn.value}`)
  } catch (error) {
    console.error('[环境监测] 取消订阅设备失败:', error)
  }
}

// =========================
// 生命周期钩子
// =========================

onMounted(() => {
  // 订阅设备消息
  subscribeDevice()
})

onBeforeUnmount(() => {
  // 取消订阅设备消息
  unsubscribeDevice()
})

</script>

<style scoped>
@import '../styles/colors.css';

.environment-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.environment-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.environment-card-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
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

.environment-status-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.environment-summary {
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
  flex-shrink: 0;
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

.environment-summary-text {
  flex: 1;
}

.environment-summary-text h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 600;
}

.environment-summary-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.environment-sensors-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sensor-item {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.sensor-item:hover {
  background: var(--color-hover);
  border-color: var(--color-primary);
}

.sensor-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.sensor-icon svg {
  width: 100%;
  height: 100%;
}

.sensor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sensor-content .label {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.sensor-content .value {
  font-size: 13px;
  color: var(--color-text-primary);
  font-weight: 600;
}
</style>

