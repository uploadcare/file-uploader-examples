import * as UC from '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.js';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { unsplashPlugin } from './unsplash-plugin.js';
import './styles.css';

UC.defineComponents(UC);

// Register custom Unsplash source plugin on the config element.
// Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
const configNode = document.getElementById('my-uploader-config');
configNode.plugins = [unsplashPlugin];
configNode.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const providerNode = document.getElementById('my-uploader-provider');
const previewsNode = document.getElementById('previews');
const errorsNode = document.getElementById('errors');

// Listen for upload-collection updates. The `change` event delivers the full
// collection on every transition, so we re-derive both successful and failed
// entries on each call.
// Events docs: https://uploadcare.com/docs/file-uploader/events/
providerNode.addEventListener('change', handleChangeEvent);

function handleChangeEvent(e) {
  renderFiles(e.detail.allEntries.filter((f) => f.status === 'success'));
  renderErrors(e.detail.allEntries.filter((f) => f.status === 'failed'));
}

function renderFiles(files) {
  const renderedFiles = files.map((file) => {
    const fileNode = document.createElement('div');
    fileNode.setAttribute('class', 'preview-wrapper');

    const imgNode = document.createElement('img');
    imgNode.setAttribute('class', 'preview-image');
    imgNode.setAttribute('src', `${file.cdnUrl}/-/preview/-/resize/x400/`);
    imgNode.setAttribute('width', '200');
    imgNode.setAttribute('height', '200');
    imgNode.setAttribute('alt', file.fileInfo.originalFilename);
    imgNode.setAttribute('title', file.fileInfo.originalFilename);

    const imgNameNode = document.createElement('p');
    imgNameNode.setAttribute('class', 'preview-data');
    imgNameNode.textContent = `${file.fileInfo.originalFilename}`;

    const imgSizeNode = document.createElement('p');
    imgSizeNode.setAttribute('class', 'preview-data');
    imgSizeNode.textContent = `${formatSize(file.fileInfo.size)}`;

    fileNode.append(imgNode, imgNameNode, imgSizeNode);

    return fileNode;
  });

  previewsNode.replaceChildren(...renderedFiles);
}

function renderErrors(failedFiles) {
  const renderedErrors = failedFiles.map((file) => {
    const node = document.createElement('p');
    node.setAttribute('class', 'error');
    node.setAttribute('role', 'alert');
    const name = file.fileInfo?.originalFilename ?? file.externalUrl ?? 'File';
    const message = file.errors?.[0]?.message ?? 'Upload failed';
    node.textContent = `${name}: ${message}`;
    return node;
  });

  errorsNode.replaceChildren(...renderedErrors);
}

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
