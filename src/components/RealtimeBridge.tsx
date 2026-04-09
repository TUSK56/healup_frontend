'use client';

import { useEffect } from 'react';
import { authService } from '@/services/authService';
import { connectRealtime, disconnectRealtime } from '@/services/realtimeService';

export default function RealtimeBridge() {
  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    connectRealtime(token, (notification) => {
      if (typeof window === 'undefined') return;
      window.dispatchEvent(new CustomEvent('healup:notification', { detail: notification }));
    }).catch(() => {
      // Keep UI usable even if realtime connection fails.
    });

    return () => {
      disconnectRealtime().catch(() => {
        // Ignore shutdown errors during route transitions.
      });
    };
  }, []);

  return null;
}
