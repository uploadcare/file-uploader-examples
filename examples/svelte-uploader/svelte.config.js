import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// BASE_PATH is set by scripts/build-pages.js when bundling for the
// GitHub Pages deploy. Defaults to '' for local dev. SvelteKit expects
// `paths.base` without a trailing slash.
const rawBase = process.env.BASE_PATH ?? '';
const base = rawBase.replace(/\/$/, '');

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // SPA-style fallback page; build-pages.js duplicates this as
      // 404.html so GitHub Pages routes deep links back to the SPA.
      fallback: 'index.html',
    }),
    paths: {
      base,
    },
  },
};
