// We import the `regular` variant of the uploader here. Other variants:
// `uc-file-uploader-minimal` and `uc-file-uploader-inline` (each bundle
// ships its own `.min.js` + matching `.min.css` side-effect import).
// See https://uploadcare.com/docs/file-uploader/installation/ for the
// full list and what each looks like.
import * as UC from '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.js';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import './styles.css';

import { mountLayout } from './layout.js';
import { applyTheme, getStoredTheme } from './theme.js';
import { createSimpleUploader } from './file-uploader.js';

// Registers the `<uc-config>`, `<uc-file-uploader-regular>` and
// `<uc-upload-ctx-provider>` custom elements with the browser. Skip
// this and the tags in the HTML stay inert.
UC.defineComponents(UC);

mountLayout('regular');
applyTheme(getStoredTheme());

createSimpleUploader({
  configNode: document.getElementById('my-uploader-config'),
  providerNode: document.getElementById('my-uploader-provider'),
  uploaderNode: document.getElementById('my-uploader'),
  errorsNode: document.getElementById('errors'),
  previewsNode: document.getElementById('previews'),
});
