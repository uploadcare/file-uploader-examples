import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // BASE_PATH is set by scripts/build-pages.js when bundling for the
  // GitHub Pages deploy. Defaults to '/' for local dev.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});
