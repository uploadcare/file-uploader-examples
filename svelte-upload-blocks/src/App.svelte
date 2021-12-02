<script>
import '../upload-blocks/uc-basic.css';
import '../upload-blocks/upload-blocks.js';
	let files = []
	function handleUploaderEvent(e) {
		      const { data } = e.detail;
      files = data;

	}
</script>

<div class="wrapper">
    <div class="uploader">
      <uc-simple-btn class="uc-wgt-common"></uc-simple-btn>

      <uc-modal class="uc-wgt-common" strokes>
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

      <uc-message-box class="uc-wgt-common"></uc-message-box>
      <uc-progress-bar class="uc-wgt-common"></uc-progress-bar>

      <uc-data-output
        fire-event
        class="uc-wgt-common"
				on:data-output={handleUploaderEvent}
      ></uc-data-output>
    </div>
    <div class="output">
			{#each files as file}
      <img
        src="https://ucarecdn.com/{file.uuid}/-/preview/-/scale_crop/400x400/"
        width="200"
      />
			{/each}
    </div>
</div>

<style>
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
