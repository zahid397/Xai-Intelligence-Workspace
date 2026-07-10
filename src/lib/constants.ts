// Shared across useLocalStorage consumers so the key can't drift between
// where settings are written (SettingsTab) and where they're read
// (useReducedMotion, which needs to know the user's in-app override).
export const SETTINGS_STORAGE_KEY = 'xai-settings';
