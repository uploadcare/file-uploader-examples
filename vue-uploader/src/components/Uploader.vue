<template>
  <div class="wrapper">
    <uc-uploader class="uploader-cfg uc-wgt-common"></uc-uploader>

    <uc-data-output
      @data-output="handleUploaderEvent"
      fire-event
      class="uploader-cfg uc-wgt-common"
    ></uc-data-output>
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
import "@uploadcare/uploader/build/regular/uc-uploader.css";
import "@uploadcare/uploader/build/regular/uc-uploader.min.js";

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
