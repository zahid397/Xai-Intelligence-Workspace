'use client';

import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { ActionButton } from '@/components/UI/ActionButton';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { EmptyState } from '@/components/UI/EmptyState';
import { useToast } from '@/components/UI/Toast';
import * as mockApi from '@/lib/mockApi';
import type { ConnectedDataSource } from '@/types';
import { ConnectSourceModal } from './ConnectSourceModal';

export function DataSourcesTab({ initialSources }: { initialSources: ConnectedDataSource[] }) {
  const [sources, setSources] = useState(initialSources);
  const [modalOpen, setModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleConnect(name: string) {
    const newSource = await mockApi.connectDataSource(name);
    setSources((current) => [newSource, ...current]);
    showToast(`${name} connected`, 'success');
  }

  async function handleSync(id: string, name: string) {
    setSyncingId(id);
    const updated = await mockApi.syncDataSource(id);
    if (updated) {
      setSources((current) => current.map((s) => (s.id === id ? updated : s)));
    }
    setSyncingId(null);
    showToast(`${name} synced successfully`, 'success');
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink-200">Data Sources</h2>
          <p className="mt-0.5 text-xs text-ink-500">{sources.length} connected</p>
        </div>
        <ActionButton variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Connect Source
        </ActionButton>
      </div>

      {sources.length === 0 ? (
        <EmptyState message="No data sources connected yet. Connect one to start generating insights." />
      ) : (
        <ul className="divide-y divide-white/5">
          {sources.map((source) => (
            <li key={source.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-100">{source.name}</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {source.recordsProcessed} records · last sync {source.lastSync}
                  {source.confidence > 0 && ` · ${source.confidence}% confidence`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={source.status} />
                <ActionButton
                  onClick={() => handleSync(source.id, source.name)}
                  loading={syncingId === source.id}
                  disabled={source.status === 'syncing'}
                >
                  <RefreshCw className="h-3 w-3" />
                  Sync Now
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConnectSourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
}
