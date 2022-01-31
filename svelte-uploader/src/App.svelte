<script>
  import "@uploadcare/uploader/build/regular/uc-uploader.css";
  import "@uploadcare/uploader/build/regular/uc-uploader.min.js";

  let files = [];
  function handleUploaderEvent(e) {
    const { data } = e.detail;
    files = data;
  }
</script>

<div class="wrapper">
  <uc-uploader class="uploader-cfg uc-wgt-common" />

  <uc-data-output
    fire-event
    class="uploader-cfg uc-wgt-common"
    on:data-output={handleUploaderEvent}
  />
  <div class="output">
    {#each files as file}
      <img
        src="https://ucarecdn.com/{file.uuid}/-/preview/-/scale_crop/400x400/"
        width="200"
        alt="Uploadcare uploaded file"
      />
    {/each}
  </div>
</div>

<style>
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
    --cfg-pubkey: "demopublickey";
    --cfg-multiple: 1;
    --cfg-confirm-upload: 1;
    --cfg-img-only: 0;
    --cfg-accept: "";
    --cfg-store: 1;
    --cfg-camera-mirror: 0;
    --cfg-source-list: "local, url, camera, draw, dropbox, gdrive";
    --cfg-max-files: 10;
  }
</style>
