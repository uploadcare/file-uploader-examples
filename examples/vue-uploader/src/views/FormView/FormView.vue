<script>
import sunImage from '../../assets/sun.png';
import moonImage from '../../assets/moon.png';

import FileUploader from '../../components/FileUploader/FileUploader.options.vue';

import MOCK_DATA from './mocks';

export default {
  components: {
    FileUploader,
  },

  data() {
    return {
      title: MOCK_DATA.title,
      text: MOCK_DATA.text,
      photos: MOCK_DATA.photos,

      sentFormObject: null,

      theme: document.body.classList.contains('theme--dark') ? 'dark' : 'light',

      sunImage,
      moonImage,
    }
  },

  methods: {
    handleFormSubmit() {
      this.sentFormObject = {
        title: this.title,
        text: this.text,
        photos: this.photos,
      };
    },
  },

  watch: {
    theme: {
      handler() {
        document.body.classList.remove('theme--light');
        document.body.classList.remove('theme--dark');
        document.body.classList.add(`theme--${this.theme}`);
      },
      immediate: true,
    }
  },
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="view-title">New blog post</h1>

      <label class="theme-toggle">
        <input
          type="checkbox"
          v-model="theme"
          true-value="light"
          false-value="dark"
        />
        <img
          :src="theme === 'light' ? sunImage : moonImage"
          width="18"
          height="18"
          :alt="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
        />
      </label>
    </header>

    <form
      class="form"
      v-if="!sentFormObject"
      @submit.prevent="handleFormSubmit"
    >
      <div class="field">
        <label class="label" for="title">Title</label>
        <input
          class="input"
          type="text"
          id="title"
          v-model="title"
        />
      </div>

      <div class="field">
        <label class="label" for="text">Text</label>
        <textarea
          class="input"
          id="text"
          rows="10"
          v-model="text"
        ></textarea>
      </div>

      <div class="field">
        <p class="label">Photos</p>
        <FileUploader
          uploader-class-name="file-uploader"
          v-model:files="photos"
          :theme="theme"
        />
      </div>

      <div class="field">
        <button class="button" type="submit">Publish</button>
      </div>
    </form>

    <pre
      class="result"
      v-if="!!sentFormObject"
    ><code>{{ JSON.stringify(sentFormObject, null, 2) }}</code></pre>
  </div>
</template>

<style scoped lang="scss">
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

  img {
    display: block;
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
