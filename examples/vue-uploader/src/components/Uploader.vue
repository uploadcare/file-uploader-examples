<template>
  <div class="wrapper">
    <lr-config
      ctx-name="my-uploader"
      pubkey="demopublickey"
      :multiple="true"
      :multipleMax="10"
      :confirmUpload="true"
      sourceList="local, url, camera, dropbox, gdrive"
    ></lr-config>
    <lr-file-uploader-regular
      ctx-name="my-uploader"
      :css-src="`https://unpkg.com/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`"
    >
    </lr-file-uploader-regular>
    <lr-data-output
      ctx-name="my-uploader"
      @lr-data-output="handleUploaderEvent"
      use-event
      hidden
      class="uploader-cfg"
    ></lr-data-output>

    <div class="output">
      <img
        v-for="file in files"
        :key="file.uuid"
        :src="`https://ucarecdn.com/${file.uuid}/${
          file.cdnUrlModifiers || ''
        }-/preview/-/scale_crop/400x400/`"
        width="200"
      />
    </div>
  </div>
</template>

<script>
/*
 * Use minified version because codesandbox can't bundle raw css with relative imports.
 * It's better to use '@uploadcare/blocks/blocks/themes/lr-basic/index.css' instead
 */
import "@uploadcare/blocks/web/lr-basic.min.css";
import * as LR from "@uploadcare/blocks";
import { PACKAGE_VERSION } from "@uploadcare/blocks";

LR.registerBlocks(LR);

export default {
  name: "Uploader",
  setup() {
    return { PACKAGE_VERSION };
  },
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
</style>
