/**
 * WebSocket工具类
 * 提供设备控制和实时信息显示的WebSocket连接管理
 */
class WebSocketManager {
  constructor(options = {}) {
    // 配置选项
    this.options = {
      url: options.url || '',
      protocols: options.protocols || [],
      reconnectInterval: options.reconnectInterval || 3000, // 重连间隔(ms)
      maxReconnectAttempts: options.maxReconnectAttempts || 5, // 最大重连次数
      heartbeatInterval: options.heartbeatInterval || 30000, // 心跳间隔(ms)
      messageTimeout: options.messageTimeout || 10000, // 消息超时时间(ms)
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
    this.ws = null
    this.reconnectAttempts = 0
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.messageQueue = [] // 离线消息队列
    this.pendingMessages = new Map() // 等待响应的消息
    this.messageId = 0 // 消息ID计数器

    // 事件监听器
    this.listeners = new Map()

    // 绑定方法
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.send = this.send.bind(this)
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    this.emit = this.emit.bind(this)
  }

  /**
   * 连接到WebSocket服务器
   */
  connect() {
    if (this.state === this.connectionState.CONNECTED || 
        this.state === this.connectionState.CONNECTING) {
      this.log('WebSocket already connected or connecting')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        this.state = this.connectionState.CONNECTING
        this.emit('stateChange', this.state)
        this.log('Connecting to WebSocket server...', this.options.url)

        this.ws = new WebSocket(this.options.url, this.options.protocols)

        // 连接成功
        this.ws.onopen = (event) => {
          this.state = this.connectionState.CONNECTED
          this.reconnectAttempts = 0
          this.emit('stateChange', this.state)
          this.emit('connected', event)
          
          // 启动心跳检测
          this.startHeartbeat()
          
          // 发送队列中的消息
          this.flushMessageQueue()
          
          resolve(event)
        }

        // 接收消息
        this.ws.onmessage = (event) => {
          this.handleMessage(event)
        }

        // 连接关闭
        this.ws.onclose = (event) => {
          this.state = this.connectionState.DISCONNECTED
          this.emit('stateChange', this.state)
          this.emit('disconnected', event)
          this.log('WebSocket disconnected', event.code, event.reason)
          
          // 停止心跳检测
          this.stopHeartbeat()
          
          // 清理等待响应的消息
          this.clearPendingMessages()
          
          // 如果不是主动断开，尝试重连
          if (!event.wasClean && this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        // 连接错误
        this.ws.onerror = (error) => {
          this.state = this.connectionState.ERROR
          this.emit('stateChange', this.state)
          this.emit('error', error)
          this.log('WebSocket error:', error)
          reject(error)
        }

      } catch (error) {
        this.state = this.connectionState.ERROR
        this.emit('stateChange', this.state)
        this.emit('error', error)
        this.log('Failed to create WebSocket connection:', error)
        reject(error)
      }
    })
  }

  /**
   * 断开WebSocket连接
   */
  disconnect() {
    this.log('Disconnecting WebSocket...')
    
    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    // 停止心跳检测
    this.stopHeartbeat()
    
    // 关闭连接
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.state = this.connectionState.DISCONNECTED
    this.emit('stateChange', this.state)
    this.emit('disconnected', { wasClean: true })
  }

  /**
   * 发送消息
   * @param {Object} message - 要发送的消息
   * @param {boolean} requireResponse - 是否需要响应
   * @returns {Promise} 如果需要响应则返回Promise
   */
  send(message, requireResponse = false) {
    return new Promise((resolve, reject) => {
      // 如果未连接，将消息加入队列
      if (this.state !== this.connectionState.CONNECTED) {
        this.messageQueue.push({ message, requireResponse, resolve, reject })
        this.log('Message queued (not connected):', message)
        return
      }

      try {
        // 生成消息ID
        const messageId = `req_${String(++this.messageId).padStart(3, '0')}`
        const messageWithId = {
          id: messageId,
          timestamp: Date.now(),
          ...message
        }

        // 如果需要响应，添加到等待列表
        if (requireResponse) {
          this.pendingMessages.set(messageId, {
            resolve,
            reject,
            timeout: setTimeout(() => {
              this.pendingMessages.delete(messageId)
              reject(new Error('Message timeout'))
            }, this.options.messageTimeout)
          })
        }

        // 发送消息
        this.ws.send(JSON.stringify(messageWithId))
        this.log('Message sent:', messageWithId)

        // 如果不需要响应，立即resolve
        if (!requireResponse) {
          resolve(messageWithId)
        }

      } catch (error) {
        this.log('Failed to send message:', error)
        reject(error)
      }
    })
  }

  /**
   * 处理接收到的消息
   * @param {MessageEvent} event - WebSocket消息事件
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data)
      this.log('Message received:', data)

      // 处理响应消息（通过ID匹配）
      if (data.id && this.pendingMessages.has(data.id)) {
        const pending = this.pendingMessages.get(data.id)
        clearTimeout(pending.timeout)
        this.pendingMessages.delete(data.id)
        pending.resolve(data)
        return
      }

      // 处理心跳响应
      if (data.method === 'pong' || (data.id && data.id.startsWith('ping_'))) {
        this.log('Heartbeat pong received')
        return
      }

      // 触发通用消息事件
      this.emit('message', data)

      // 根据method类型触发特定事件
      if (data.method) {
        this.emit(`message:${data.method}`, data)
        
        // 为特定方法类型触发更具体的事件
        if (data.method.startsWith('property.')) {
          this.emit('propertyUpdate', data)
        } else if (data.method.startsWith('service.')) {
          this.emit('serviceResponse', data)
        } else if (data.method.startsWith('event.')) {
          this.emit('eventNotification', data)
        } else if (data.method.startsWith('system.')) {
          this.emit('systemMessage', data)
        } else if (data.method.startsWith('family.')) {
          this.emit('familyMessage', data)
        }
      }

    } catch (error) {
      this.log('Failed to parse message:', error)
      this.emit('error', error)
    }
  }

  /**
   * 启动心跳检测
   */
  startHeartbeat() {
    this.stopHeartbeat() // 确保没有重复的心跳定时器
    
    this.heartbeatTimer = setInterval(() => {
      if (this.state === this.connectionState.CONNECTED) {
        const pingId = `ping_${String(++this.messageId).padStart(3, '0')}`
        this.send({ 
          id: pingId,
          method: 'ping' 
        }, false).catch(error => {
          this.log('Heartbeat ping failed:', error)
        })
      }
    }, this.options.heartbeatInterval)
  }

  /**
   * 停止心跳检测
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 安排重连
   */
  scheduleReconnect() {
    if (this.reconnectTimer) {
      return
    }

    this.state = this.connectionState.RECONNECTING
    this.emit('stateChange', this.state)
    this.emit('reconnecting', this.reconnectAttempts + 1)

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.log(`Reconnecting... (attempt ${this.reconnectAttempts})`)
      
      this.connect().catch(error => {
        this.log('Reconnect failed:', error)
        this.emit('reconnectFailed', error)
      })
      
      this.reconnectTimer = null
    }, this.options.reconnectInterval)
  }

  /**
   * 发送队列中的消息
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { message, requireResponse, resolve, reject } = this.messageQueue.shift()
      this.send(message, requireResponse).then(resolve).catch(reject)
    }
  }

  /**
   * 清理等待响应的消息
   */
  clearPendingMessages() {
    this.pendingMessages.forEach(({ timeout, reject }) => {
      clearTimeout(timeout)
      reject(new Error('Connection closed'))
    })
    this.pendingMessages.clear()
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
    return this.state === this.connectionState.CONNECTED
  }

  /**
   * 获取重连次数
   * @returns {number} 重连次数
   */
  getReconnectAttempts() {
    return this.reconnectAttempts
  }

  /**
   * 获取队列中的消息数量
   * @returns {number} 队列消息数量
   */
  getQueueLength() {
    return this.messageQueue.length
  }

  /**
   * 日志输出
   * @param {...any} args - 日志参数
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[WebSocketManager]', ...args)
    }
  }

  /**
   * 获取设备属性
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} propertyNames - 属性名称数组
   * @returns {Promise} 返回属性值
   */
  getDeviceProperties(deviceId, propertyNames) {
    return this.send({
      method: 'property.get',
      params: {
        deviceId,
        propertyNames
      }
    }, true)
  }

  /**
   * 调用设备服务
   * @param {string} deviceId - 设备ID
   * @param {string} serviceName - 服务名称
   * @param {Object} serviceArgs - 服务参数
   * @returns {Promise} 返回服务调用结果
   */
  invokeDeviceService(deviceId, serviceName, serviceArgs = {}) {
    return this.send({
      method: 'service.invoke',
      params: {
        deviceId,
        serviceName,
        arguments: serviceArgs
      }
    }, true)
  }

  /**
   * 订阅设备事件
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} eventTypes - 事件类型数组
   * @returns {Promise} 返回订阅结果
   */
  subscribeDeviceEvents(deviceId, eventTypes) {
    return this.send({
      method: 'event.subscribe',
      params: {
        deviceId,
        eventTypes
      }
    }, true)
  }

  /**
   * 取消订阅设备事件
   * @param {string} deviceId - 设备ID
   * @param {Array<string>} eventTypes - 事件类型数组
   * @returns {Promise} 返回取消订阅结果
   */
  unsubscribeDeviceEvents(deviceId, eventTypes) {
    return this.send({
      method: 'event.unsubscribe',
      params: {
        deviceId,
        eventTypes
      }
    }, true)
  }

  /**
   * 发送家庭消息
   * @param {string} type - 消息类型 (update.permission, update.message, update.member)
   * @param {Object} data - 消息数据
   * @param {string} data.title - 消息标题
   * @param {string} data.message - 消息内容
   * @param {string} data.level - 消息级别 (normal/urgent/critical)
   * @returns {Promise} 返回发送结果
   */
  sendFamilyMessage(type, data) {
    return this.send({
      method: 'family.message',
      params: {
        type,
        data
      }
    }, true)
  }

  /**
   * 销毁WebSocket管理器
   */
  destroy() {
    this.disconnect()
    this.listeners.clear()
    this.messageQueue = []
    this.clearPendingMessages()
  }
}

// 创建单例实例
let wsManagerInstance = null

/**
 * 获取WebSocket管理器实例
 * @param {Object} options - 配置选项
 * @returns {WebSocketManager} WebSocket管理器实例
 */
export function getWebSocketManager(options = {}) {
  // 如果URL包含用户ID占位符，需要动态替换
  if (options.url && options.url.includes('{user_id}')) {
    // user_id只能从外部传入
    const userId = options.userId
    if (userId) {
      options.url = options.url.replace('{user_id}', userId)
    } else {
      throw new Error('user_id is required when URL contains {user_id} placeholder')
    }
  }
  
  if (!wsManagerInstance) {
    wsManagerInstance = new WebSocketManager(options)
  }
  return wsManagerInstance
}

/**
 * 清除WebSocket管理器实例
 */
export function clearWebSocketManager() {
  if (wsManagerInstance) {
    wsManagerInstance.disconnect()
    wsManagerInstance = null
  }
}

/**
 * 创建新的WebSocket管理器实例
 * @param {Object} options - 配置选项
 * @returns {WebSocketManager} 新的WebSocket管理器实例
 */
export function createWebSocketManager(options = {}) {
  // 如果URL包含用户ID占位符，需要动态替换
  if (options.url && options.url.includes('{user_id}')) {
    // user_id只能从外部传入
    const userId = options.userId
    if (userId) {
      options.url = options.url.replace('{user_id}', userId)
    } else {
      throw new Error('user_id is required when URL contains {user_id} placeholder')
    }
  }
  
  return new WebSocketManager(options)
}

export default WebSocketManager
