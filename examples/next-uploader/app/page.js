'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Static export can't issue a server-side redirect, so use a tiny
// client-side redirect on mount. Next prepends basePath to the
// `/form` path automatically.
export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/form');
  }, [router]);

  return null;
}
