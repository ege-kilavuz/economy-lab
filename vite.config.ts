/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const repoName = 'economy-lab'
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const base = isGithubPages ? `/${repoName}/` : './'

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
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
