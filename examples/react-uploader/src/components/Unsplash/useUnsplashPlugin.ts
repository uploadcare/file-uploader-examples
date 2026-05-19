import type * as UC from '@uploadcare/file-uploader';
import { useEffect, useRef } from 'react';

import { unsplashPlugin } from './unsplashPlugin';

/*
  Returns a ref to attach to a `<uc-config>` element. Once mounted, the
  custom Unsplash plugin is registered on the config and the access key
  is pushed in from VITE_UNSPLASH_ACCESS_KEY.

  Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
 */
export function useUnsplashPlugin() {
  const ref = useRef<UC.Config & { unsplashAccessKey?: string }>(null);

  useEffect(() => {
    const config = ref.current;
    if (!config) return;

    config.plugins = [unsplashPlugin];
    config.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  }, []);

  return ref;
}
