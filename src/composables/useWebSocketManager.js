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
 *     "deviceSn": "device_123",
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
 *     "deviceSn": "device_123",
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
 *     "deviceSn": "device_123",
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
 *     "deviceSn": "device_123",
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
 *     "deviceSn": "device_123"
 *   },
 *   "timestamp": 1620000000005
 * }
 * 
 * 6. 设备事件通知：订阅了才有通知，当调用service.invoke后，属性改变会通知回来
 * {
 *   "id": "evt_001",
 *   "method": "event.notify", 
 *   "params": {
 *     "deviceSn": "device_123",
 *     "eventType": "sensorAlert",
 *     "data": {
 *       "senderId": "1234567890",
 *       "senderRole": "member",
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
 *     "deviceSn": "device_123"
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
 *       "deviceSn": "device_123",
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
 *     "type": "delete.member",
 *     "data": {
 *       "senderId": "member_123",
 *       "senderRole": "member",
 *       "title": "删除成员",
 *       "message": "成员xx被用户xx删除，请更新",
 *       "level": "urgent"
 *     }
 *   },
 *   "timestamp": 1620000000000
 * }
 */

import { ref, computed, onMounted, provide, watch } from 'vue'
import { getWebSocketManager, clearWebSocketManager } from '../utils/websocket.js'
import { useGlobalStore } from '../stores/global'


// 单例：共享一个 WebSocket 管理器与连接状态，避免多处实例不同步
let wsManagerSingleton = null
const connectionStateSingleton = ref('disconnected')
const subscribedDevicesSingleton = new Set()
const eventNotificationHandlersSingleton = new Map() // { deviceSn: handler }
let listenersAttachedSingleton = false
let systemMessageHandlerSingleton = null
let familyMessageHandlerSingleton = null

export function useWebSocketManager() {
  // 全局状态
  const globalStore = useGlobalStore()
  
  // 连接状态（指向单例）
  const connectionState = connectionStateSingleton
  
  // 事件处理器映射（指向单例）
  const eventNotificationHandlers = eventNotificationHandlersSingleton

  /**
   * 初始化WebSocket连接
   */
  const initConnection = async () => {
    try {
      const userId = globalStore.user?.user_id
      const token = globalStore.token
      if (!userId || !token) return

      // 检查是否需要重新创建 WebSocket 管理器（token 变化时）
      const currentToken = wsManagerSingleton?.options?.url?.includes('token=') ? 
        wsManagerSingleton.options.url.split('token=')[1] : null
      
      if (!wsManagerSingleton || currentToken !== token) {
        // 先断开旧连接
        if (wsManagerSingleton) {
          wsManagerSingleton.disconnect()
        }
        // 清除全局 WebSocket 实例
        clearWebSocketManager()
        // 创建新的 WebSocket 管理器
        wsManagerSingleton = getWebSocketManager({
          url: `ws://localhost:8000/api/v1/web/ws/user?token=${token}`,
          reconnectInterval: 3000,
          maxReconnectAttempts: 5,
          heartbeatInterval: 5000
        })
      }

      if (!listenersAttachedSingleton) {
        // 监听连接状态变化
        wsManagerSingleton.on('stateChange', (state) => {
          connectionStateSingleton.value = state
        })

        // 监听设备事件通知（event.notify是服务器推送的事件通知）
        wsManagerSingleton.on('event.notify', (data) => {
          handleEventNotification(data)
        })

        // 监听事件订阅响应（event.subscribe是订阅请求的响应）
        wsManagerSingleton.on('event.subscribe', (data) => {
          handleEventSubscribeResponse(data)
        })

        // 监听事件取消订阅响应（event.unsubscribe是取消订阅请求的响应）
        wsManagerSingleton.on('event.unsubscribe', (data) => {
          handleEventUnsubscribeResponse(data)
        })

        // 监听系统消息
        wsManagerSingleton.on('system.message', (data) => {
          handleSystemMessage(data)
        })

        // 监听家庭消息
        wsManagerSingleton.on('family.message', (data) => {
          handleFamilyMessage(data)
        })

        listenersAttachedSingleton = true
      }

      // 连接WebSocket（若已连接/连接中，内部会忽略）
      await wsManagerSingleton.connect()
      // console.log('WebSocket连接成功')
    } catch (error) {
      console.error('WebSocket连接失败:', error)
    }
  }


  /**
   * 处理设备事件通知（event.notify）
   * @param {Object} data - 事件通知数据
   */
  const handleEventNotification = (data) => {
    const { deviceSn, eventType, data: eventData, occurredAt } = data.params || {}
    
    if (!deviceSn || !eventType) {
      console.warn('收到事件通知但缺少必要字段:', data)
      return
    }

    // 查找该设备的事件处理器
    const handler = eventNotificationHandlersSingleton.get(deviceSn)
    if (handler) {
      try {
        handler({ deviceSn, eventType, eventData, occurredAt })
      } catch (error) {
        console.error(`处理设备 ${deviceSn} 事件通知时出错:`, error)
      }
    } else {
      console.log(`收到设备 ${deviceSn} 的事件通知，但没有设置处理器:`, { eventType, eventData })
    }
  }

  /**
   * 处理事件订阅响应（event.subscribe）
   * 注意：这是订阅请求的响应，不是事件通知
   * @param {Object} data - 订阅响应数据
   */
  const handleEventSubscribeResponse = (data) => {
    const { deviceSn } = data.params || {}
    if (deviceSn) {
      // 如果响应成功，设备已经在订阅列表中（由subscribeDeviceEvents添加）
      if (data.error) {
        console.error(`设备 ${deviceSn} 事件订阅失败:`, data.error)
        // 如果订阅失败，从订阅列表中移除
        subscribedDevicesSingleton.delete(deviceSn)
      } else {
        console.log(`设备 ${deviceSn} 事件订阅成功`)
      }
    }
  }

  /**
   * 处理事件取消订阅响应（event.unsubscribe）
   * 注意：这是取消订阅请求的响应
   * @param {Object} data - 取消订阅响应数据
   */
  const handleEventUnsubscribeResponse = (data) => {
    const { deviceSn } = data.params || {}
    if (deviceSn) {
      if (data.error) {
        console.error(`设备 ${deviceSn} 事件取消订阅失败:`, data.error)
      } else {
        console.log(`设备 ${deviceSn} 事件取消订阅成功`)
        // 从订阅列表中移除
        subscribedDevicesSingleton.delete(deviceSn)
        // 清除事件处理器（可选，根据业务需求决定）
        // clearEventNotificationHandler(deviceSn)
      }
    }
  }


  /**
   * 处理系统消息
   * @param {Object} data - 系统消息数据
   * @param {string} data.type - 消息类型
   * @param {Object} data.data - 消息内容
   */
  const handleSystemMessage = (data) => {
    if (systemMessageHandlerSingleton) {
      systemMessageHandlerSingleton(data.params)
    } else {
      console.log('收到系统消息，但没有设置处理器:', data)
    }
  }

  /**
   * 设置系统消息处理器
   * @param {Function} handler - 系统消息处理器函数
   */
  const setSystemMessageHandler = (handler) => {
    systemMessageHandlerSingleton = handler
    console.log('已设置系统消息处理器')
  }

  /**
   * 清除系统消息处理器
   */
  const clearSystemMessageHandler = () => {
    systemMessageHandlerSingleton = null
    console.log('已清除系统消息处理器')
  }

  /**
   * 处理家庭消息
   * @param {Object} data - 家庭消息数据
   * @param {string} data.type - 消息类型
   * @param {Object} data.data - 消息内容
   */
  const handleFamilyMessage = (data) => {
    if (familyMessageHandlerSingleton) {
      familyMessageHandlerSingleton(data.params)
    } else {
      console.log('收到家庭消息，但没有设置处理器:', data)
    }
  }

  /**
   * 设置家庭消息处理器
   * @param {Function} handler - 家庭消息处理器函数
   */
  const setFamilyMessageHandler = (handler) => {
    familyMessageHandlerSingleton = handler
    console.log('已设置家庭消息处理器')
  }

  /**
   * 清除家庭消息处理器
   */
  const clearFamilyMessageHandler = () => {
    familyMessageHandlerSingleton = null
    console.log('已清除家庭消息处理器')
  }



  /**
   * 获取设备属性
   * @param {string} deviceSn - 设备序列号
   * @param {Array<string>} propertyNames - 属性名称数组
   */
  const getDeviceProperties = async (deviceSn, propertyNames) => {
    try {
      const response = await wsManagerSingleton.getDeviceProperties(deviceSn, propertyNames)
      return response.params.properties
    } catch (error) {
      console.error(`获取设备 ${deviceSn} 属性失败:`, error)
      throw error
    }
  }

  /**
   * 调用设备服务
   * @param {string} deviceSn - 设备序列号
   * @param {string} serviceName - 服务名称
   * @param {Object} serviceArgs - 服务参数
   */
  const invokeDeviceService = async (deviceSn, serviceName, serviceArgs = {}) => {
    try {
      const response = await wsManagerSingleton.invokeDeviceService(deviceSn, serviceName, serviceArgs)
      return response.params.result
    } catch (error) {
      console.error(`调用设备 ${deviceSn} 服务失败:`, error)
      throw error
    }
  }

  /**
   * 订阅设备事件
   * @param {string} deviceSn - 设备序列号
   */
  const subscribeDeviceEvents = async (deviceSn) => {
    try {
      await wsManagerSingleton.subscribeDeviceEvents(deviceSn)
      subscribedDevicesSingleton.add(deviceSn)
      console.log(`订阅设备 ${deviceSn} 事件`)
    } catch (error) {
      console.error(`订阅设备 ${deviceSn} 事件失败:`, error)
      throw error
    }
  }

  /**
   * 取消订阅设备事件
   * @param {string} deviceSn - 设备序列号
   */
  const unsubscribeDeviceEvents = async (deviceSn) => {
    try {
      await wsManagerSingleton.unsubscribeDeviceEvents(deviceSn)
      subscribedDevicesSingleton.delete(deviceSn)
      console.log(`取消订阅设备 ${deviceSn} 事件`)
    } catch (error) {
      console.error(`取消订阅设备 ${deviceSn} 事件失败:`, error)
      throw error
    }
  }

  /**
   * 设置事件通知处理器
   * @param {string} deviceSn - 设备序列号
   * @param {Function} handler - 事件处理器函数
   */
  const setEventNotificationHandler = (deviceSn, handler) => {
    eventNotificationHandlersSingleton.set(deviceSn, handler)
    console.log(`已为设备 ${deviceSn} 设置了事件处理器`)
  }

  /**
   * 清除事件通知处理器
   * @param {string} deviceSn - 设备序列号
   */
  const clearEventNotificationHandler = (deviceSn) => {
    eventNotificationHandlersSingleton.delete(deviceSn)
    console.log(`清除设备 ${deviceSn} 的事件处理器`)
  }

  /**
   * 清除所有事件通知处理器
   */
  const clearAllEventNotificationHandlers = () => {
    eventNotificationHandlersSingleton.clear()
    console.log('清除所有设备的事件处理器')
  }




  /**
   * 断开连接
   */
  const disconnect = async () => {
    try {
      // 先取消所有设备的订阅
      if (subscribedDevicesSingleton.size > 0) {
        console.log('断开连接前，先取消所有设备订阅...')
        
        // 并行取消所有设备的订阅
        const unsubscribePromises = Array.from(subscribedDevicesSingleton).map(async (deviceSn) => {
          try {
            await wsManagerSingleton.unsubscribeDeviceEvents(deviceSn)
            console.log(`已取消设备 ${deviceSn} 的订阅`)
          } catch (error) {
            // 如果取消订阅失败，记录警告但不阻止断开连接
            console.warn(`取消设备 ${deviceSn} 订阅失败:`, error.message)
          }
        })
        
        // 等待所有取消订阅操作完成（最多等待3秒）
        await Promise.allSettled(unsubscribePromises)
        
        // 清空订阅列表
        subscribedDevicesSingleton.clear()
        console.log('所有设备订阅已取消')
      }
      
      // 清除所有事件处理器
      clearAllEventNotificationHandlers()
      // 重置监听器附加状态
      listenersAttachedSingleton = false
      // 重置连接状态
      connectionStateSingleton.value = 'disconnected'
    } catch (error) {
      console.warn('取消订阅过程中出现错误:', error)
    } finally {
      // 无论取消订阅是否成功，都断开连接
      if (wsManagerSingleton) {
        wsManagerSingleton.disconnect()
        wsManagerSingleton = null
      }
      // 清除全局 WebSocket 实例
      clearWebSocketManager()
    }
  }

  // 提供设备管理方法给所有子组件
  provide('deviceManager', {
    invokeDeviceService,   // 调用设备服务 (如开关、调节等)
    getDeviceProperties,   // 获取设备属性 (如温度、湿度等)
    subscribeDeviceEvents, // 订阅设备事件通知
    unsubscribeDeviceEvents, // 取消订阅设备事件
    setEventNotificationHandler, // 设置事件通知处理器
    clearEventNotificationHandler, // 清除事件通知处理器
    connectionState: computed(() => connectionState.value), // WebSocket 连接状态
  })

  // 提供系统消息管理方法给所有子组件
  provide('systemMessage', {
    setSystemMessageHandler,
    clearSystemMessageHandler,
    connectionState: computed(() => connectionState.value)
  })

  // 提供家庭消息管理方法给所有子组件
  provide('familyMessage', {
    setFamilyMessageHandler,
    clearFamilyMessageHandler,
    connectionState: computed(() => connectionState.value)
  })

  // 组件挂载时初始化连接
  onMounted(() => {
    initConnection()
  })

  // 注意：不在组件卸载时断开连接，因为WebSocket连接是全局的
  // 应该由应用级别管理连接的生命周期

  // 返回消息管理器对象，供直接使用
  return {
    deviceManager: {
      invokeDeviceService,   // 调用设备服务 (如开关、调节等)
      getDeviceProperties,   // 获取设备属性 (如温度、湿度等)
      subscribeDeviceEvents, // 订阅设备事件通知
      unsubscribeDeviceEvents, // 取消订阅设备事件
      setEventNotificationHandler, // 设置事件通知处理器
      clearEventNotificationHandler, // 清除事件通知处理器
      eventNotificationHandlers, // 事件通知处理器映射表
      connectionState: computed(() => connectionState.value), // WebSocket 连接状态
    },
    systemMessage: {
      setSystemMessageHandler,   // 设置系统消息处理器
      clearSystemMessageHandler, // 清除系统消息处理器
      connectionState: computed(() => connectionState.value) // WebSocket 连接状态
    },
    familyMessage: {
      setFamilyMessageHandler,   // 设置家庭消息处理器
      clearFamilyMessageHandler, // 清除家庭消息处理器
      connectionState: computed(() => connectionState.value) // WebSocket 连接状态
    },
    disconnect  // 导出断开连接方法
  }
}
