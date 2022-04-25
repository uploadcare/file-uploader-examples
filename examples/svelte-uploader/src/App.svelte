<script>
  /*
   * Use minified version because codesandbox can't bundle raw css with relative imports.
   * It's better to use '@uploadcare/uc-blocks/blocks/themes/uc-basic/index.css' instead
   */
  import "@uploadcare/uc-blocks/web/uc-basic.min.css";
  import * as UC from "@uploadcare/uc-blocks";

  UC.registerBlocks(UC);

  let files = [];
  function handleUploaderEvent(e) {
    const { data } = e.detail;
    files = data;
  }
</script>

<div class="wrapper">
  <uc-file-uploader-regular class="uploader-cfg uc-wgt-common" />

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
    --ctx-name: "uploader";

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
