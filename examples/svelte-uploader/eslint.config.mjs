import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.svelte-kit/**',
      'build/**',
      '**/*.json',
      '**/*.css',
      '**/*.html',
    ],
  },
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,svelte,svelte.js}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'svelte/no-immutable-reactive-statements': 'off',
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/valid-prop-names-in-kit-pages': 'off',
    },
  },
  prettier,
];
