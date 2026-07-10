'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import type { AutomationItem } from '@/types';

interface EditAutomationModalProps {
  automation: AutomationItem | null;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function EditAutomationModal({ automation, onClose, onSave }: EditAutomationModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (automation) setName(automation.name);
  }, [automation]);

  return (
    <Modal isOpen={automation !== null} onClose={onClose} title="Edit automation">
      {automation && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(name);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="automation-name" className="mb-1.5 block text-xs font-medium text-ink-400">
              Name
            </label>
            <input
              id="automation-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-void-800/60 px-3 py-2 text-sm text-ink-100 focus:border-signal-500/50 focus:outline-none"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-400">Trigger</p>
            <p className="rounded-lg border border-white/10 bg-void-800/40 px-3 py-2 text-sm text-ink-300">
              {automation.trigger}
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-400">Action</p>
            <p className="rounded-lg border border-white/10 bg-void-800/40 px-3 py-2 text-sm text-ink-300">
              {automation.action}
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-cta py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
          >
            Save changes
          </button>
        </form>
      )}
    </Modal>
  );
}
