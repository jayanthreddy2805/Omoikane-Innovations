"use client";
import { useCallback, useSyncExternalStore } from 'react';
const serverSnapshot = () => false;
export default function useMediaQuery(query) {
  const subscribe = useCallback(notify => {
    const media = window.matchMedia(query);
    media.addEventListener('change', notify);
    return () => media.removeEventListener('change', notify);
  }, [query]);
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
