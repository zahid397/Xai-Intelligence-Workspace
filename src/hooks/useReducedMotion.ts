'use client';

import { useEffect, useState } from 'react';
import { SETTINGS_STORAGE_KEY } from '@/lib/constants';

const QUERY = '(prefers-reduced-motion: reduce)';

function readUserSettingOverride(): boolean {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { reducedMotion?: boolean };
    return parsed.reducedMotion === true;
  } catch {
    return false;
  }
}

/**
 * Tracks the user's prefers-reduced-motion setting reactively (it can change
 * mid-session on some OSes), OR'd with the in-app "Reduced motion" toggle in
 * Settings — either one can turn animation off, so the Settings toggle is a
 * genuine accessibility control rather than a decorative switch, but it can
 * never override an OS-level accessibility preference to force MORE motion.
 * Every animated component reads this before running any Framer/GSAP/R3F
 * motion, and falls back to a static presentation when it's true.
 */
export function useReducedMotion(): boolean {
  const [osReduced, setOsReduced] = useState(false);
  const [settingReduced, setSettingReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setOsReduced(mediaQuery.matches);
    setSettingReduced(readUserSettingOverride());

    const handleChange = (event: MediaQueryListEvent) => setOsReduced(event.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Settings are saved from a different component tree (the dashboard),
    // so pick up changes via the storage event (fires in other tabs) and a
    // custom event (fires in this tab, since `storage` doesn't self-notify).
    function handleSettingsChange() {
      setSettingReduced(readUserSettingOverride());
    }
    window.addEventListener('storage', handleSettingsChange);
    window.addEventListener('xai-settings-changed', handleSettingsChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleSettingsChange);
      window.removeEventListener('xai-settings-changed', handleSettingsChange);
    };
  }, []);

  return osReduced || settingReduced;
}
