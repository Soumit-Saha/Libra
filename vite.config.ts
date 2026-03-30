import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      '3000-iici5nygjwrcxgio57aab-b32ec7bb.sandbox.novita.ai',
      '.sandbox.novita.ai',
      'localhost'
    ]
  }
})
