<script>
  import * as UC from '@uploadcare/file-uploader';
  import { onMount } from 'svelte';
  import { unsplashPlugin } from '$lib/Unsplash/unsplashPlugin.svelte.js';

  export let files = [];
  let errors = [];

  let ctxProviderRef;
  let configRef;

  // Listen for upload-collection updates. The `change` event delivers the
  // full collection on every transition, so we re-derive both successful
  // and failed entries on each call.
  // Events docs: https://uploadcare.com/docs/file-uploader/events/
  const handleChangeEvent = (e) => {
    if (!e.detail) return;
    files = e.detail.allEntries.filter((f) => f.status === 'success');
    errors = e.detail.allEntries
      .filter((f) => f.status === 'failed')
      .map((f) => ({
        name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
        message: f.errors?.[0]?.message ?? 'Upload failed',
      }));
  };

  onMount(() => {
    UC.defineComponents(UC);

    // Register custom Unsplash source plugin on the config element.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    configRef.plugins = [unsplashPlugin];
    configRef.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    ctxProviderRef.addEventListener('change', handleChangeEvent);

    return () => {
      ctxProviderRef.removeEventListener('change', handleChangeEvent);
    };
  });
  function formatSize(bytes) {
    if (!bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }
</script>

<div>
  <uc-config
    bind:this={configRef}
    ctx-name="my-uploader-3"
    pubkey="a6ca334c3520777c0045"
    sourceList="local, url, camera, dropbox, unsplash"
  ></uc-config>

  <uc-file-uploader-regular ctx-name="my-uploader-3"></uc-file-uploader-regular>

  <uc-upload-ctx-provider ctx-name="my-uploader-3" bind:this={ctxProviderRef}
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
      <div class="preview-wrapper">
        <img
          class="preview-image"
          src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
          width="200"
          height="200"
          alt={file.fileInfo.originalFilename}
          title={file.fileInfo.originalFilename}
        />

        <p class="preview-data">
          {file.fileInfo.originalFilename}
        </p>
        <p class="preview-data">
          {formatSize(file.fileInfo.size)}
        </p>
      </div>
    {/each}
  </div>
</div>

<style>
  .previews {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    margin-top: 20px;
  }

  .preview-wrapper {
    background-color: white;
    color: darkslategray;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .preview-image {
    display: block;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .preview-data {
    font-size: 13px;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .errors {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  .error {
    margin: 0;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    font-size: 13px;
  }
</style>
