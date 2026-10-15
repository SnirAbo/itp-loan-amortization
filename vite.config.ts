import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Loan Amortization Calculator',
        short_name: 'AmortCalc',
        theme_color: '#0ea5e9',
        background_color: '#0b1220',
        display: 'standalone',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          { urlPattern: /\/assets\//, handler: 'CacheFirst', options: { cacheName: 'assets' } }
        ]
      }
    })
  ],
  server: { port: 5173 },
  preview: { port: 4173 }
})
