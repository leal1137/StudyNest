import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'thespian-speed-bottling.ngrok-free.dev'
    ],
    proxy: {
      // REST API routes
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      // Auth routes
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      // Socket.IO
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true, // REQUIRED for WebSockets
        changeOrigin: true,
      }
    }
  }
})