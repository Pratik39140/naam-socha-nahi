import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/naam-socha-nahi/',
//   build: {
//       outDir: "dist"},
// })
export default defineConfig({
  base: "/naam-socha-nahi/",
    build: {
      outDir: "dist"
      },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/signup": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    hmr: {
      // This also fixes your WebSocket error
      clientPort: 5173,
    },
  },
});