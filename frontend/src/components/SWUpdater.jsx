'use client';

import { useEffect } from 'react';

export default function SWUpdater() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const interval = setInterval(() => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
            console.log('🌀 Verificação de update do SW executada');
          }
        });
      }, 1000 * 60 * 60 * 2); // 2 horas

      return () => clearInterval(interval);
    }
  }, []);

  return null;
}
