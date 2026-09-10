import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['bentogo.me'], // Libera o acesso ao domínio
    host: true, // Garante que ele ouça na rede do container
    port: 5173
  },
  assetsInclude: ['**/*.glb'],
})
