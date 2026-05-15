import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const repoName = 'economy-lab'
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const base = isGithubPages ? `/${repoName}/` : '/'

const pwa = isGithubPages ? VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['vite.svg'],
  manifest: {
    name: 'Ekonomi Laboratuvarı',
    short_name: 'EconLab',
    description: 'Gençler için oyunlaştırılmış finansal okuryazarlık',
    theme_color: '#0b1220',
    background_color: '#0b1220',
    display: 'standalone',
    scope: base,
    start_url: base,
    icons: [{ src: 'vite.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
  workbox: { globPatterns: ['**/*.{js,css,html,svg}'] },
}) : null

export default defineConfig({
  plugins: [react(), pwa].filter(Boolean),
  base,
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          // MUI + emotion
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-ui';
          }
          // Charts
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'vendor-charts';
          }
          // Game engine
          if (id.includes('/src/game/') && !id.includes('/screens/')) {
            return 'game-engine';
          }
          // Game screens
          if (id.includes('/src/game/screens/')) {
            return 'game-screens';
          }
          // Learn content
          if (id.includes('/src/learn/')) {
            return 'learn-content';
          }
          // Modules (simulations)
          if (id.includes('/src/modules/')) {
            return 'sim-modules';
          }
        },
      },
    },
  },
})
