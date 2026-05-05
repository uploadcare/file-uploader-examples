import { ApplicationRef, EnvironmentInjector, createComponent } from '@angular/core';
import type { UploaderPlugin } from '@uploadcare/file-uploader';

import { UnsplashGalleryComponent } from './unsplash-gallery.component';

declare module '@uploadcare/file-uploader' {
  interface CustomConfig {
    unsplashAccessKey: string;
  }
  interface CustomActivities {
    unsplash: { params: never };
  }
}

const UNSPLASH_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" fill-rule="evenodd" d="M15 4.5H9v4h6v-4ZM4 10.5h5v4h6v-4h5v9H4v-9Z" />
  </svg>
`;

export function createUnsplashPlugin(
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
): UploaderPlugin {
  return {
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
          const componentRef = createComponent(UnsplashGalleryComponent, {
            environmentInjector: injector,
          });

          componentRef.setInput('uploaderApi', uploaderApi);

          const unsubscribe = pluginApi.config.subscribe('unsplashAccessKey', (value) => {
            componentRef.setInput('accessKey', value ?? '');
          });

          appRef.attachView(componentRef.hostView);
          host.appendChild(componentRef.location.nativeElement);

          return () => {
            unsubscribe();
            appRef.detachView(componentRef.hostView);
            componentRef.destroy();
          };
        },
      });
    },
  };
}
