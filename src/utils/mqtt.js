/**
 * MQTT工具类
 * 提供MQTT连接管理和消息订阅功能
 * 自动订阅 "system/notice" 和 "home/{home_id}/notice" 主题
 */

import mqtt from 'mqtt'
import { useGlobalStore } from '../stores/global'

class MQTTManager {
  constructor(options = {}) {
    // 配置选项
    this.options = {
      host: options.host || 'localhost',
      port: options.port || 1883,
      protocol: options.protocol || 'ws', // ws 或 wss
      path: options.path || '',
      clientId: options.clientId || null, // 将在 connect 时动态生成
      username: options.username || '',
      password: options.password || '',
      reconnectPeriod: options.reconnectPeriod || 3000,
      connectTimeout: options.connectTimeout || 30000,
      keepalive: options.keepalive || 60,
      debug: options.debug || false,
      ...options
    }

    // 连接状态
    this.connectionState = {
      CONNECTING: 'connecting',
      CONNECTED: 'connected',
      DISCONNECTED: 'disconnected',
      RECONNECTING: 'reconnecting',
      ERROR: 'error'
    }

    // 当前状态
    this.state = this.connectionState.DISCONNECTED
    this.client = null
    this.reconnectTimer = null

    // 订阅的主题
    this.subscribedTopics = new Set()
    this.currentHomeId = null

    // 事件监听器
    this.listeners = new Map()

    // 消息处理器
    this.systemMessageHandler = null
    this.familyMessageHandler = null
    
    // 设备主题消息处理器映射
    this.deviceTopicHandlers = new Map()

    // 绑定方法
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    this.emit = this.emit.bind(this)
  }

  /**
   * 生成 clientId
   * @returns {string} clientId
   */
  generateClientId() {
    // 如果已经设置了 clientId，直接返回
    if (this.options.clientId) {
      return this.options.clientId
    }

    // 从 globalStore 获取 userId
    const globalStore = useGlobalStore()
    const userId = globalStore.user?.account?.id || 'unknown'
    const timestamp = Date.now()
    
    // 生成格式：web_iot_${userId}_${时间戳}
    return `web_iot_${userId}_${timestamp}`
  }

  /**
   * 连接到MQTT服务器
   */
  connect() {
    if (this.state === this.connectionState.CONNECTED || 
        this.state === this.connectionState.CONNECTING) {
      this.log('MQTT already connected or connecting')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        this.state = this.connectionState.CONNECTING
        this.emit('stateChange', this.state)
        this.log('Connecting to MQTT server...')

        // 生成或使用已有的 clientId
        const clientId = this.generateClientId()
        // 保存到 options 中，以便后续使用
        if (!this.options.clientId) {
          this.options.clientId = clientId
        }
        
        // 打印 clientId
        console.log('[MQTT] ClientId:', clientId)

        // 构建连接URL
        const protocol = this.options.protocol === 'wss' ? 'wss' : 'ws'
        const url = `${protocol}://${this.options.host}:${this.options.port}${this.options.path}`

        // 连接选项
        const connectOptions = {
          clientId: clientId,
          username: this.options.username,
          password: this.options.password,
          keepalive: this.options.keepalive,
          reconnectPeriod: this.options.reconnectPeriod,
          connectTimeout: this.options.connectTimeout,
          clean: true,
          will: {
            topic: 'client/disconnect',
            payload: JSON.stringify({ clientId: clientId }),
            qos: 1,
            retain: false
          }
        }

        this.client = mqtt.connect(url, connectOptions)

        // 连接成功
        this.client.on('connect', () => {
          this.state = this.connectionState.CONNECTED
          this.emit('stateChange', this.state)
          this.emit('connected')
          console.log('[MQTT] 连接成功')
          this.log('MQTT connected successfully')

          // 自动订阅主题
          this.autoSubscribe()

          resolve()
        })

        // 接收消息（统一处理，包括设备消息）
        this.client.on('message', (topic, message) => {
          this.handleMessage(topic, message)
        })

        // 连接关闭
        this.client.on('close', () => {
          this.state = this.connectionState.DISCONNECTED
          this.emit('stateChange', this.state)
          this.emit('disconnected')
          console.log('[MQTT] 连接已关闭')
          this.log('MQTT disconnected')

          // 清除订阅记录
          this.subscribedTopics.clear()
        })

        // 连接错误
        this.client.on('error', (error) => {
          this.state = this.connectionState.ERROR
          this.emit('stateChange', this.state)
          this.emit('error', error)
          console.error('[MQTT] 连接错误:', error.message || error)
          this.log('MQTT error:', error)
          reject(error)
        })

        // 离线
        this.client.on('offline', () => {
          this.state = this.connectionState.DISCONNECTED
          this.emit('stateChange', this.state)
          this.emit('offline')
          this.log('MQTT offline')
        })

        // 重连
        this.client.on('reconnect', () => {
          this.state = this.connectionState.RECONNECTING
          this.emit('stateChange', this.state)
          this.emit('reconnecting')
          console.log('[MQTT] 正在重连...')
          this.log('MQTT reconnecting...')
        })

      } catch (error) {
        this.state = this.connectionState.ERROR
        this.emit('stateChange', this.state)
        this.emit('error', error)
        this.log('Failed to create MQTT connection:', error)
        reject(error)
      }
    })
  }

  /**
   * 断开MQTT连接
   */
  disconnect() {
    this.log('Disconnecting MQTT...')

    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // 取消所有订阅
    if (this.client && this.client.connected) {
      this.subscribedTopics.forEach(topic => {
        this.client.unsubscribe(topic, (error) => {
          if (error) {
            this.log(`Failed to unsubscribe from ${topic}:`, error)
          } else {
            this.log(`Unsubscribed from ${topic}`)
          }
        })
      })
    }

    // 关闭连接
    if (this.client) {
      this.client.end(true)
      this.client = null
    }

    this.state = this.connectionState.DISCONNECTED
    this.emit('stateChange', this.state)
    this.emit('disconnected')
    this.subscribedTopics.clear()
  }

  /**
   * 自动订阅主题
   * 订阅 "system/notice" 和 "home/{home_id}/notice"
   */
  autoSubscribe() {
    if (!this.client || !this.client.connected) {
      console.warn('[MQTT] 未连接，无法订阅')
      this.log('MQTT not connected, cannot subscribe')
      return
    }

    const globalStore = useGlobalStore()
    const homeId = globalStore.user?.account?.current_family_id

    // 订阅系统通知主题
    const systemTopic = 'system/notice'
    if (!this.subscribedTopics.has(systemTopic)) {
      this.client.subscribe(systemTopic, { qos: 1 }, (error) => {
        if (error) {
          console.error(`[MQTT] 订阅系统主题失败:`, error)
          this.log(`Failed to subscribe to ${systemTopic}:`, error)
        } else {
          this.subscribedTopics.add(systemTopic)
          console.log(`[MQTT] 已订阅: ${systemTopic}`)
          this.log(`Subscribed to ${systemTopic}`)
        }
      })
    }

    // 订阅家庭通知主题
    if (homeId) {
      const homeTopic = `home/${homeId}/notice`
      // 如果之前订阅了其他家庭，先取消订阅
      if (this.currentHomeId && this.currentHomeId !== homeId) {
        const oldTopic = `home/${this.currentHomeId}/notice`
        console.log(`[MQTT] 切换家庭: ${this.currentHomeId} -> ${homeId}`)
        if (this.subscribedTopics.has(oldTopic)) {
          this.client.unsubscribe(oldTopic, (error) => {
            if (error) {
              console.error(`[MQTT] 取消订阅失败:`, error)
              this.log(`Failed to unsubscribe from ${oldTopic}:`, error)
            } else {
              this.subscribedTopics.delete(oldTopic)
              console.log(`[MQTT] 已取消订阅: ${oldTopic}`)
              this.log(`Unsubscribed from ${oldTopic}`)
            }
          })
        }
      }

      // 订阅新的家庭主题
      if (!this.subscribedTopics.has(homeTopic)) {
        this.client.subscribe(homeTopic, { qos: 1 }, (error) => {
          if (error) {
            console.error(`[MQTT] 订阅失败:`, error)
            this.log(`Failed to subscribe to ${homeTopic}:`, error)
          } else {
            this.subscribedTopics.add(homeTopic)
            this.currentHomeId = homeId
            console.log(`[MQTT] 已订阅: ${homeTopic}`)
            this.log(`Subscribed to ${homeTopic}`)
          }
        })
      }
    } else {
      // 如果没有 homeId，取消之前的家庭订阅
      if (this.currentHomeId) {
        const oldTopic = `home/${this.currentHomeId}/notice`
        console.log(`[MQTT] 清除家庭订阅 (家庭ID: ${this.currentHomeId})`)
        if (this.subscribedTopics.has(oldTopic)) {
          this.client.unsubscribe(oldTopic, (error) => {
            if (error) {
              console.error(`[MQTT] 取消订阅失败:`, error)
              this.log(`Failed to unsubscribe from ${oldTopic}:`, error)
            } else {
              this.subscribedTopics.delete(oldTopic)
              this.currentHomeId = null
              console.log(`[MQTT] 已取消订阅: ${oldTopic}`)
              this.log(`Unsubscribed from ${oldTopic}`)
            }
          })
        } else {
          this.currentHomeId = null
        }
      }
    }
  }

  /**
   * 更新家庭订阅（当 home_id 变化时调用）
   */
  updateHomeSubscription() {
    const globalStore = useGlobalStore()
    const homeId = globalStore.user?.account?.current_family_id
    
    if (this.client && this.client.connected) {
      if (this.currentHomeId !== homeId) {
        console.log(`[MQTT] 更新家庭订阅: ${this.currentHomeId || '无'} -> ${homeId || '无'}`)
      }
      this.autoSubscribe()
    } else {
      console.warn('[MQTT] 未连接，无法更新订阅')
    }
  }

  /**
   * 处理接收到的消息
   * @param {string} topic - 主题
   * @param {Buffer} message - 消息内容
   */
  handleMessage(topic, message) {
    try {
      // 解析消息内容
      const messageStr = message.toString()
      const data = JSON.parse(messageStr)
      
      // 根据主题类型处理消息
      if (topic === 'system/notice') {
        // 系统通知消息
        console.log('[MQTT] 收到系统消息:', topic)
        this.handleSystemNotice(data)
      } else if (topic.startsWith('home/') && topic.endsWith('/notice')) {
        // 家庭通知消息
        const homeId = topic.match(/home\/(\d+)\/notice/)?.[1]
        console.log(`[MQTT] 收到家庭消息: ${topic} (家庭ID: ${homeId})`)
        this.handleHomeNotice(data)
      } else if (topic.startsWith('client/') && (topic.endsWith('/data') || topic.endsWith('/status'))) {
        // 设备消息处理
        const deviceSn = topic.match(/client\/([^/]+)\/(data|status)/)?.[1]
        const handler = this.deviceTopicHandlers.get(topic)
        if (handler) {
          try {
            handler(data)
          } catch (error) {
            console.error(`[MQTT] 设备消息处理错误:`, error)
            this.log(`Error in device topic handler for ${topic}:`, error)
          }
        } else {
          console.warn(`[MQTT] 设备消息无处理器: ${topic}`)
          this.log('Device message received but no handler set:', { topic, data })
        }
      } else {
        console.warn(`[MQTT] 未知主题: ${topic}`)
        this.log('Unknown topic:', topic)
      }
      
      this.log('Message received:', { topic, data })

    } catch (error) {
      console.error('[MQTT] 解析消息失败:', error)
      this.log('Failed to parse message:', error)
      this.emit('error', error)
    }
  }

  /**
   * 处理系统通知消息
   * @param {Object} data - 消息数据
   */
  handleSystemNotice(data) {
    // 触发系统消息事件
    // this.emit('system.message', data)

    // 调用系统消息处理器
    if (this.systemMessageHandler) {
      try {
        this.systemMessageHandler(data.params)
      } catch (error) {
        this.log('Error in system message handler:', error)
      }
    } else {
      this.log('Received system notice but no handler set:', data)
    }
  }

  /**
   * 处理家庭通知消息
   * @param {Object} data - 消息数据
   */
  handleHomeNotice(data) {
    // 触发家庭消息事件
    // this.emit('family.message', data)

    // 调用家庭消息处理器
    if (this.familyMessageHandler) {
      try {
        this.familyMessageHandler(data.params)
      } catch (error) {
        this.log('Error in family message handler:', error)
      }
    } else {
      this.log('Received home notice but no handler set:', data)
    }
  }

  /**
   * 设置系统消息处理器
   * @param {Function} handler - 系统消息处理器函数
   */
  setSystemMessageHandler(handler) {
    this.systemMessageHandler = handler
    this.log('System message handler set')
  }

  /**
   * 清除系统消息处理器
   */
  clearSystemMessageHandler() {
    this.systemMessageHandler = null
    this.log('System message handler cleared')
  }

  /**
   * 设置家庭消息处理器
   * @param {Function} handler - 家庭消息处理器函数
   */
  setFamilyMessageHandler(handler) {
    this.familyMessageHandler = handler
    this.log('Family message handler set')
  }

  /**
   * 清除家庭消息处理器
   */
  clearFamilyMessageHandler() {
    this.familyMessageHandler = null
    this.log('Family message handler cleared')
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (!this.listeners.has(event)) {
      return
    }
    
    const callbacks = this.listeners.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {...any} args - 事件参数
   */
  emit(event, ...args) {
    if (!this.listeners.has(event)) {
      return
    }
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        this.log('Event callback error:', error)
      }
    })
  }

  /**
   * 获取连接状态
   * @returns {string} 当前连接状态
   */
  getState() {
    return this.state
  }

  /**
   * 检查是否已连接
   * @returns {boolean} 是否已连接
   */
  isConnected() {
    return this.state === this.connectionState.CONNECTED && 
           this.client && 
           this.client.connected
  }

  /**
   * 获取已订阅的主题列表
   * @returns {Array} 已订阅的主题列表
   */
  getSubscribedTopics() {
    return Array.from(this.subscribedTopics)
  }

  /**
   * 订阅设备主题
   * @param {string} deviceSn - 设备序列号
   * @param {Function} dataHandler - 数据消息处理器 (client/{sn}/data)
   * @param {Function} statusHandler - 状态消息处理器 (client/{sn}/status)
   * @returns {Promise} 返回订阅结果
   */
  subscribeDeviceTopics(deviceSn, dataHandler = null, statusHandler = null) {
    if (!this.client || !this.client.connected) {
      return Promise.reject(new Error('MQTT not connected'))
    }

    return new Promise((resolve, reject) => {
      const dataTopic = `client/${deviceSn}/data`
      const statusTopic = `client/${deviceSn}/status`
      const topics = []

      if (dataHandler) {
        topics.push({ topic: dataTopic, handler: dataHandler })
        this.deviceTopicHandlers.set(dataTopic, dataHandler)
      }
      if (statusHandler) {
        topics.push({ topic: statusTopic, handler: statusHandler })
        this.deviceTopicHandlers.set(statusTopic, statusHandler)
      }

      if (topics.length === 0) {
        resolve()
        return
      }

      // 订阅所有主题
      const topicList = topics.map(t => t.topic)
      this.client.subscribe(topicList, { qos: 1 }, (error) => {
        if (error) {
          this.log(`Failed to subscribe to device topics for ${deviceSn}:`, error)
          reject(error)
        } else {
          // 记录订阅的主题
          topicList.forEach(topic => {
            this.subscribedTopics.add(topic)
          })
          
          this.log(`Subscribed to device topics for ${deviceSn}:`, topicList)
          resolve()
        }
      })
    })
  }

  /**
   * 取消订阅设备主题
   * @param {string} deviceSn - 设备序列号
   * @returns {Promise} 返回取消订阅结果
   */
  unsubscribeDeviceTopics(deviceSn) {
    if (!this.client || !this.client.connected) {
      // 即使未连接，也清除处理器
      const dataTopic = `client/${deviceSn}/data`
      const statusTopic = `client/${deviceSn}/status`
      this.deviceTopicHandlers.delete(dataTopic)
      this.deviceTopicHandlers.delete(statusTopic)
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const dataTopic = `client/${deviceSn}/data`
      const statusTopic = `client/${deviceSn}/status`
      const topics = [dataTopic, statusTopic]

      this.client.unsubscribe(topics, (error) => {
        if (error) {
          this.log(`Failed to unsubscribe from device topics for ${deviceSn}:`, error)
          reject(error)
        } else {
          topics.forEach(topic => {
            this.subscribedTopics.delete(topic)
            this.deviceTopicHandlers.delete(topic)
          })
          this.log(`Unsubscribed from device topics for ${deviceSn}`)
          resolve()
        }
      })
    })
  }

  /**
   * 发布设备控制消息
   * @param {string} deviceSn - 设备序列号
   * @param {Object} payload - 控制消息内容
   * @returns {Promise} 返回发布结果
   */
  publishDeviceControl(deviceSn, payload) {
    if (!this.client || !this.client.connected) {
      return Promise.reject(new Error('MQTT not connected'))
    }

    return new Promise((resolve, reject) => {
      const topic = `client/${deviceSn}/control`
      const message = JSON.stringify(payload)

      this.client.publish(topic, message, { qos: 1 }, (error) => {
        if (error) {
          this.log(`Failed to publish control message to ${topic}:`, error)
          reject(error)
        } else {
          this.log(`Published control message to ${topic}:`, payload)
          resolve()
        }
      })
    })
  }

  /**
   * 日志输出
   * @param {...any} args - 日志参数
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[MQTTManager]', ...args)
    }
  }

  /**
   * 销毁MQTT管理器
   */
  destroy() {
    this.disconnect()
    this.listeners.clear()
    this.systemMessageHandler = null
    this.familyMessageHandler = null
  }
}

// 创建单例实例
let mqttManagerInstance = null

/**
 * 获取MQTT管理器实例
 * @param {Object} options - 配置选项
 * @returns {MQTTManager} MQTT管理器实例
 */
export function getMQTTManager(options = {}) {
  if (!mqttManagerInstance) {
    mqttManagerInstance = new MQTTManager(options)
  }
  return mqttManagerInstance
}

/**
 * 清除MQTT管理器实例
 */
export function clearMQTTManager() {
  if (mqttManagerInstance) {
    mqttManagerInstance.disconnect()
    mqttManagerInstance = null
  }
}

/**
 * 创建新的MQTT管理器实例
 * @param {Object} options - 配置选项
 * @returns {MQTTManager} 新的MQTT管理器实例
 */
export function createMQTTManager(options = {}) {
  return new MQTTManager(options)
}

export default MQTTManager

