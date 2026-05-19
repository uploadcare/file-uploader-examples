import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        form: fileURLToPath(new URL('./form.html', import.meta.url)),
        minimal: fileURLToPath(new URL('./minimal.html', import.meta.url)),
        regular: fileURLToPath(new URL('./regular.html', import.meta.url)),
      },
    },
  },
});
