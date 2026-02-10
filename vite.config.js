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
          target: envConfig.baseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    }
  }
})

