import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // Change this line

export default defineConfig({
  plugins: [react()],  // Change this line
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})