<script>
import * as LR from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

LR.registerBlocks(LR);

export default {
  data() {
    return {
      blocksStyles,
      files: [],
    }
  },

  methods: {
    handleChangeEvent(e) {
      console.log('change event payload:', e);

      if (e.detail) {
        this.files = e.detail.allEntries.filter(f => f.status === 'success');
      }
    },
    formatSize(bytes) {
      if (!bytes) return '0 Bytes';

      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
    }
  },

  mounted() {
    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/events/
     */
    this.$refs.ctxProviderRef.addEventListener('change', this.handleChangeEvent);
  },

  beforeUnmount() {
    this.$refs.ctxProviderRef.removeEventListener('change', this.handleChangeEvent);
  }
}
</script>

<template>
  <div>
    <lr-config
      ctx-name="my-uploader"
      pubkey="2b7f257e8ea0817ba746"
      sourceList="local, url, camera, dropbox"
    ></lr-config>

    <lr-file-uploader-regular
      ctx-name="my-uploader"
      :css-src="blocksStyles"
    ></lr-file-uploader-regular>

    <lr-upload-ctx-provider
      ctx-name="my-uploader"
      ref="ctxProviderRef"
    ></lr-upload-ctx-provider>

    <div class="previews">
      <div
        v-for="file in files"
        :key="file.cdnUrl"
      >
        <img
          class="preview-image"
          :src="`${file.cdnUrl}/-/preview/-/resize/x400/`"
          width="200"
          height="200"
          :alt="file.fileInfo.originalFilename"
          :title="file.fileInfo.originalFilename"
        />

        <span class="preview-title">
          {{file.fileInfo.originalFilename}}, {{formatSize(file.fileInfo.size)}}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.previews {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 32px;
}

.preview-image {
  display: block;
  object-fit: cover;
}

.preview-title {
  margin-top: 4px;
}
</style>
