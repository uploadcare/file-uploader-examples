<template>
  <div class="wrapper">
    <div class="uploader">
      <uc-default-widget class="uc-wgt-common"/>

      <uc-data-output
        @data-output="handleUploaderEvent"
        fire-event
        class="uc-wgt-common"
      ></uc-data-output>
    </div>
    <div class="output">
      <img
        v-for="file in files"
        :key="file.uuid"
        :src="`https://ucarecdn.com/${file.uuid}/-/preview/-/scale_crop/400x400/`"
        width="200"
      />
    </div>
  </div>
</template>

<script>
import "../../upload-blocks/uc-basic.css";
import "../../upload-blocks/upload-blocks.js";

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
}
.output {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 100%;
  max-width: 1000px;
}
.uploader {
  --cfg-pubkey: "demopublickey";
  --cfg-multiple: 1;
  --cfg-confirm-upload: 1;
  --cfg-img-only: 0;
  --cfg-accept: "";
  --cfg-store: 1;
  --cfg-camera-mirror: 0;
  --cfg-source-list: "local, url, camera, draw, dropbox, gdrive, facebook";
  --cfg-max-files: 10;
}
</style>
