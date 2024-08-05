<script>
  import * as UC from '@uploadcare/file-uploader';
  import { onMount } from 'svelte';

  export let files = [];

  let ctxProviderRef;

  const handleChangeEvent = e => {
    console.log('change event payload:', e);

    if (e.detail) {
      files = e.detail.allEntries.filter(f => f.status === 'success');
    }
  };

  onMount(() => {
    UC.defineComponents(UC);

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/events/
     */
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
    ctx-name="my-uploader-3"
    pubkey="a6ca334c3520777c0045"
    sourceList="local, url, camera, dropbox"
  ></uc-config>

  <uc-file-uploader-regular
    ctx-name="my-uploader-3"
  ></uc-file-uploader-regular>

  <uc-upload-ctx-provider
    ctx-name="my-uploader-3"
    bind:this={ctxProviderRef}
  ></uc-upload-ctx-provider>

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
</style>

