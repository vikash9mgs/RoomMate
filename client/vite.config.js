import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  // ✅ Polyfill Node.js globals — kept for any other CJS transitive deps
  define: {
    global: 'globalThis',
  },
})



