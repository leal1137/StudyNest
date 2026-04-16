import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // REST API routes
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      // Auth routes (IMPORTANT)
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      // Socket.IO (VERY IMPORTANT)
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true, // REQUIRED for WebSockets
        changeOrigin: true,
      }
    }
  }
})