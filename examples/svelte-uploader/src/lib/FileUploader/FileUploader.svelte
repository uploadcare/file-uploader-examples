<script>
  import { onMount } from 'svelte';
  import * as UC from '@uploadcare/file-uploader';
  import { unsplashPlugin } from '$lib/Unsplash/unsplashPlugin.svelte.js';

  export let files = [];
  export let uploaderCtxName;
  export let theme;

  let uploadedFiles = [];
  let errors = [];

  let ctxProviderRef;
  let configRef;

  const resetUploaderState = () => {
    const api = ctxProviderRef.getAPI();
    api.setCurrentActivity(null);
    api.setModalState(false);
    api.removeAllFiles();
  };

  const handleRemoveClick = (uuid) => {
    files = files.filter((f) => f.uuid !== uuid);
  };

  // Keep only successful entries (committed on `modal-close`), and surface
  // any failed entries as user-facing errors.
  const handleChangeEvent = (e) => {
    if (!e.detail) return;
    uploadedFiles = e.detail.allEntries.filter((f) => f.status === 'success');
    errors = e.detail.allEntries
      .filter((f) => f.status === 'failed')
      .map((f) => ({
        name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
        message: f.errors?.[0]?.message ?? 'Upload failed',
      }));
  };

  const handleModalCloseEvent = (e) => {
    // A nested modal (e.g. the image editor) closing also fires this
    // event — bail out so we only commit when the whole flow ends.
    if (e.detail.hasActiveModals) return;

    const justUploaded = uploadedFiles;

    /*
      Only commit and reset when there is at least one successful
      upload. Otherwise (modal closed without finishing or with all
      uploads failed) we keep whatever in-progress / errored entries
      the uploader has so the user can retry on next open.
     */
    if (justUploaded.length === 0) return;

    /*
      Reset our local cache and write to `files` BEFORE calling
      `resetUploaderState()`. `removeAllFiles()` synchronously fires a
      `change` event with no entries — that handler would otherwise
      overwrite `uploadedFiles` with `[]` before we read it.
     */
    uploadedFiles = [];
    files = [...files, ...justUploaded];
    resetUploaderState();
  };

  onMount(() => {
    UC.defineComponents(UC);

    // Register custom Unsplash source plugin.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    configRef.plugins = [unsplashPlugin];
    configRef.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    // Listen to uploader events and keep local preview state in sync.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    ctxProviderRef.addEventListener('change', handleChangeEvent);
    ctxProviderRef.addEventListener('modal-close', handleModalCloseEvent);

    // Demo-specific wording for "photos".
    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    configRef.localeDefinitionOverride = {
      en: {
        file__one: 'photo',
        file__other: 'photos',

        'upload-file': 'Upload photo',
        'upload-files': 'Upload photos',
        'choose-file': 'Choose photo',
        'choose-files': 'Choose photos',
        'drop-files-here': 'Drop photos here',
        'select-file-source': 'Select photo source',
        'edit-image': 'Edit photo',
        'no-files': 'No photos selected',
        'caption-edit-file': 'Edit photo',
        'files-count-limit-error-too-many':
          'You\u2019ve chosen too many photos. {{max}} {{plural:file(max)}} is maximum.',
        'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
        'header-uploading': 'Uploading {{count}} {{plural:file(count)}}',
        'header-succeed': '{{count}} {{plural:file(count)}} uploaded',
        'header-total': '{{count}} {{plural:file(count)}} selected',
      },
    };

    return () => {
      ctxProviderRef.removeEventListener('change', handleChangeEvent);
      ctxProviderRef.removeEventListener('modal-close', handleModalCloseEvent);

      configRef.localeDefinitionOverride = null;
    };
  });
</script>

<div class="root">
  <uc-config
    bind:this={configRef}
    ctx-name={uploaderCtxName}
    pubkey="a6ca334c3520777c0045"
    multiple={true}
    sourceList="local, url, camera, dropbox, gdrive, unsplash"
    confirmUpload={false}
    removeCopyright={true}
    imgOnly={true}
  ></uc-config>

  <uc-file-uploader-regular
    ctx-name={uploaderCtxName}
    class="file-uploader"
    class:uc-dark={theme === 'dark'}
    class:uc-light={theme === 'light'}
  ></uc-file-uploader-regular>

  <uc-upload-ctx-provider bind:this={ctxProviderRef} ctx-name={uploaderCtxName}
  ></uc-upload-ctx-provider>

  {#if errors.length > 0}
    <div class="errors">
      {#each errors as err, i (i)}
        <p class="error" role="alert">{err.name}: {err.message}</p>
      {/each}
    </div>
  {/if}

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
          on:click={() => handleRemoveClick(file.uuid)}>×</button
        >
      </div>
    {/each}
  </div>
</div>

<style>
  /*
  CSS variables are used to customize the appearance of the file uploader.

  See more: https://uploadcare.com/docs/file-uploader/styling/
 */
  .file-uploader {
    --uc-primary-dark: var(--ui-action-button-background);
    --uc-primary-foreground-dark: var(--ui-action-button-text-color);
  }

  .previews {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    margin-top: 12px;
  }

  .errors {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .error {
    margin: 0;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    font-size: 13px;
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

    &:hover,
    &:focus {
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

  uc-file-uploader-regular :global(uc-simple-btn button) {
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

  uc-file-uploader-regular :global(uc-simple-btn uc-icon) {
    display: none;
  }

  uc-file-uploader-regular :global(uc-simple-btn button:hover),
  uc-file-uploader-regular :global(uc-simple-btn button:focus) {
    background: var(--ui-control-background-color);
    outline: 3px solid var(--ui-control-outline-color-focus);
  }

  uc-file-uploader-regular :global(uc-simple-btn button:active) {
    border-color: var(--ui-control-border-color-focus);
  }
</style>
