import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        minimal: fileURLToPath(new URL('./minimal.html', import.meta.url)),
        regular: fileURLToPath(new URL('./regular.html', import.meta.url)),
        headless: fileURLToPath(new URL('./headless.html', import.meta.url)),
      },
    },
  },
})