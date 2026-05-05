<script>
import * as UC from '@uploadcare/file-uploader';

import { unsplashPlugin } from '../Unsplash/unsplashPlugin.js';

UC.defineComponents(UC);

export default {
  props: {
    uploaderCtxName: {
      type: String,
      default: '',
    },
    uploaderClassName: {
      type: String,
      default: '',
    },
    files: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].includes(value);
      },
    },
  },

  emits: ['update:files'],

  data() {
    return {
      uploadedFiles: [],
      errors: [],
    };
  },

  mounted() {
    // Register custom Unsplash source plugin on the uploader config element.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    this.$refs.configRef.plugins = [unsplashPlugin];
    this.$refs.configRef.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    // Demo-specific wording for "photos".
    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    this.$refs.configRef.localeDefinitionOverride = {
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
  },

  beforeUnmount() {
    this.$refs.configRef.localeDefinitionOverride = null;
  },

  methods: {
    resetUploaderState() {
      const api = this.$refs.ctxProviderRef.getAPI();
      api.setCurrentActivity(null);
      api.setModalState(false);
      api.removeAllFiles();
    },
    handleRemoveClick(uuid) {
      this.$emit(
        'update:files',
        this.files.filter((f) => f.uuid !== uuid),
      );
    },
    handleChangeEvent(e) {
      // Keep only successful entries (committed on `modal-close`), and
      // surface any failed entries as user-facing errors.
      // Events docs: https://uploadcare.com/docs/file-uploader/events/
      if (!e.detail) return;
      this.uploadedFiles = e.detail.allEntries.filter((f) => f.status === 'success');
      this.errors = e.detail.allEntries
        .filter((f) => f.status === 'failed')
        .map((f) => ({
          name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
          message: f.errors?.[0]?.message ?? 'Upload failed',
        }));
    },
    handleModalCloseEvent() {
      const justUploaded = this.uploadedFiles;

      /*
        Only commit and reset when there is at least one successful
        upload. Otherwise (modal closed without finishing or with all
        uploads failed) we keep whatever in-progress / errored entries
        the uploader has so the user can retry on next open.
       */
      if (justUploaded.length === 0) return;

      /*
        Reset our local cache and emit BEFORE calling
        `resetUploaderState()`. `removeAllFiles()` synchronously fires a
        `change` event with no entries — that handler would otherwise
        overwrite `this.uploadedFiles` with `[]` before we read it.
       */
      this.uploadedFiles = [];
      this.$emit('update:files', [...this.files, ...justUploaded]);
      this.resetUploaderState();
    },
  },
};
</script>

<template>
  <div class="root">
    <uc-config
      ref="configRef"
      :ctx-name="uploaderCtxName"
      pubkey="a6ca334c3520777c0045"
      multiple
      source-list="local, url, camera, dropbox, gdrive, unsplash"
      confirm-upload="false"
      remove-copyright
      img-only
    />

    <uc-file-uploader-regular
      :ctx-name="uploaderCtxName"
      :class="[
        uploaderClassName,
        'file-uploader',
        { 'uc-dark': theme === 'dark', 'uc-light': theme === 'light' },
      ]"
    />

    <uc-upload-ctx-provider
      ref="ctxProviderRef"
      :ctx-name="uploaderCtxName"
      @change="handleChangeEvent"
      @modal-close="handleModalCloseEvent"
    />

    <div v-if="errors.length > 0" class="errors">
      <p v-for="(err, i) in errors" :key="i" class="error" role="alert">
        {{ err.name }}: {{ err.message }}
      </p>
    </div>

    <div class="previews">
      <div v-for="file in files" :key="file.cdnUrl" class="preview">
        <img
          class="preview-image"
          :src="`${file.cdnUrl}/-/preview/-/resize/x200/`"
          width="100"
          :alt="file.fileInfo.originalFilename"
          :title="file.fileInfo.originalFilename"
        />

        <button class="preview-remove-button" type="button" @click="handleRemoveClick(file.uuid)">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
}

.errors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 13px;
}

/*
  CSS variables are used to customize the appearance of the file uploader.

  See more: https://uploadcare.com/docs/file-uploader/styling/
 */
.file-uploader {
  --uc-primary-dark: var(--ui-action-button-background);
  --uc-primary-foreground-dark: var(--ui-action-button-text-color);
}

.preview {
  position: relative;
}

.preview-remove-button {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 18px;
  height: 18px;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  font-family: monospace;
  border: 1px solid var(--ui-control-border-color-default);
  border-radius: 8px;
  background: var(--ui-control-background-color);
  box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
  color: var(--ui-control-text-color);
  cursor: pointer;

  &:hover,
  &:focus {
    background: var(--ui-control-background-color);
    outline: 1px solid var(--ui-control-outline-color-focus);
  }
}

.preview-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.root:deep(uc-simple-btn button) {
  height: auto;
  padding: 10px 12px !important;
  font-family: monospace;
  line-height: 1;
  font-size: 16px;
  border: 1px solid var(--ui-control-border-color-default);
  border-radius: 8px;
  background: var(--ui-control-background-color);
  box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
  color: var(--ui-control-text-color);
}

.root:deep(uc-simple-btn uc-icon) {
  display: none;
}

.root:deep(uc-simple-btn button:hover),
.root:deep(uc-simple-btn button:focus) {
  background: var(--ui-control-background-color);
  outline: 3px solid var(--ui-control-outline-color-focus);
}

.root:deep(uc-simple-btn button:active) {
  border-color: var(--ui-control-border-color-focus);
}
</style>
