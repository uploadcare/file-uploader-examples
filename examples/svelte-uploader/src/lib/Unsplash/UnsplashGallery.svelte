<script>
  import { onMount, onDestroy } from 'svelte';
  import { searchUnsplash } from './unsplashApi.js';

  export let uploaderApi;
  export let accessKey = '';

  let items = [];
  let status = 'Loading…';
  let query = '';
  let controller = null;
  let lastAccessKey = accessKey;

  $: if (accessKey !== lastAccessKey) {
    lastAccessKey = accessKey;
    load(query);
  }

  async function load(q = '') {
    controller?.abort();
    controller = new AbortController();
    status = 'Loading…';
    items = [];

    try {
      const results = await searchUnsplash(q, accessKey, controller.signal);
      items = results;
      status = results.length === 0 ? 'No results' : '';
    } catch (err) {
      if (err?.name === 'AbortError') return;
      status = err?.message ?? 'Error';
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    const input = event.target.elements.query;
    query = input.value.trim();
    load(query);
  }

  function onPick(item) {
    uploaderApi.addFileFromUrl(item.fullUrl, {
      fileName: `unsplash-${item.id}.jpg`,
      source: 'unsplash',
    });
    uploaderApi.setCurrentActivity('upload-list');
    uploaderApi.setModalState(true);
  }

  function onBack() {
    uploaderApi.historyBack();
  }

  function onClose() {
    uploaderApi.setModalState(false);
  }

  onMount(() => {
    load();
  });

  onDestroy(() => {
    controller?.abort();
  });
</script>

<div class="uc-ui-activity-header">
  <button type="button" class="uc-ui-icon-btn" title="Back" aria-label="Back" on:click={onBack}>
    <uc-icon name="back"></uc-icon>
  </button>
  <div>
    <uc-icon name="unsplash"></uc-icon>
    <span>Unsplash</span>
  </div>
  <button type="button" class="uc-ui-icon-btn" title="Close" aria-label="Close" on:click={onClose}>
    <uc-icon name="close"></uc-icon>
  </button>
</div>

<div class="unsplash-body">
  <form class="uc-ui-toolbar unsplash-search" on:submit={onSubmit}>
    <input type="search" name="query" placeholder="Search Unsplash" autocomplete="off" />
    <button type="submit" class="uc-ui-primary-btn">Search</button>
  </form>

  <div class="unsplash-status">{status}</div>

  <div class="unsplash-grid">
    {#each items as item (item.id)}
      <button
        type="button"
        class="unsplash-item"
        title={`${item.description} — by ${item.author}`}
        on:click={() => onPick(item)}
      >
        <img
          src={item.thumbUrl}
          alt={item.description}
          width={item.width}
          height={item.height}
          loading="lazy"
        />
        <span class="unsplash-author">{item.author}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .unsplash-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    color: var(--uc-foreground);
  }

  /*
    Search row uses the uploader's `.uc-ui-toolbar` utility for layout,
    gap, padding and background; submit button is `.uc-ui-primary-btn`.
   */
  .unsplash-search input[type='search'] {
    flex: 1;
    min-width: 0;
    height: var(--uc-button-size);
    padding: 0 calc(var(--uc-padding) - 2px);
    border: 1px solid var(--uc-border);
    border-radius: var(--uc-radius);
    background: var(--uc-background);
    color: var(--uc-foreground);
    font: inherit;
    outline: none;
  }

  .unsplash-search input[type='search']:focus-visible {
    border-color: var(--uc-primary);
  }

  .unsplash-status {
    padding: 0 var(--uc-padding);
    min-height: 1em;
    color: var(--uc-muted-foreground);
    font-size: var(--uc-font-size);
  }

  .unsplash-grid {
    columns: 140px auto;
    column-gap: var(--uc-grid-gap, 8px);
    padding: 0 var(--uc-padding) var(--uc-padding);
    overflow-y: auto;
    min-height: 0;
  }

  .unsplash-item {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    margin: 0 0 var(--uc-grid-gap, 8px);
    padding: 0;
    border: 0;
    background: var(--uc-secondary);
    border-radius: var(--uc-radius);
    overflow: hidden;
    cursor: pointer;
    break-inside: avoid;
    transform: translateZ(0);
    transition:
      transform var(--uc-transition),
      box-shadow var(--uc-transition);
  }

  .unsplash-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform var(--uc-transition);
  }

  .unsplash-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--uc-dialog-shadow);
  }

  .unsplash-item:hover img {
    transform: scale(1.04);
  }

  .unsplash-item:focus-visible {
    outline: 2px solid var(--uc-primary);
    outline-offset: 2px;
  }

  .unsplash-author {
    position: absolute;
    inset: auto 0 0 0;
    padding: calc(var(--uc-padding) * 1.6) calc(var(--uc-padding) - 2px)
      calc(var(--uc-padding) - 2px);
    font-size: calc(var(--uc-font-size) - 2px);
    font-weight: 500;
    color: var(--uc-primary-foreground);
    text-align: left;
    background: linear-gradient(to top, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0));
    opacity: 0;
    transition: opacity var(--uc-transition);
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .unsplash-item:hover .unsplash-author,
  .unsplash-item:focus-visible .unsplash-author {
    opacity: 1;
  }
</style>
