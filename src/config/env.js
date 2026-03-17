/**
 * 环境配置：切换 CURRENT_ENV 即切换整套 baseUrl / MQTT 等
 */

const CURRENT_ENV = 'production' // 'test' | 'production'
const isDev = true // true: 使用 Vite 代理请求；false: 直连 baseUrl（可能遇到 CORS）

const TEST_CONFIG = {
  baseUrl: 'http://192.168.3.214:8001/api',
  mqttWsUrl: 'ws://192.168.3.214:8884/mqtt',
  mqtt: {
    protocol: 'ws',
    host: '192.168.3.214',
    port: 8884,
    path: '/mqtt'
  }
}

const PRODUCTION_CONFIG = {
  baseUrl: 'http://192.168.3.214:8000/api', // 改为实际生产 API 地址
  mqttWsUrl: 'ws://192.168.3.214:8083/mqtt',
  mqtt: {
    protocol: 'ws',
    host: '192.168.3.214',
    port: 8083,
    path: '/mqtt'
  }
}

const config = CURRENT_ENV === 'production' ? PRODUCTION_CONFIG : TEST_CONFIG

export default {
  env: CURRENT_ENV,
  isDev,
  baseUrl: config.baseUrl,
  mqttWsUrl: config.mqttWsUrl,
  mqtt: config.mqtt
}
