import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        insightsListing: resolve(__dirname, 'insights/index.html'),
        projectsListing: resolve(__dirname, 'projects/index.html'),
        privateSchools: resolve(__dirname, 'insights/private-schools-better/index.html'),
        whitePaper: resolve(__dirname, 'insights/government-white-paper/index.html'),
        consumerTariffs: resolve(__dirname, 'projects/will-consumer-tariffs-work/index.html'),
      },
    },
  },
})
