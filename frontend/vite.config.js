import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // or a specific IP like '192.168.1.100'
    port: 5173,      // Set your desired port (optional)
  },
})
