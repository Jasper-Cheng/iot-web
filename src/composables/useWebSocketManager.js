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
 * 6. 设备事件通知：订阅了才有通知，当调用service.invoke后，属性改变会通知回来
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
 * 7. 取消订阅设备事件请求：
 * {
 *   "id": "req_005",
 *   "method": "event.unsubscribe",
 *   "params": {
 *     "deviceId": "device_123", 
 *     "eventTypes": ["sensorAlert", "statusChange"]
 *   },
 *   "timestamp": 1620000000007
 * }
 * 
 * 8. 心跳包：
 * {
 *   "id": "ping_001",
 *   "method": "ping",
 *   "timestamp": 1620000000000
 * }
 * 
 * 9. 系统消息（设备状态变更）：
 * {
 *   "id": "sys_001",
 *   "method": "system.message",
 *   "params": {
 *     "type": "device_status_change",
 *     "data": {
 *       "deviceId": "device_123",
 *       "deviceName": "智能音箱",
 *       "oldStatus": "online",
 *       "newStatus": "offline",
 *       "timestamp": 1620000000000
 *     }
 *   },
 *   "timestamp": 1620000000000
 * }
 * 
 * 10. 系统消息（系统通知）：
 * {
 *   "id": "sys_002",
 *   "method": "system.message",
 *   "params": {
 *     "type": "system_notification",
 *     "data": {
 *       "title": "系统维护通知",
 *       "message": "系统将于今晚22:00-24:00进行维护",
 *       "level": "info",
 *       "timestamp": 1620000000000
 *     }
 *   },
 *   "timestamp": 1620000000000
 * }
 * 
 * 11. 家庭消息：
 * {
 *   "id": "fam_002",
 *   "method": "family.message",
 *   "params": {
 *     "type": "update.permission",
 *     "data": {
 *       "title": "删除成员",
 *       "message": "成员xx被用户xx删除，请更新",
 *       "level": "urgent"
 *     }
 *   },
 *   "timestamp": 1620000000000
 * }
 */
import { ref, reactive, computed, onMounted, onUnmounted, provide } from 'vue'
import { getWebSocketManager } from '../utils/websocket.js'
import { useGlobalStore } from '../stores/global'


export function useWebSocketManager() {
  // 全局状态
  const globalStore = useGlobalStore()
  
  // 获取用户ID
  const userId = globalStore.user?.user_id
  
  // WebSocket管理器实例
  const wsManager = getWebSocketManager({
    url: `ws://localhost:8000/api/v1/ws/user/${userId}?token=${globalStore.token}`,
    userId: userId,
    debug: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  })

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

      // 监听系统消息
      wsManager.on('systemMessage', (data) => {
        handleSystemMessage(data)
      })

      // 监听家庭消息
      wsManager.on('familyMessage', (data) => {
        handleFamilyMessage(data)
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
   * 处理系统消息
   * @param {Object} data - 系统消息数据
   * @param {string} data.type - 消息类型
   * @param {Object} data.data - 消息内容
   */
  const handleSystemMessage = (data) => {
    const { type, data: messageData } = data
    if (!type || !messageData) return

    // 消息类型处理器映射表
    const messageHandlers = {
      device_status_change: (data) => {
        console.log('📱 设备状态变更:', data)
        handleDeviceOnlineChange(data)
      },
      system_notification: (data) => {
        console.log('🔔 系统通知:', data)
        handleSystemNotification(data)
      },
      promotion: (data) => {
        console.log('🎯 广告/优惠:', data)
        handlePromotion(data)
      },
      mall_new_product: (data) => {
        console.log('🛒 商场上新:', data)
        handleMallNewProduct(data)
      },
      user_message: (data) => {
        console.log('💬 用户消息:', data)
        handleUserMessage(data)
      },
      system_update: (data) => {
        console.log('🔄 系统更新:', data)
        handleSystemUpdate(data)
      }
    }

    const handler = messageHandlers[type]
    if (handler) {
      handler(messageData)
    } else {
      console.warn('未知的系统消息类型:', type)
    }
  }

  /**
   * 处理家庭消息
   * @param {Object} data - 家庭消息数据
   * @param {string} data.type - 消息类型
   * @param {Object} data.data - 消息内容
   */
  const handleFamilyMessage = (data) => {
    const { type, data: messageData } = data
    if (!type || !messageData) return

    // 家庭消息类型处理器映射表
    const messageHandlers = {
      'update.permission': (data) => {
        console.log('👥 权限更新:', data)
        handleFamilyPermissionUpdate(data)
      },
      'update.message': (data) => {
        console.log('💬 消息更新:', data)
        handleFamilyMessageUpdate(data)
      },
      'update.member': (data) => {
        console.log('👤 成员更新:', data)
        handleFamilyMemberUpdate(data)
      }
    }

    const handler = messageHandlers[type]
    if (handler) {
      handler(messageData)
    } else {
      console.warn('未知的家庭消息类型:', type)
    }
  }

  /**
   * 处理设备在线状态变更
   * @param {Object} data - 设备在线状态变更数据
   */
  const handleDeviceOnlineChange = (data) => {
    const { deviceId, deviceName, oldStatus, newStatus, timestamp } = data
    if (globalStore.devices) {
      const device = globalStore.devices.find(d => d.id === deviceId)
      if (device) {
        device.status = newStatus
        device.lastSeen = timestamp
      }
    }
    console.log(`设备 ${deviceName} 状态从 ${oldStatus} 变更为 ${newStatus}`)
  }

  /**
   * 处理系统通知
   * @param {Object} data - 系统通知数据
   */
  const handleSystemNotification = (data) => {
    const { title, message, level } = data
    console.log(`系统通知 [${level}]: ${title} - ${message}`)
  }

  /**
   * 处理优惠活动
   * @param {Object} data - 优惠活动数据
   */
  const handlePromotion = (data) => {
    const { title, message, actionUrl } = data
    console.log(`优惠活动: ${title} - ${message}`)
  }

  /**
   * 处理商场上新
   * @param {Object} data - 商场上新数据
   */
  const handleMallNewProduct = (data) => {
    const { productName, price, category } = data
    console.log(`商场上新: ${productName} - ¥${price} (${category})`)
  }

  /**
   * 处理用户消息
   * @param {Object} data - 用户消息数据
   */
  const handleUserMessage = (data) => {
    const { title, content, priority, deviceId } = data
    console.log(`用户消息 [${priority}]: ${title} - ${content}`)
  }

  /**
   * 处理系统更新
   * @param {Object} data - 系统更新数据
   */
  const handleSystemUpdate = (data) => {
    const { version, features, updateUrl } = data
    console.log(`系统更新: 版本 ${version} - ${features}`)
  }

  /**
   * 处理家庭权限更新
   * @param {Object} data - 家庭权限更新数据
   */
  const handleFamilyPermissionUpdate = (data) => {
    const { title, message, level } = data
    console.log(`家庭权限更新 [${level}]: ${title} - ${message}`)
  }

  /**
   * 处理家庭消息更新
   * @param {Object} data - 家庭消息更新数据
   */
  const handleFamilyMessageUpdate = (data) => {
    const { title, message, level } = data
    console.log(`家庭消息更新 [${level}]: ${title} - ${message}`)
  }

  /**
   * 处理家庭成员更新
   * @param {Object} data - 家庭成员更新数据
   */
  const handleFamilyMemberUpdate = (data) => {
    const { title, message, level } = data
    console.log(`家庭成员更新 [${level}]: ${title} - ${message}`)
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
   * 断开连接
   */
  const disconnect = async () => {
    try {
      // 先取消所有设备的订阅
      if (subscribedDevices.value.size > 0) {
        console.log('断开连接前，先取消所有设备订阅...')
        
        // 并行取消所有设备的订阅
        const unsubscribePromises = Array.from(subscribedDevices.value).map(async (deviceId) => {
          try {
            await wsManager.unsubscribeDeviceEvents(deviceId, ['propertyUpdate', 'eventNotification'])
            console.log(`已取消设备 ${deviceId} 的订阅`)
          } catch (error) {
            // 如果取消订阅失败，记录警告但不阻止断开连接
            console.warn(`取消设备 ${deviceId} 订阅失败:`, error.message)
          }
        })
        
        // 等待所有取消订阅操作完成（最多等待3秒）
        await Promise.allSettled(unsubscribePromises)
        
        // 清空订阅列表
        subscribedDevices.value.clear()
        console.log('所有设备订阅已取消')
      }
    } catch (error) {
      console.warn('取消订阅过程中出现错误:', error)
    } finally {
      // 无论取消订阅是否成功，都断开连接
      wsManager.disconnect()
    }
  }

  // 提供设备管理方法给所有子组件
  provide('deviceManager', {
    invokeDeviceService,   // 调用设备服务 (如开关、调节等)
    getDeviceProperties,   // 获取设备属性 (如温度、湿度等)
    subscribeDeviceEvents, // 订阅设备事件通知
    unsubscribeDeviceEvents, // 取消订阅设备事件
    handleEventNotification, // 处理设备事件通知
    connectionState: computed(() => connectionState.value), // WebSocket 连接状态
  })

  // 提供系统消息管理方法给所有子组件
  provide('systemMessage', {
    handleSystemMessage,
    handleDeviceOnlineChange,
    handleSystemNotification,
    handlePromotion,
    handleMallNewProduct,
    handleUserMessage,
    handleSystemUpdate
  })

  // 提供家庭消息管理方法给所有子组件
  provide('familyMessage', {
    handleFamilyMessage,
    handleFamilyPermissionUpdate,
    handleFamilyMessageUpdate,
    handleFamilyMemberUpdate
  })

  // 组件挂载时初始化连接
  onMounted(() => {
    initConnection()
  })

  // 组件卸载时断开连接
  onUnmounted(async () => {
    await disconnect()
  })

}
