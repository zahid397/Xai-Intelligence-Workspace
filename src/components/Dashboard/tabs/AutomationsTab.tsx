'use client';

import { useState } from 'react';
import { Pause, Pencil, Play } from 'lucide-react';
import { ActionButton } from '@/components/UI/ActionButton';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { useToast } from '@/components/UI/Toast';
import * as mockApi from '@/lib/mockApi';
import type { AutomationItem } from '@/types';
import { EditAutomationModal } from './EditAutomationModal';

export function AutomationsTab({ initialAutomations }: { initialAutomations: AutomationItem[] }) {
  const [automations, setAutomations] = useState(initialAutomations);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AutomationItem | null>(null);
  const { showToast } = useToast();

  async function handleRun(automation: AutomationItem) {
    setPendingId(automation.id);
    const updated = await mockApi.runAutomation(automation.id);
    setAutomations(updated);
    setPendingId(null);
    showToast(`${automation.name} is now running`, 'success');
  }

  async function handlePause(automation: AutomationItem) {
    setPendingId(automation.id);
    const updated = await mockApi.pauseAutomation(automation.id);
    setAutomations(updated);
    setPendingId(null);
    showToast(`${automation.name} paused`, 'info');
  }

  function handleSaveEdit(name: string) {
    setAutomations((current) =>
      current.map((a) => (a.id === editing?.id ? { ...a, name } : a)),
    );
    showToast('Automation updated', 'success');
    setEditing(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {automations.map((automation) => (
        <div key={automation.id} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-100">{automation.name}</h3>
            <StatusBadge status={automation.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-ink-500">Trigger</p>
              <p className="mt-1 text-ink-300">{automation.trigger}</p>
            </div>
            <div>
              <p className="text-ink-500">Action</p>
              <p className="mt-1 text-ink-300">{automation.action}</p>
            </div>
          </div>

          <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-ink-500">
            {automation.runsThisMonth.toLocaleString()} runs this month
          </p>

          <div className="mt-4 flex gap-2">
            <ActionButton
              variant="primary"
              onClick={() => handleRun(automation)}
              disabled={automation.status === 'running'}
              loading={pendingId === automation.id && automation.status !== 'running'}
            >
              <Play className="h-3 w-3" />
              Run
            </ActionButton>
            <ActionButton
              onClick={() => handlePause(automation)}
              disabled={automation.status === 'paused'}
              loading={pendingId === automation.id && automation.status !== 'paused'}
            >
              <Pause className="h-3 w-3" />
              Pause
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => setEditing(automation)}>
              <Pencil className="h-3 w-3" />
              Edit
            </ActionButton>
          </div>
        </div>
      ))}

      <EditAutomationModal
        automation={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
