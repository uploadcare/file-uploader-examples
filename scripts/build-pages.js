/*
  Builds every example for GitHub Pages and assembles them into ./public.
  Each example is built with `BASE_PATH=<root>/<example>/` so its bundler
  emits the right asset URLs and router base. The output is then copied to
  `public/<name>/`. For SPAs we duplicate `index.html` as `404.html` so
  GitHub Pages routes deep links back to the SPA.

  Usage: BASE_PATH=/file-uploader-examples/ node scripts/build-pages.js
*/

import { spawnSync } from 'node:child_process';
import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writePublicIndex } from './build-pages-index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = resolve(ROOT, 'public');

// Trailing slash matters: BASE_PATH is the path the deploy lives under.
// Each example gets BASE_PATH/<name>/ as its own base.
const ROOT_BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

const EXAMPLES = [
  { name: 'js-uploader', framework: 'JavaScript', distDir: 'dist', spa: false },
  { name: 'react-uploader', framework: 'React (Web Components)', distDir: 'dist', spa: true },
  {
    name: 'react-uploader-adapter',
    framework: 'React (adapter)',
    distDir: 'dist',
    spa: true,
  },
  { name: 'vue-uploader', framework: 'Vue', distDir: 'dist', spa: true },
  { name: 'svelte-uploader', framework: 'Svelte', distDir: 'build', spa: true },
  { name: 'angular-uploader', framework: 'Angular', distDir: 'dist/browser', spa: true },
  { name: 'next-uploader', framework: 'Next.js (Web Components)', distDir: 'out', spa: false },
  {
    name: 'next-uploader-adapter',
    framework: 'Next.js (adapter)',
    distDir: 'out',
    spa: false,
  },
];

console.log(`> Building examples for base "${ROOT_BASE}"`);

rmSync(PUBLIC_DIR, { recursive: true, force: true });
mkdirSync(PUBLIC_DIR, { recursive: true });

for (const ex of EXAMPLES) {
  const cwd = resolve(ROOT, 'examples', ex.name);
  const examplePath = `${ROOT_BASE}${ex.name}/`;
  console.log(`\n> Building ${ex.name} → ${examplePath}`);

  const result = spawnSync('npm', ['run', 'build'], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, BASE_PATH: examplePath },
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`\nBuild failed for ${ex.name} (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }

  const src = resolve(cwd, ex.distDir);
  if (!existsSync(src)) {
    console.error(`\nExpected build output ${src} not found for ${ex.name}`);
    process.exit(1);
  }

  const dest = resolve(PUBLIC_DIR, ex.name);
  cpSync(src, dest, { recursive: true });

  // Help GitHub Pages serve client-side routes for SPAs.
  if (ex.spa) {
    const indexHtml = resolve(dest, 'index.html');
    const notFoundHtml = resolve(dest, '404.html');
    if (existsSync(indexHtml) && !existsSync(notFoundHtml)) {
      copyFileSync(indexHtml, notFoundHtml);
    }
  }
}

writePublicIndex(PUBLIC_DIR, ROOT_BASE, EXAMPLES);

console.log(`\n> Done. Output in ${PUBLIC_DIR}`);
