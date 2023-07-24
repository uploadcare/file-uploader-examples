<script>
  import * as LR from "@uploadcare/blocks";
  import { PACKAGE_VERSION } from "@uploadcare/blocks";

  LR.registerBlocks(LR);

  let files = [];
  function handleUploaderEvent(e) {
    const { data } = e.detail;
    files = data;
  }
</script>

<div class="wrapper">
  <lr-config
    ctx-name="my-uploader"
    pubkey="demopublickey"
    multiple="true"
    multipleMax="10"
    confirmUpload="true"
    sourceList="local, url, camera, dropbox, gdrive"
  />
  <lr-file-uploader-regular
    ctx-name="my-uploader"
    css-src="https://unpkg.com/@uploadcare/blocks@{PACKAGE_VERSION}/web/file-uploader-regular.min.css"
  />
  <lr-data-output
    ctx-name="my-uploader"
    use-event
    hidden
    class="uploader-cfg"
    on:lr-data-output={handleUploaderEvent}
  />
  <div class="output">
    {#each files as file}
      <img
        src="https://ucarecdn.com/{file.uuid}/{file.cdnUrlModifiers ||
          ''}-/preview/-/scale_crop/400x400/"
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
</style>
