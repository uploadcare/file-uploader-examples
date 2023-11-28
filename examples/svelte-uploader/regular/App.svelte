<script>
  import * as LR from "@uploadcare/blocks";
  LR.registerBlocks(LR);
</script>
<main>
	<div>
    <!-- Uploadcare Uploader Configuration -->
    <lr-config
      ctx-name="my-uploader"
      pubkey="2b7f257e8ea0817ba746"
      sourceList="local, url, camera, dropbox"
    ></lr-config>

    <!-- Uploadcare Uploader -->
    <lr-file-uploader-regular
      css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.0/web/lr-file-uploader-regular.min.css"
      ctx-name="my-uploader"
    ></lr-file-uploader-regular>
  </div>
</main>
