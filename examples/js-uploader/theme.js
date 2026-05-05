/*
  Sets `body.theme--light` / `body.theme--dark` to drive the design tokens
  declared in `styles.css`. Theme is persisted in localStorage and emitted
  via the `themechange` event on the document so other modules (the file
  uploader wrapper) can react.
 */

const STORAGE_KEY = 'jsExampleTheme';
const VALID = ['light', 'dark'];

export function getStoredTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID.includes(stored) ? stored : 'light';
}

export function applyTheme(theme) {
  const next = VALID.includes(theme) ? theme : 'light';
  document.body.classList.remove('theme--light', 'theme--dark');
  document.body.classList.add(`theme--${next}`);
  window.localStorage.setItem(STORAGE_KEY, next);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

export function toggleTheme() {
  applyTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
}
