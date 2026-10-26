/**
 * 环境配置：固定使用正式环境
 */

const isDev = true // true: 使用 Vite 代理请求；false: 直连 baseUrl（可能遇到 CORS）

const config = {
  baseUrl: 'http://212.129.243.155/api',
  mqttWsUrl: 'ws://212.129.243.155:8083/mqtt',
  mqtt: {
    protocol: 'ws',
    host: '212.129.243.155',
    port: 8083,
    path: '/mqtt'
  }
}

export default {
  isDev,
  baseUrl: config.baseUrl,
  mqttWsUrl: config.mqttWsUrl,
  mqtt: config.mqtt
}
