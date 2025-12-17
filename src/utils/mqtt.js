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
      path: options.path || '/mqtt',
      clientId: options.clientId || `mqtt_client_${Date.now()}`,
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

    // 绑定方法
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    this.emit = this.emit.bind(this)
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

        // 构建连接URL
        const protocol = this.options.protocol === 'wss' ? 'wss' : 'ws'
        const url = `${protocol}://${this.options.host}:${this.options.port}${this.options.path}`

        // 连接选项
        const connectOptions = {
          clientId: this.options.clientId,
          username: this.options.username,
          password: this.options.password,
          keepalive: this.options.keepalive,
          reconnectPeriod: this.options.reconnectPeriod,
          connectTimeout: this.options.connectTimeout,
          clean: true,
          will: {
            topic: 'client/disconnect',
            payload: JSON.stringify({ clientId: this.options.clientId }),
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
          this.log('MQTT connected successfully')

          // 自动订阅主题
          this.autoSubscribe()

          resolve()
        })

        // 接收消息
        this.client.on('message', (topic, message) => {
          this.handleMessage(topic, message)
        })

        // 连接关闭
        this.client.on('close', () => {
          this.state = this.connectionState.DISCONNECTED
          this.emit('stateChange', this.state)
          this.emit('disconnected')
          this.log('MQTT disconnected')

          // 清除订阅记录
          this.subscribedTopics.clear()
        })

        // 连接错误
        this.client.on('error', (error) => {
          this.state = this.connectionState.ERROR
          this.emit('stateChange', this.state)
          this.emit('error', error)
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
          this.log(`Failed to subscribe to ${systemTopic}:`, error)
        } else {
          this.subscribedTopics.add(systemTopic)
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
        if (this.subscribedTopics.has(oldTopic)) {
          this.client.unsubscribe(oldTopic, (error) => {
            if (error) {
              this.log(`Failed to unsubscribe from ${oldTopic}:`, error)
            } else {
              this.subscribedTopics.delete(oldTopic)
              this.log(`Unsubscribed from ${oldTopic}`)
            }
          })
        }
      }

      // 订阅新的家庭主题
      if (!this.subscribedTopics.has(homeTopic)) {
        this.client.subscribe(homeTopic, { qos: 1 }, (error) => {
          if (error) {
            this.log(`Failed to subscribe to ${homeTopic}:`, error)
          } else {
            this.subscribedTopics.add(homeTopic)
            this.currentHomeId = homeId
            this.log(`Subscribed to ${homeTopic}`)
          }
        })
      }
    } else {
      // 如果没有 homeId，取消之前的家庭订阅
      if (this.currentHomeId) {
        const oldTopic = `home/${this.currentHomeId}/notice`
        if (this.subscribedTopics.has(oldTopic)) {
          this.client.unsubscribe(oldTopic, (error) => {
            if (error) {
              this.log(`Failed to unsubscribe from ${oldTopic}:`, error)
            } else {
              this.subscribedTopics.delete(oldTopic)
              this.log(`Unsubscribed from ${oldTopic}`)
            }
          })
        }
        this.currentHomeId = null
      }
    }
  }

  /**
   * 更新家庭订阅（当 home_id 变化时调用）
   */
  updateHomeSubscription() {
    if (this.client && this.client.connected) {
      this.autoSubscribe()
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
      this.log('Message received:', { topic, data })

      // 根据主题类型处理消息
      if (topic === 'system/notice') {
        // 系统通知消息
        this.handleSystemNotice(data)
      } else if (topic.startsWith('home/') && topic.endsWith('/notice')) {
        // 家庭通知消息
        this.handleHomeNotice(data)
      } else {
        this.log('Unknown topic:', topic)
      }

    } catch (error) {
      this.log('Failed to parse message:', error)
      this.emit('error', error)
    }
  }

  /**
   * 处理系统通知消息
   * @param {Object} data - 消息数据
   */
  handleSystemNotice(data) {
    // 将MQTT消息转换为WebSocket消息格式
    // WebSocket格式: { method: "system.message", params: { type, data } }
    const wsFormatData = {
      method: 'system.message',
      params: data
    }

    // 调用系统消息处理器
    if (this.systemMessageHandler) {
      try {
        this.systemMessageHandler(wsFormatData.params)
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
    // 将MQTT消息转换为WebSocket消息格式
    // WebSocket格式: { method: "family.message", params: { type, data } }
    const wsFormatData = {
      method: 'family.message',
      params: data
    }

    // 调用家庭消息处理器
    if (this.familyMessageHandler) {
      try {
        this.familyMessageHandler(wsFormatData.params)
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

