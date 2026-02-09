/**
 * 环境配置
 * 开发人员手动切换环境：修改 CURRENT_ENV 的值
 * - 'test': 测试环境
 * - 'production': 生产环境
 */

// ===========================================
// 环境切换：修改此值来切换环境
// ===========================================
const CURRENT_ENV = 'test' // 可选值: 'test' | 'production'

// ===========================================
// 测试环境配置
// ===========================================
const TEST_CONFIG = {
  // 后端 API 地址（用于 Docker 镜像构建时的 VITE_API_BASE_URL）
  apiBaseUrl: 'http://192.168.3.196:8001',
  
  // MQTT WebSocket 地址（用于 Docker 镜像构建时的 VITE_MQTT_WS_URL）
  mqttWsUrl: 'ws://192.168.3.196:8884/mqtt',
  
  // Vite 开发服务器代理目标（npm run dev 时使用）
  proxyTarget: 'http://192.168.3.196:8001',
  
  // MQTT 配置（用于运行时解析）
  mqtt: {
    protocol: 'ws',
    host: '192.168.3.196',
    port: 8884,
    path: '/mqtt'
  }
}

// ===========================================
// 生产环境配置
// ===========================================
const PRODUCTION_CONFIG = {
  // 后端 API 地址（用于 Docker 镜像构建时的 VITE_API_BASE_URL）
  apiBaseUrl: '', // 生产环境使用相对路径，通过 nginx 代理
  
  // MQTT WebSocket 地址（用于 Docker 镜像构建时的 VITE_MQTT_WS_URL）
  mqttWsUrl: 'wss://your-production-mqtt-host/mqtt', // 请修改为实际的生产环境地址
  
  // Vite 开发服务器代理目标（npm run dev 时使用）
  proxyTarget: 'http://your-production-api-host', // 请修改为实际的生产环境地址
  
  // MQTT 配置（用于运行时解析）
  mqtt: {
    protocol: 'wss',
    host: 'your-production-mqtt-host', // 请修改为实际的生产环境地址
    port: 443,
    path: '/mqtt'
  }
}

// ===========================================
// 导出当前环境配置
// ===========================================
const config = CURRENT_ENV === 'production' ? PRODUCTION_CONFIG : TEST_CONFIG

export default {
  // 当前环境
  env: CURRENT_ENV,
  
  // API 基础地址（用于构建时注入）
  apiBaseUrl: config.apiBaseUrl,
  
  // MQTT WebSocket URL（用于构建时注入）
  mqttWsUrl: config.mqttWsUrl,
  
  // Vite 代理目标（开发时使用）
  proxyTarget: config.proxyTarget,
  
  // MQTT 配置（运行时使用）
  mqtt: config.mqtt
}
