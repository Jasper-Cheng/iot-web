import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import envConfig from './src/config/env.js'

export default defineConfig(() => {
  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: envConfig.proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    // 构建时注入环境变量（用于 Docker 镜像构建）
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(envConfig.apiBaseUrl),
      'import.meta.env.VITE_MQTT_WS_URL': JSON.stringify(envConfig.mqttWsUrl)
    }
  }
})

