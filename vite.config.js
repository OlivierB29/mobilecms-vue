import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'
  const proxyTarget = isProd
    ? env.VITE_PROXY_TARGET_PROD || env.VITE_PROXY_TARGET || ''
    : env.VITE_PROXY_TARGET_DEV || env.VITE_PROXY_TARGET || 'http://localhost:8888'

  const proxy = proxyTarget
    ? {
        '/mobilecmsapi': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        },
        '/media': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        },
        '/assets': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    : {}

  return {
    plugins: [vue()],
    base: isProd ? './' : '/',
    server: {
      port: 5173,
      proxy
    }
  }
})
