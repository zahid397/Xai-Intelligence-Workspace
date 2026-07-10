'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';

interface ConnectSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (name: string) => Promise<void>;
}

export function ConnectSourceModal({ isOpen, onClose, onConnect }: ConnectSourceModalProps) {
  const [name, setName] = useState('');
  const [connecting, setConnecting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setConnecting(true);
    await onConnect(name.trim() || 'New Data Source');
    setConnecting(false);
    setName('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect a data source">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="source-name" className="mb-1.5 block text-xs font-medium text-ink-400">
            Source name
          </label>
          <input
            id="source-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HubSpot, Zendesk, Snowflake…"
            className="w-full rounded-lg border border-white/10 bg-void-800/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500/70 focus:border-signal-500/50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={connecting}
          className="w-full rounded-xl bg-cta py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60"
        >
          {connecting ? 'Connecting…' : 'Connect source'}
        </button>
      </form>
    </Modal>
  );
}
