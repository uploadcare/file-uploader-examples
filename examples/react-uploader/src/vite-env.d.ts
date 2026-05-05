/// <reference types="vite/client" />
/// <reference types="@uploadcare/file-uploader/types/jsx" />

/*
  Re-export the global JSX intrinsics declared by @uploadcare/file-uploader/types/jsx
  into React's `react-jsx` JSX namespace, which is what `jsx: react-jsx` resolves
  IntrinsicElements against in TS 5.x.

  We also widen `uc-icon` to accept the `name` attribute, which isn't reflected
  through `attributesMeta` in the upstream JSX types.
 */
import 'react';

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
