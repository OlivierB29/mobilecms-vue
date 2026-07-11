import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/mobilecmsapi': {
        target: 'http://localhost:8888',
        changeOrigin: true
      },
      '/media': {
        target: 'http://localhost:8888',
        changeOrigin: true
      },
      '/assets': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
})
