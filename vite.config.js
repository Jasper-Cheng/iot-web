import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 开发时 API 代理目标，可通过 .env 设置 VITE_PROXY_TARGET（如 http://localhost:8001 或 http://192.168.3.196:8000）
function getApiProxyTarget(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  return env.VITE_PROXY_TARGET || 'http://localhost:8001'
}

export default defineConfig(({ mode }) => {
  const apiProxyTarget = getApiProxyTarget(mode)
  return {
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
  }
})

