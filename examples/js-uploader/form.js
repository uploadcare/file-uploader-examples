import * as UC from '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.js';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import './styles.css';

import { mountLayout } from './layout.js';

UC.defineComponents(UC);
import { applyTheme, getStoredTheme, toggleTheme } from './theme.js';
import { createFormUploader } from './file-uploader.js';
import MOCKS from './form/mocks.js';

mountLayout('form');
applyTheme(getStoredTheme());

const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');
const form = document.getElementById('post-form');
const result = document.getElementById('form-result');

titleInput.value = MOCKS.title;
textInput.value = MOCKS.text;

const sunIcon = document.getElementById('theme-toggle-sun');
const moonIcon = document.getElementById('theme-toggle-moon');

const syncThemeIcons = (theme) => {
  sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
  moonIcon.style.display = theme === 'light' ? 'none' : 'block';
};

syncThemeIcons(getStoredTheme());
document.addEventListener('themechange', (e) => syncThemeIcons(e.detail.theme));

document.getElementById('theme-toggle').addEventListener('click', () => toggleTheme());

let photos = [...MOCKS.photos];

const uploader = createFormUploader({
  configNode: document.getElementById('my-uploader-config'),
  providerNode: document.getElementById('my-uploader-provider'),
  uploaderNode: document.getElementById('my-uploader'),
  errorsNode: document.getElementById('errors'),
  previewsNode: document.getElementById('previews'),
  initialFiles: photos,
  onFilesChange: (next) => {
    photos = next;
  },
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = {
    title: titleInput.value,
    text: textInput.value,
    photos,
  };
  result.textContent = JSON.stringify(payload, null, 2);
  result.hidden = false;
  form.hidden = true;
  uploader.destroy();
});
