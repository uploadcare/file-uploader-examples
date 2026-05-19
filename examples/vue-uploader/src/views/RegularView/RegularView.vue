<script>
import * as UC from '@uploadcare/file-uploader';

import { unsplashPlugin } from '../../components/Unsplash/unsplashPlugin.js';

UC.defineComponents(UC);

export default {
  data() {
    return {
      files: [],
      errors: [],
    };
  },

  mounted() {
    // Register custom Unsplash source plugin on the config element.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    const config = this.$refs.config;
    config.plugins = [unsplashPlugin];
    config.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  },

  methods: {
    // Listen for upload-collection updates. The `change` event delivers the
    // full collection on every transition, so we re-derive both successful
    // and failed entries on each call.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    handleChangeEvent(e) {
      if (!e.detail) return;
      this.files = e.detail.allEntries.filter((f) => f.status === 'success');
      this.errors = e.detail.allEntries
        .filter((f) => f.status === 'failed')
        .map((f) => ({
          name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
          message: f.errors?.[0]?.message ?? 'Upload failed',
        }));
    },
    formatSize(bytes) {
      if (!bytes) return '0 Bytes';

      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
    },
  },
};
</script>

<template>
  <div>
    <uc-config
      ref="config"
      ctx-name="my-uploader-3"
      pubkey="a6ca334c3520777c0045"
      source-list="local, url, camera, dropbox, unsplash"
    />

    <uc-file-uploader-regular ctx-name="my-uploader-3" />

    <uc-upload-ctx-provider ctx-name="my-uploader-3" @change="handleChangeEvent" />

    <div v-if="errors.length > 0" class="errors">
      <p v-for="(err, i) in errors" :key="i" class="error" role="alert">
        {{ err.name }}: {{ err.message }}
      </p>
    </div>

    <div class="previews">
      <div v-for="file in files" :key="file.cdnUrl" class="preview-wrapper">
        <img
          class="preview-image"
          :src="`${file.cdnUrl}/-/preview/-/resize/x400/`"
          width="200"
          height="200"
          :alt="file.fileInfo.originalFilename"
          :title="file.fileInfo.originalFilename"
        />

        <p class="preview-data">
          {{ file.fileInfo.originalFilename }}
        </p>
        <p class="preview-data">
          {{ formatSize(file.fileInfo.size) }}
        </p>
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
  margin-top: 20px;
}

.preview-wrapper {
  background-color: white;
  color: darkslategray;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  display: block;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.preview-data {
  font-size: 13px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.errors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 13px;
}
</style>
