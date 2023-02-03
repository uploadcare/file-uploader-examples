import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'custom-source': resolve(__dirname, 'src/custom-source/index.html'),
      },
    },
  },
})
