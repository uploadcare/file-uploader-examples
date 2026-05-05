/*
  Vanilla helpers that wrap `<uc-file-uploader-*>` with the shared demo
  conventions: Unsplash custom-source plugin, "photos" copy via the locale
  override, theme-aware `uc-light` / `uc-dark` classes, and a render loop
  for previews and per-file errors.

  - `createFormUploader` powers the form view: previews are removable, and
    only successful entries are committed on `modal-close`.
  - `createSimpleUploader` powers the standalone minimal / regular pages:
    previews mirror whatever the uploader currently has.
 */

import { unsplashPlugin } from './unsplash-plugin.js';
import { getStoredTheme } from './theme.js';

const PHOTO_LOCALE = {
  en: {
    photo__one: 'photo',
    photo__many: 'photos',
    photo__other: 'photos',

    'upload-file': 'Upload photo',
    'upload-files': 'Upload photos',
    'choose-file': 'Choose photo',
    'choose-files': 'Choose photos',
    'drop-files-here': 'Drop photos here',
    'select-file-source': 'Select photo source',
    'edit-image': 'Edit photo',
    'no-files': 'No photos selected',
    'caption-edit-file': 'Edit photo',
    'files-count-allowed': 'Only {{count}} {{plural:photo(count)}} allowed',
    'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
    'header-uploading': 'Uploading {{count}} {{plural:photo(count)}}',
    'header-succeed': '{{count}} {{plural:photo(count)}} uploaded',
    'header-total': '{{count}} {{plural:photo(count)}} selected',
  },
};

function applyThemeClass(uploaderNode, theme) {
  uploaderNode.classList.remove('uc-light', 'uc-dark');
  uploaderNode.classList.add(`uc-${theme}`);
}

function configureUploader(configNode, { applyPhotoLocale } = {}) {
  // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
  configNode.plugins = [unsplashPlugin];
  configNode.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (applyPhotoLocale) {
    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    configNode.localeDefinitionOverride = PHOTO_LOCALE;
  }
}

export function createFormUploader({
  configNode,
  providerNode,
  uploaderNode,
  errorsNode,
  previewsNode,
  initialFiles = [],
  onFilesChange,
}) {
  configureUploader(configNode, { applyPhotoLocale: true });
  applyThemeClass(uploaderNode, getStoredTheme());

  let files = [...initialFiles];
  // Mirrors the live `change` event so we can read the latest set when
  // committing on `modal-close`.
  let stagedSuccess = [];
  let errors = [];

  const renderPreviews = () => {
    previewsNode.replaceChildren();
    for (const file of files) {
      const wrap = document.createElement('div');
      wrap.className = 'preview';

      const img = document.createElement('img');
      img.className = 'preview-image';
      img.src = `${file.cdnUrl}/-/preview/-/resize/x200/`;
      img.width = 100;
      const name = file.fileInfo?.originalFilename ?? '';
      img.alt = name;
      img.title = name;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'preview-remove-button';
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        files = files.filter((f) => f.uuid !== file.uuid);
        onFilesChange?.(files);
        renderPreviews();
      });

      wrap.append(img, remove);
      previewsNode.appendChild(wrap);
    }
  };

  const renderErrors = () => {
    errorsNode.replaceChildren();
    for (const err of errors) {
      const p = document.createElement('p');
      p.className = 'error';
      p.setAttribute('role', 'alert');
      p.textContent = `${err.name}: ${err.message}`;
      errorsNode.appendChild(p);
    }
  };

  const handleChange = (e) => {
    if (!e.detail) return;
    stagedSuccess = e.detail.allEntries.filter((f) => f.status === 'success');
    errors = e.detail.allEntries
      .filter((f) => f.status === 'failed')
      .map((f) => ({
        name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
        message: f.errors?.[0]?.message ?? 'Upload failed',
      }));
    renderErrors();
  };

  const handleModalClose = () => {
    /*
      Only commit and reset when there is at least one successful upload.
      Otherwise (modal closed without finishing or all uploads failed)
      keep whatever in-progress / errored entries the uploader has so the
      user can retry on next open.
     */
    if (stagedSuccess.length === 0) return;

    /*
      Snapshot and clear `stagedSuccess` BEFORE calling `removeAllFiles()`.
      `removeAllFiles()` synchronously fires a `change` event with no
      entries — that handler would otherwise overwrite the snapshot.
     */
    const justUploaded = stagedSuccess;
    stagedSuccess = [];

    files = [...files, ...justUploaded];
    onFilesChange?.(files);
    renderPreviews();

    const api = providerNode.getAPI();
    api.setCurrentActivity(null);
    api.setModalState(false);
    api.removeAllFiles();
  };

  const handleThemeChange = (e) => applyThemeClass(uploaderNode, e.detail.theme);

  providerNode.addEventListener('change', handleChange);
  providerNode.addEventListener('modal-close', handleModalClose);
  document.addEventListener('themechange', handleThemeChange);

  renderPreviews();
  renderErrors();

  return {
    setFiles(next) {
      files = [...next];
      renderPreviews();
    },
    destroy() {
      providerNode.removeEventListener('change', handleChange);
      providerNode.removeEventListener('modal-close', handleModalClose);
      document.removeEventListener('themechange', handleThemeChange);
      configNode.localeDefinitionOverride = null;
    },
  };
}

export function createSimpleUploader({
  configNode,
  providerNode,
  uploaderNode,
  errorsNode,
  previewsNode,
}) {
  configureUploader(configNode);
  applyThemeClass(uploaderNode, getStoredTheme());

  const renderFiles = (files) => {
    previewsNode.replaceChildren();
    for (const file of files) {
      const wrap = document.createElement('div');
      wrap.className = 'preview-wrapper';

      const img = document.createElement('img');
      img.className = 'preview-image';
      img.src = `${file.cdnUrl}/-/preview/-/resize/x400/`;
      img.width = 200;
      img.height = 200;
      const name = file.fileInfo?.originalFilename ?? '';
      img.alt = name;
      img.title = name;

      const nameP = document.createElement('p');
      nameP.className = 'preview-data';
      nameP.textContent = name;

      const sizeP = document.createElement('p');
      sizeP.className = 'preview-data';
      sizeP.textContent = formatSize(file.fileInfo?.size);

      wrap.append(img, nameP, sizeP);
      previewsNode.appendChild(wrap);
    }
  };

  const renderErrors = (failed) => {
    errorsNode.replaceChildren();
    for (const f of failed) {
      const p = document.createElement('p');
      p.className = 'error';
      p.setAttribute('role', 'alert');
      const name = f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File';
      const message = f.errors?.[0]?.message ?? 'Upload failed';
      p.textContent = `${name}: ${message}`;
      errorsNode.appendChild(p);
    }
  };

  const handleChange = (e) => {
    if (!e.detail) return;
    renderFiles(e.detail.allEntries.filter((f) => f.status === 'success'));
    renderErrors(e.detail.allEntries.filter((f) => f.status === 'failed'));
  };

  const handleThemeChange = (e) => applyThemeClass(uploaderNode, e.detail.theme);

  providerNode.addEventListener('change', handleChange);
  document.addEventListener('themechange', handleThemeChange);

  return {
    destroy() {
      providerNode.removeEventListener('change', handleChange);
      document.removeEventListener('themechange', handleThemeChange);
      configNode.localeDefinitionOverride = null;
    },
  };
}

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
