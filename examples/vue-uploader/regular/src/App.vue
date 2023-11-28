<script setup lang="ts">
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);
</script>

<template>
  <div>
    <!-- Uploadcare Uploader Configuration -->
    <lr-config
      ctx-name="my-uploader"
      pubkey="demopublickey"
      sourceList="local, url, camera, dropbox"
    ></lr-config>

    <!-- Uploadcare Uploader -->
    <lr-file-uploader-regular
      css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.0/web/lr-file-uploader-regular.min.css"
      ctx-name="my-uploader"
    ></lr-file-uploader-regular>
  </div>
</template>
