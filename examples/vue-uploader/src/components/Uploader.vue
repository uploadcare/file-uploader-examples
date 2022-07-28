<template>
  <div class="wrapper">
    <lr-file-uploader-regular class="uploader-cfg lr-wgt-common"></lr-file-uploader-regular>

    <lr-data-output @lr-data-output="handleUploaderEvent" use-event class="uploader-cfg lr-wgt-common"></lr-data-output>

    <div class="output">
      <img v-for="file in files" :key="file.uuid"
        :src="`https://ucarecdn.com/${file.uuid}/-/preview/-/scale_crop/400x400/`" width="200" />
    </div>
  </div>
</template>

<script>
/*
 * Use minified version because codesandbox can't bundle raw css with relative imports.
 * It's better to use '@uploadcare/uc-blocks/blocks/themes/lr-basic/index.css' instead
 */
import '@uploadcare/uc-blocks/web/lr-basic.min.css'
import * as LR from "@uploadcare/uc-blocks";

LR.registerBlocks(LR);

export default {
  name: "Uploader",
  data() {
    return {
      files: [],
    };
  },
  methods: {
    handleUploaderEvent(e) {
      const { data: files } = e.detail;
      this.files = files;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  grid-gap: 32px;
  padding: 32px;
}

.output {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 100%;
  max-width: 1000px;
}

.uploader-cfg {
  --ctx-name: 'uploader';

  /* DO NOT FORGET TO USE YOUR OWN PUBLIC KEY */
  --cfg-pubkey: "demopublickey";
  --cfg-multiple: 1;
  --cfg-confirm-upload: 1;
  --cfg-img-only: 0;
  --cfg-accept: "";
  --cfg-store: 1;
  --cfg-camera-mirror: 0;
  --cfg-source-list: "local, url, camera, dropbox, gdrive";
  --cfg-max-files: 10;
}
</style>
