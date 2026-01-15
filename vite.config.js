import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // Allow resolving files from node_modules even if not exported
    dedupe: ['vue']
  },
  // Configure optimizeDeps to handle the CSS file
  optimizeDeps: {
    include: ['@motork/component-library']
  },
  server: {
    port: 5000
  }
})
