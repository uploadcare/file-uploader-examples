import * as UC from '@uploadcare/file-uploader/web/uc-file-uploader-minimal.min.js';
import '@uploadcare/file-uploader/web/uc-file-uploader-minimal.min.css';
import './styles.css';

import { mountLayout } from './layout.js';
import { applyTheme, getStoredTheme } from './theme.js';
import { createSimpleUploader } from './file-uploader.js';

UC.defineComponents(UC);

mountLayout('minimal');
applyTheme(getStoredTheme());

createSimpleUploader({
  configNode: document.getElementById('my-uploader-config'),
  providerNode: document.getElementById('my-uploader-provider'),
  uploaderNode: document.getElementById('my-uploader'),
  errorsNode: document.getElementById('errors'),
  previewsNode: document.getElementById('previews'),
});
