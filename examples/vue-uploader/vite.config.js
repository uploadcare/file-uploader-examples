import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // BASE_PATH is set by scripts/build-pages.js when bundling for the
  // GitHub Pages deploy. Defaults to '/' for local dev.
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with `uc-`` as custom elements
          isCustomElement: (tag) => tag.includes('uc-'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
