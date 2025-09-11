// src/components/ServiceWorkerRegistrar.tsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    // don’t even try to register in dev mode
    if (process.env.NODE_ENV !== 'production') {
      // and if one slipped in earlier, unregister it
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) =>
          regs.forEach((reg) => reg.unregister())
        );
      }
      return;
    }

    // in production, go ahead and register
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ ServiceWorker registration failed:', error);
        });
    }
  }, []);

  return null;
}
