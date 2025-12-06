import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // Change this line

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // Use IP instead of localhost
    port: 5173,
  }, 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})