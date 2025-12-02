<template>
  <div class="environment-card">
    <div class="card-header">
      <div class="environment-card-info">
        <h3>{{ device.name || '环境监测' }}</h3>
        <div class="connection-status">
          <div 
            :class="['status-indicator', { 
              'connected': wsConnected && deviceOnline,
              'disconnected': !wsConnected || !deviceOnline 
            }]"
          ></div>
          <span class="status-text">
            {{ wsConnected && deviceOnline ? '在线' : '离线' }}
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useWebSocketManager } from '../composables/useWebSocketManager'

// 定义 props
const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 使用设备管理器
const { deviceManager } = useWebSocketManager()

// 设备序列号 - 从props中获取
const deviceSn = computed(() => props.device?.sn || 'M701001-250922-000123')

// 设备在线状态
const deviceOnline = computed(() => {
  return props.device?.status === 'online'
})

// WebSocket连接状态
const wsConnected = computed(() => {
  if (!deviceManager || !deviceManager.connectionState) {
    return false
  }
  return deviceManager.connectionState.value === 'connected'
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

// 获取设备属性
const fetchDeviceProperties = async () => {
  if (!deviceManager || !deviceManager.getDeviceProperties) {
    console.warn('EnvironmentMonitorCard: deviceManager.getDeviceProperties 不可用')
    return
  }
  
  if (!wsConnected.value || !deviceOnline.value) return
  
  try {
    const propertyNames = ['co2', 'hcho', 'tvoc', 'pm25', 'pm10', 'temp', 'humi']
    const properties = await deviceManager.getDeviceProperties(deviceSn.value, propertyNames)
    
    if (properties && typeof properties === 'object') {
      // 更新传感器数据
      if (properties.co2 !== undefined && typeof properties.co2 === 'number') sensors.value.co2 = properties.co2
      if (properties.hcho !== undefined && typeof properties.hcho === 'number') sensors.value.hcho = properties.hcho
      if (properties.tvoc !== undefined && typeof properties.tvoc === 'number') sensors.value.tvoc = properties.tvoc
      if (properties.pm25 !== undefined && typeof properties.pm25 === 'number') sensors.value.pm25 = properties.pm25
      if (properties.pm10 !== undefined && typeof properties.pm10 === 'number') sensors.value.pm10 = properties.pm10
      if (properties.temp !== undefined && typeof properties.temp === 'number') sensors.value.temp = properties.temp
      if (properties.humi !== undefined && typeof properties.humi === 'number') sensors.value.humi = properties.humi
    }
  } catch (error) {
    console.error('获取环境监测数据失败:', error)
  }
}

// 订阅设备事件
const subscribeToDeviceProperties = async () => {
  if (!deviceManager || !deviceManager.subscribeDeviceEvents || !deviceManager.setEventNotificationHandler) {
    console.warn('EnvironmentMonitorCard: deviceManager 方法不可用')
    return
  }
  
  if (!wsConnected.value || !deviceOnline.value) return
  
  try {
    // 订阅设备事件
    await deviceManager.subscribeDeviceEvents(deviceSn.value)
    
    // 设置事件通知处理器
    deviceManager.setEventNotificationHandler(deviceSn.value, (eventData) => {
      try {
        const { eventType, eventData: data } = eventData || {}
        
        // 处理属性更新事件
        if (eventType === 'propertyChange' && data && typeof data === 'object') {
          if (data.co2 !== undefined && typeof data.co2 === 'number') sensors.value.co2 = data.co2
          if (data.hcho !== undefined && typeof data.hcho === 'number') sensors.value.hcho = data.hcho
          if (data.tvoc !== undefined && typeof data.tvoc === 'number') sensors.value.tvoc = data.tvoc
          if (data.pm25 !== undefined && typeof data.pm25 === 'number') sensors.value.pm25 = data.pm25
          if (data.pm10 !== undefined && typeof data.pm10 === 'number') sensors.value.pm10 = data.pm10
          if (data.temp !== undefined && typeof data.temp === 'number') sensors.value.temp = data.temp
          if (data.humi !== undefined && typeof data.humi === 'number') sensors.value.humi = data.humi
        }
      } catch (error) {
        console.error('处理事件通知时出错:', error)
      }
    })
  } catch (error) {
    console.error('订阅环境监测设备事件失败:', error)
  }
}

// 监听WebSocket连接状态和设备在线状态
const watchConnection = () => {
  if (!deviceManager) return
  
  if (wsConnected.value && deviceOnline.value) {
    fetchDeviceProperties()
    subscribeToDeviceProperties()
  }
}

// 组件挂载时
let stopWatchers = null

onMounted(() => {
  if (!deviceManager) {
    console.warn('EnvironmentMonitorCard: deviceManager 未初始化')
    return
  }
  
  watchConnection()
  
  // 监听连接状态变化
  const stopWatchConnection = watch(() => {
    if (!deviceManager || !deviceManager.connectionState) return 'disconnected'
    return deviceManager.connectionState.value
  }, () => {
    watchConnection()
  }, { immediate: false })
  
  // 监听设备在线状态变化
  const stopWatchDeviceOnline = watch(() => deviceOnline.value, () => {
    watchConnection()
  }, { immediate: false })
  
  // 保存清理函数
  stopWatchers = () => {
    stopWatchConnection()
    stopWatchDeviceOnline()
  }
})

// 组件卸载时
onBeforeUnmount(() => {
  // 清理 watch 监听器
  if (stopWatchers) {
    stopWatchers()
    stopWatchers = null
  }
  
  // 清除事件处理器
  if (deviceManager && deviceManager.clearEventNotificationHandler) {
    try {
      deviceManager.clearEventNotificationHandler(deviceSn.value)
    } catch (error) {
      console.error('清除事件处理器失败:', error)
    }
  }
  
  // 取消订阅（由 useWebSocketManager 在断开连接时自动处理）
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

