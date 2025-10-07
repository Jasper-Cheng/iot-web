/**
 * 设备实时数据管理 Composable
 * 用于管理设备的WebSocket实时数据更新
 * 
 * WebSocket消息结构：
 * 
 * 1. 获取设备属性请求：
 * {
 *   "id": "req_001",
 *   "method": "property.get", 
 *   "params": {
 *     "deviceId": "device_123",
 *     "propertyNames": ["temperature", "humidity", "status"]
 *   },
 *   "timestamp": 1620000000000
 * }
 * 
 * 2. 获取设备属性响应：
 * {
 *   "id": "req_001",
 *   "method": "property.get",
 *   "params": {
 *     "deviceId": "device_123",
 *     "properties": {
 *       "temperature": 25.5,
 *       "humidity": 60,
 *       "status": "online"
 *     }
 *   },
 *   "timestamp": 1620000000001
 * }
 * 
 * 3. 调用设备服务请求：
 * {
 *   "id": "req_003", 
 *   "method": "service.invoke",
 *   "params": {
 *     "deviceId": "device_123",
 *     "serviceName": "reboot",
 *     "arguments": {
 *       "delay": 5
 *     }
 *   },
 *   "timestamp": 1620000000003
 * }
 * 
 * 4. 调用设备服务响应：
 * {
 *   "id": "req_003",
 *   "method": "service.invoke", 
 *   "params": {
 *     "deviceId": "device_123",
 *     "serviceName": "reboot", 
 *     "result": {
 *       "status": "success",
 *       "message": "Device will reboot in 5 seconds"
 *     }
 *   },
 *   "timestamp": 1620000000004
 * }
 * 
 * 5. 订阅设备事件请求：
 * {
 *   "id": "req_004",
 *   "method": "event.subscribe",
 *   "params": {
 *     "deviceId": "device_123", 
 *     "eventTypes": ["sensorAlert", "statusChange"]
 *   },
 *   "timestamp": 1620000000005
 * }
 * 
 * 6. 设备事件通知：
 * {
 *   "id": "evt_001",
 *   "method": "event.notify", 
 *   "params": {
 *     "deviceId": "device_123",
 *     "eventType": "sensorAlert",
 *     "data": {
 *       "sensorId": "temp_sensor_1",
 *       "alertLevel": "high", 
 *       "currentValue": 38.5,
 *       "threshold": 35.0
 *     },
 *     "occurredAt": 1620000000006
 *   },
 *   "timestamp": 1620000000006
 * }
 * 
 * 7. 心跳包：
 * {
 *   "id": "ping_001",
 *   "method": "ping",
 *   "timestamp": 1620000000000
 * }
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { getWebSocketManager } from '../utils/websocket.js'
import { useGlobalStore } from '../stores/global'

export function useDeviceRealtime() {
  // 全局状态
  const globalStore = useGlobalStore()
  
  // 获取用户ID
  const userId = globalStore.user?.user_id || globalStore.user?.id
  
  // WebSocket管理器实例
  const wsManager = getWebSocketManager({
    url: `ws://localhost:8000/api/v1/ws/user/4?token=${globalStore.token}`,
    userId: userId,
    debug: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  })

  // 设备实时数据存储
  const deviceData = reactive(new Map())
  
  
  // 连接状态
  const connectionState = ref('disconnected')
  
  // 订阅的设备列表
  const subscribedDevices = ref(new Set())

  /**
   * 初始化WebSocket连接
   */
  const initConnection = async () => {
    try {
      // 监听连接状态变化
      wsManager.on('stateChange', (state) => {
        connectionState.value = state
      })

      // 监听设备属性更新
      wsManager.on('propertyUpdate', (data) => {
        handlePropertyUpdate(data)
      })

      // 监听设备事件通知
      wsManager.on('eventNotification', (data) => {
        handleEventNotification(data)
      })

      // 监听服务响应
      wsManager.on('serviceResponse', (data) => {
        handleServiceResponse(data)
      })

      // 连接WebSocket
      await wsManager.connect()
      // console.log('WebSocket连接成功')
    } catch (error) {
      console.error('WebSocket连接失败:', error)
    }
  }

  /**
   * 处理设备属性更新
   * @param {Object} data - 属性更新数据
   */
  const handlePropertyUpdate = (data) => {
    const { deviceId, properties } = data.params
    
    if (!deviceId || !properties) return

    
    // 更新设备数据
    if (!deviceData.has(deviceId)) {
      deviceData.set(deviceId, {})
    }
    
    const currentData = deviceData.get(deviceId)
    Object.assign(currentData, properties)
    
    console.log(`设备 ${deviceId} 属性更新:`, properties)
  }

  /**
   * 处理设备事件通知
   * @param {Object} data - 事件通知数据
   */
  const handleEventNotification = (data) => {
    const { deviceId, eventType, data: eventData, occurredAt } = data.params
    
    if (!deviceId || !eventType) return

    
    console.log(`设备 ${deviceId} 事件通知:`, eventType, eventData)
  }

  /**
   * 处理服务响应
   * @param {Object} data - 服务响应数据
   */
  const handleServiceResponse = (data) => {
    const { deviceId, serviceName, result } = data.params
    
    if (!deviceId || !serviceName) return

    
    console.log(`设备 ${deviceId} 服务响应:`, serviceName, result)
  }

  /**
   * 获取设备属性
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} propertyNames - 属性名称数组
   */
  const getDeviceProperties = async (deviceId, propertyNames) => {
    try {
      const response = await wsManager.getDeviceProperties(deviceId, propertyNames)
      return response.params.properties
    } catch (error) {
      console.error(`获取设备 ${deviceId} 属性失败:`, error)
      throw error
    }
  }

  /**
   * 调用设备服务
   * @param {string} deviceId - 设备ID
   * @param {string} serviceName - 服务名称
   * @param {Object} serviceArgs - 服务参数
   */
  const invokeDeviceService = async (deviceId, serviceName, serviceArgs = {}) => {
    try {
      const response = await wsManager.invokeDeviceService(deviceId, serviceName, serviceArgs)
      return response.params.result
    } catch (error) {
      console.error(`调用设备 ${deviceId} 服务失败:`, error)
      throw error
    }
  }

  /**
   * 订阅设备事件
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} eventTypes - 事件类型数组
   */
  const subscribeDeviceEvents = async (deviceId, eventTypes) => {
    try {
      await wsManager.subscribeDeviceEvents(deviceId, eventTypes)
      subscribedDevices.value.add(deviceId)
      console.log(`订阅设备 ${deviceId} 事件:`, eventTypes)
    } catch (error) {
      console.error(`订阅设备 ${deviceId} 事件失败:`, error)
      throw error
    }
  }

  /**
   * 取消订阅设备事件
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} eventTypes - 事件类型数组
   */
  const unsubscribeDeviceEvents = async (deviceId, eventTypes) => {
    try {
      await wsManager.unsubscribeDeviceEvents(deviceId, eventTypes)
      subscribedDevices.value.delete(deviceId)
      console.log(`取消订阅设备 ${deviceId} 事件:`, eventTypes)
    } catch (error) {
      console.error(`取消订阅设备 ${deviceId} 事件失败:`, error)
      throw error
    }
  }



  /**
   * 清理设备数据
   * @param {string} deviceId - 设备ID
   */
  const clearDeviceData = (deviceId) => {
    deviceData.delete(deviceId)
    subscribedDevices.value.delete(deviceId)
  }

  /**
   * 断开连接
   */
  const disconnect = () => {
    wsManager.disconnect()
  }

  // 组件挂载时初始化连接
  onMounted(() => {
    initConnection()
  })

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect()
  })

  return {
    // 状态
    connectionState,
    deviceData,
    subscribedDevices,
    
    // 方法
    initConnection,
    disconnect,
    getDeviceProperties,
    invokeDeviceService,
    subscribeDeviceEvents,
    unsubscribeDeviceEvents,
    
    
    // 工具方法
    clearDeviceData
  }
}
