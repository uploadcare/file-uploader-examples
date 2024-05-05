<script>
  import { browser } from '$app/environment';

  import sunImage from '../../assets/sun.png';
  import moonImage from '../../assets/moon.png';

  import FileUploader from '$lib/FileUploader/FileUploader.svelte';

  import MOCK_DATA from './mocks';

  let title = MOCK_DATA.title;
  let text = MOCK_DATA.text;
  let photos = MOCK_DATA.photos;

  let sentFormObject = null;

  const handleFormSubmit = e => {
    e.preventDefault();
    sentFormObject = {
      title,
      text,
      photos,
    };
  }

  let theme = 'light';

  $: {
    if (browser) {
      theme = document.body.classList.contains('theme--dark') ? 'dark' : 'light';
    }
  }

  const handleThemeChange = e => {
    theme = e.target.checked ? 'light' : 'dark';
  }

  $: {
    if (browser) {
      document.body.classList.remove('theme--light');
      document.body.classList.remove('theme--dark');
      document.body.classList.add(`theme--${theme}`);
    }
  }
</script>

<div class="app">
  <header class="header">
    <h1 class="view-title">New blog post</h1>

    <label class="theme-toggle">
      <input
        type="checkbox"
        checked={theme === 'light'}
        on:change={handleThemeChange}
      >
      <img
        src={theme === 'light' ? sunImage : moonImage}
        width="18"
        height="18"
        alt={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      />
    </label>
  </header>

  {#if !sentFormObject}
    <form class="form" on:submit={handleFormSubmit}>
      <div class="field">
        <label class="label" for="title">Title</label>
        <input
          class="input"
          type="text"
          id="title"
          bind:value={title}
        />
      </div>

      <div class="field">
        <label class="label" for="text">Text</label>
        <textarea
          class="input"
          id="text"
          rows={10}
          bind:value={text}
        ></textarea>
      </div>

      <div class="field">
        <p class="label">Photos</p>
        <FileUploader
          uploaderClassName="file-uploader"
          bind:files={photos}
          theme={theme}
        />
      </div>

      <div class="field">
        <button class="button" type="submit">Publish</button>
      </div>
    </form>
  {:else}
    <pre class="result"><code>{JSON.stringify(sentFormObject, null, 2)}</code></pre>
  {/if}
</div>

<style lang="scss">
  .app {
    padding: 16px 24px;
    max-width: 480px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 48px;
    display: flex;
    justify-content: space-between;
  }

  .theme-toggle {
    padding: 6px;
    box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
    background-color: var(--ui-control-background-color);
    border: 1px solid var(--ui-control-border-color-default);
    border-radius: 100%;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: var(--ui-control-background-color);
      border: 1px solid var(--ui-control-border-color-default);
      outline: 2px solid var(--ui-control-outline-color-focus);
    }

    input {
      display: none;
    }
  }

  .view-title {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    color: var(--ui-text-color);
  }

  .input {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 12px;
    font-family: monospace;
    font-size: 16px;
    border: 1px solid var(--ui-control-border-color-default);
    border-radius: 8px;
    background: var(--ui-control-background-color);
    box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
    color: var(--ui-control-text-color);

    &:focus {
      outline: 3px solid var(--ui-control-outline-color-focus);
      border-color: var(--ui-control-border-color-focus);
    }

    // trying to prevent scrollbar overflowing textarea borders =/
    &::-webkit-scrollbar-corner {
      display: none;
    }
  }

  .field {
    margin-top: 24px;

    &:last-child {
      margin-top: 48px;
    }
  }

  .label {
    position: relative;
    z-index: 1;
    display: block;
    margin-bottom: 8px;
    color: var(--ui-text-color);
  }

  .button {
    font-size: 16px;
    font-family: monospace;
    line-height: 1;
    padding: 10px 12px;
    border: 1px solid var(--ui-control-border-color-default);
    border-radius: 8px;
    box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
    background: var(--ui-action-button-background);
    color: var(--ui-action-button-text-color);
    cursor: pointer;

    &:hover, &:focus {
      outline: 3px solid var(--ui-control-outline-color-focus);
    }

    &:active {
      border-color: var(--ui-control-border-color-focus);
    }
  }

  .result {
    font-size: 14px;
    line-height: 18px;
    font-family: monospace;
    white-space: pre-wrap;
  }
</style>
