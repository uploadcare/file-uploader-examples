import { createApp, h, ref } from 'vue';

import UnsplashGallery from './UnsplashGallery.vue';

const UNSPLASH_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" fill-rule="evenodd" d="M15 4.5H9v4h6v-4ZM4 10.5h5v4h6v-4h5v9H4v-9Z" />
  </svg>
`;

export const unsplashPlugin = {
  id: 'unsplash',
  setup({ pluginApi, uploaderApi }) {
    pluginApi.registry.registerConfig({
      name: 'unsplashAccessKey',
      defaultValue: '',
    });

    pluginApi.registry.registerIcon({ name: 'unsplash', svg: UNSPLASH_ICON_SVG });

    pluginApi.registry.registerL10n({
      en: { 'src-type-unsplash': 'Unsplash' },
    });

    pluginApi.registry.registerSource({
      id: 'unsplash',
      label: 'src-type-unsplash',
      icon: 'unsplash',
      onSelect: () => {
        uploaderApi.setCurrentActivity('unsplash');
        uploaderApi.setModalState(true);
      },
    });

    pluginApi.registry.registerActivity({
      id: 'unsplash',
      render(host) {
        const accessKey = ref(pluginApi.config.get('unsplashAccessKey') ?? '');

        const app = createApp({
          render: () =>
            h(UnsplashGallery, {
              uploaderApi,
              accessKey: accessKey.value,
            }),
        });

        const unsubscribe = pluginApi.config.subscribe('unsplashAccessKey', (value) => {
          accessKey.value = value ?? '';
        });

        app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('uc-');

        app.mount(host);

        return () => {
          unsubscribe();
          app.unmount();
        };
      },
    });
  },
};
