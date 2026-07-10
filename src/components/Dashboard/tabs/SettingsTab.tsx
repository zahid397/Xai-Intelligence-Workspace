'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Switch } from '@/components/UI/Switch';
import { ActionButton } from '@/components/UI/ActionButton';
import { useToast } from '@/components/UI/Toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SETTINGS_STORAGE_KEY } from '@/lib/constants';
import * as mockApi from '@/lib/mockApi';
import type { SettingsState } from '@/types';

export function SettingsTab({ initialSettings }: { initialSettings: SettingsState }) {
  const [stored, setStored] = useLocalStorage<SettingsState>(SETTINGS_STORAGE_KEY, initialSettings);
  const [draft, setDraft] = useState<SettingsState>(stored);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const saved = await mockApi.updateSettings(draft);
    setStored(saved);
    // useLocalStorage writes on its own effect, but that only notifies other
    // tabs (the browser `storage` event doesn't fire in the tab that wrote
    // it) — dispatch this so useReducedMotion picks up the change immediately
    // here too, without a refresh.
    window.dispatchEvent(new Event('xai-settings-changed'));
    setSaving(false);
    showToast('Settings saved', 'success');
  }

  return (
    <div className="glass max-w-xl rounded-2xl p-5">
      <h2 className="mb-1 text-sm font-semibold text-ink-200">Settings</h2>
      <p className="mb-2 text-xs text-ink-500">Preferences are saved to this browser.</p>

      <div className="divide-y divide-white/5">
        <Switch
          label="Email notifications"
          description="Get notified when a new insight is generated."
          checked={draft.emailNotifications}
          onChange={(value) => update('emailNotifications', value)}
        />
        <Switch
          label="Auto-sync"
          description="Keep connected data sources syncing automatically."
          checked={draft.autoSync}
          onChange={(value) => update('autoSync', value)}
        />
        <Switch
          label="AI recommendations"
          description="Let Xai suggest automations based on your insights."
          checked={draft.aiRecommendations}
          onChange={(value) => update('aiRecommendations', value)}
        />
        <Switch
          label="Reduced motion"
          description="Turn off animation across the whole workspace."
          checked={draft.reducedMotion}
          onChange={(value) => update('reducedMotion', value)}
        />
      </div>

      <ActionButton variant="primary" className="mt-5" onClick={handleSave} loading={saving}>
        <Save className="h-3.5 w-3.5" />
        Save settings
      </ActionButton>
    </div>
  );
}
