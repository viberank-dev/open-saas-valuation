import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost', // Only allow localhost connections
    cors: {
      origin: ['http://localhost:5173'], // Restrict CORS to localhost only
      credentials: true
    }
  }
})