import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    test: {
    globals: true, // Allows using test, expect, etc. without importing
    environment: 'jsdom', // This simulates a browser environment
    setupFiles: './src/setupTest.js', // Path to your test setup file
  },
})
