<script>
  import { onMount } from 'svelte';
  import * as LR from '@uploadcare/blocks';
  import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

  import cssOverrides from './FileUploader.overrides.css?inline';

  export let files = [];
  export let uploaderClassName;
  export let theme;

  /*
    Note: File Uploader styles are scoped due to ShadowDOM usage.
    There are two ways to override them. One way is used on the line below,
    another one is to set a custom class to File Uploader,
    and use CSS variables to update styles.

    See more: https://uploadcare.com/docs/file-uploader/styling/
   */
  LR.FileUploaderRegular.shadowStyles = cssOverrides;

  LR.registerBlocks(LR);

  let uploadedFiles = [];

  let ctxProviderRef;

  /*
    Note: Here we use provider's API to reset File Uploader state.
    It's not necessary though. We use it here to show users
    a fresh version of File Uploader every time they open it.

    Another way is to sync File Uploader state with an external store.
    You can manipulate File Uploader using API calls like `addFileFromObject`, etc.

    See more: https://uploadcare.com/docs/file-uploader/api/
   */
  const resetUploaderState = () => ctxProviderRef.uploadCollection.clearAll();

  const handleRemoveClick = uuid => {
    files = files.filter(f => f.uuid !== uuid);
  };

  const handleUploadEvent = e => {
    if (e.detail?.data) {
      uploadedFiles = e.detail.data;
    }
  };

  const handleDoneFlow = () => {
    resetUploaderState();

    files = [...files, ...uploadedFiles];
    uploadedFiles = [];
  };

  onMount(() => {
    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/data-and-events/#events
     */
    window.addEventListener('LR_DATA_OUTPUT', handleUploadEvent);
    window.addEventListener('LR_DONE_FLOW', handleDoneFlow);

    return () => {
      window.removeEventListener('LR_DATA_OUTPUT', handleUploadEvent);
      window.removeEventListener('LR_DONE_FLOW', handleDoneFlow);
    };
  });
</script>

<div class="root">
  <!--
    Note: `lr-config` is the main block we use to configure File Uploader.
    It's important to all the context-related blocks to have the same `ctx-name` attribute.

    See more: https://uploadcare.com/docs/file-uploader/configuration/
    Available options: https://uploadcare.com/docs/file-uploader/options/

    Also note: Some options currently are not available via `lr-config`,
    but may be set via CSS properties. E.g. `darkmode`.

    Here they are: https://github.com/uploadcare/blocks/blob/main/blocks/themes/lr-basic/config.css
  -->
  <lr-config
    ctx-name="my-uploader"
    pubkey="demopublickey"
    multiple={true}
    sourceList="local, url, camera, dropbox, gdrive"
    confirmUpload={false}
    removeCopyright={true}
    imgOnly={true}
  ></lr-config>

  <lr-file-uploader-regular
    ctx-name="my-uploader"
    css-src={blocksStyles}
    class={uploaderClassName}
    class:dark-mode-enabled={theme === 'dark'}
  ></lr-file-uploader-regular>

  <lr-upload-ctx-provider
    ctx-name="my-uploader"
    bind:this={ctxProviderRef}
  ></lr-upload-ctx-provider>

  <div class="previews">
    {#each files as file (file.cdnUrl)}
      <div class="preview">
        <img
          class="preview-image"
          src={`${file.cdnUrl}/-/preview/-/resize/x200/`}
          width="100"
          alt={file.originalFilename}
          title={file.originalFilename}
        />

        <button
          class="preview-remove-button"
          type="button"
          on:click={() => handleRemoveClick(file.uuid)}
        >×</button>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .previews {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    margin-top: 12px;
  }

  /*
    Note: We set this class manually when we want File Uploader to join the dark side.
    The main option here is `darkmore`. The rest ones are used to tune the theme to match the website.

    See more: https://uploadcare.com/docs/file-uploader/styling/#base-values
   */
  .dark-mode-enabled {
    --darkmode: 1;

    --h-accent: 33.3;
    --s-accent: 100%;
    --l-accent: 60.78%;

    --clr-btn-bgr-primary: var(--ui-action-button-background);
    --clr-btn-txt-primary: var(--ui-action-button-text-color);
  }

  .preview {
    position: relative;
  }

  .preview-remove-button {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 18px;
    height: 18px;
    padding: 0;
    font-size: 16px;
    line-height: 1;
    font-family: monospace;
    border: 1px solid var(--ui-control-border-color-default);
    border-radius: 8px;
    background: var(--ui-control-background-color);
    box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
    color: var(--ui-control-text-color);
    cursor: pointer;

    &:hover, &:focus {
      background: var(--ui-control-background-color);
      outline: 1px solid var(--ui-control-outline-color-focus);
    }
  }

  .preview-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
  }
</style>
