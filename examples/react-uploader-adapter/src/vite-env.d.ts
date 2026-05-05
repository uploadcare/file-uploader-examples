/// <reference types="vite/client" />
/// <reference types="@uploadcare/file-uploader/types/jsx" />

import 'react';

declare module '@uploadcare/file-uploader' {
  interface CustomConfig {
    unsplashAccessKey: string;
  }
  interface CustomActivities {
    unsplash: { params: never };
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {
      'uc-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { name?: string },
        HTMLElement
      >;
    }
  }
}
