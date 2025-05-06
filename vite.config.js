import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    global: 'window',
  },
  base:"/bakishop/",
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'https://fashion-web-deoh.onrender.com', // Spring Boot backend URL
        changeOrigin: true,
      },
      '/community': {
        target: 'http://localhost:3000', // NodeJS backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
