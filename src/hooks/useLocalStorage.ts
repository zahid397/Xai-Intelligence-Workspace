'use client';

import { useEffect, useState } from 'react';

/**
 * useState backed by localStorage. Reads lazily on mount (SSR-safe — the
 * initial render always uses `initialValue` so server and first client
 * render match, then syncs from localStorage in an effect) and writes on
 * every change.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      // Corrupt or inaccessible storage — fall back to initialValue silently.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private browsing, quota) — degrade silently.
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}
