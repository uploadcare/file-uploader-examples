<script>
  import { onMount } from 'svelte';
  import * as LR from '@uploadcare/blocks';

  export let files = [];
  export let uploaderClassName;
  export let uploaderCtxName;
  export let theme;

  let uploadedFiles = [];

  let ctxProviderRef;
  let configRef;

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

  const handleChangeEvent = e => {
    if (e.detail) {
      uploadedFiles = e.detail.allEntries.filter(f => f.status === 'success');
    }
  };

  const handleModalCloseEvent = () => {
    resetUploaderState();

    files = [...files, ...uploadedFiles];
    uploadedFiles = [];
  };

  onMount(() => {
    LR.registerBlocks(LR);

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/events/
     */
    ctxProviderRef.addEventListener('change', handleChangeEvent);
    ctxProviderRef.addEventListener('modal-close', handleModalCloseEvent);

    /*
     Note: Localization of File Uploader is done via DOM property on the config node.
     You can change any piece of text of File Uploader this way.

     See more: https://uploadcare.com/docs/file-uploader/localization/
    */
    configRef.localeDefinitionOverride = {
      en: {
        'photo__one': 'photo',
        'photo__many': 'photos',
        'photo__other': 'photos',

        'upload-file': 'Upload photo',
        'upload-files': 'Upload photos',
        'choose-file': 'Choose photo',
        'choose-files': 'Choose photos',
        'drop-files-here': 'Drop photos here',
        'select-file-source': 'Select photo source',
        'edit-image': 'Edit photo',
        'no-files': 'No photos selected',
        'caption-edit-file': 'Edit photo',
        'files-count-allowed': 'Only {{count}} {{plural:photo(count)}} allowed',
        'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
        'header-uploading': 'Uploading {{count}} {{plural:photo(count)}}',
        'header-succeed': '{{count}} {{plural:photo(count)}} uploaded',
        'header-total': '{{count}} {{plural:photo(count)}} selected',
      }
    }

    return () => {
      ctxProviderRef.removeEventListener('change', handleChangeEvent);
      ctxProviderRef.removeEventListener('modal-close', handleModalCloseEvent);

      configRef.localeDefinitionOverride = null;
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
    bind:this={configRef}
    ctx-name={uploaderCtxName}
    pubkey="a6ca334c3520777c0045"
    multiple={true}
    sourceList="local, url, camera, dropbox, gdrive"
    confirmUpload={false}
    removeCopyright={true}
    imgOnly={true}
  ></lr-config>

  <lr-file-uploader-regular
    ctx-name={uploaderCtxName}
    class={uploaderClassName}
    class:dark-mode-enabled={theme === 'dark'}
  ></lr-file-uploader-regular>

  <lr-upload-ctx-provider
    bind:this={ctxProviderRef}
    ctx-name={uploaderCtxName}
  ></lr-upload-ctx-provider>

  <div class="previews">
    {#each files as file (file.cdnUrl)}
      <div class="preview">
        <img
          class="preview-image"
          src={`${file.cdnUrl}/-/preview/-/resize/x200/`}
          width="100"
          alt={file.fileInfo.originalFilename}
          title={file.fileInfo.originalFilename}
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

  lr-file-uploader-regular :global(lr-simple-btn button) {
    height: auto;
    padding: 10px 12px !important;
    font-family: monospace;
    line-height: 1;
    font-size: 16px;
    border: 1px solid var(--ui-control-border-color-default);
    border-radius: 8px;
    background: var(--ui-control-background-color);
    box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
    color: var(--ui-control-text-color);
  }

  lr-file-uploader-regular :global(lr-simple-btn lr-icon) {
    display: none;
  }

  lr-file-uploader-regular :global(lr-simple-btn button:hover),
  lr-file-uploader-regular :global(lr-simple-btn button:focus) {
    background: var(--ui-control-background-color);
    outline: 3px solid var(--ui-control-outline-color-focus);
  }

  lr-file-uploader-regular :global(lr-simple-btn button:active) {
    border-color: var(--ui-control-border-color-focus);
  }
</style>
