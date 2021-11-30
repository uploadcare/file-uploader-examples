<template>
  <div class="wrapper">
    <div class="uploader">
      <uc-simple-btn :class="classList"></uc-simple-btn>

      <uc-modal :class="classList" strokes>
        <uc-source-select>
          <uc-source-list wrap></uc-source-list>
          <uc-drop-area></uc-drop-area>
        </uc-source-select>
        <uc-upload-list></uc-upload-list>
        <uc-camera-source></uc-camera-source>
        <uc-url-source></uc-url-source>
        <uc-external-source></uc-external-source>
        <uc-upload-details></uc-upload-details>
        <uc-confirmation-dialog></uc-confirmation-dialog>
        <uc-cloud-image-editor></uc-cloud-image-editor>
      </uc-modal>

      <uc-message-box :class="classList"></uc-message-box>
      <uc-progress-bar :class="classList"></uc-progress-bar>

      <uc-data-output
        @data-output="handleUploaderEvent"
        fire-event
        :class="classList"
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
import "@uploadcare/upload-blocks";
import "@uploadcare/upload-blocks";
import "@uploadcare/upload-blocks/build/uc-basic.css";

export default {
  name: "Uploader",
  data() {
    return {
      classList: "uc-wgt-common uploader",
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
.output {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 100%;
  max-width: 1000px;
}
</style>
