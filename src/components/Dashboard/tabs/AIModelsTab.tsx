'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { useToast } from '@/components/UI/Toast';
import { cn } from '@/lib/utils';
import * as mockApi from '@/lib/mockApi';
import type { AIModelCard } from '@/types';

const COST_LABEL: Record<AIModelCard['costLevel'], string> = {
  low: '$ Low cost',
  medium: '$$ Medium cost',
  high: '$$$ High cost',
};

interface AIModelsTabProps {
  initialModels: AIModelCard[];
  onActiveModelChange: (name: string) => void;
}

export function AIModelsTab({ initialModels, onActiveModelChange }: AIModelsTabProps) {
  const [models, setModels] = useState(initialModels);
  const { showToast } = useToast();

  async function handleSelect(model: AIModelCard) {
    if (model.status === 'active') return;
    const updated = await mockApi.setActiveAIModel(model.id);
    setModels(updated);
    onActiveModelChange(model.name);
    showToast('AI model switched successfully', 'success');
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {models.map((model) => {
        const isActive = model.status === 'active';
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => handleSelect(model)}
            className={cn(
              'glass rounded-2xl p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
              isActive ? 'border-signal-500/50 shadow-glow' : 'hover:border-white/20',
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink-100">{model.name}</h3>
              {isActive ? (
                <span className="flex items-center gap-1 rounded-full bg-signal-500/15 px-2 py-0.5 text-[11px] text-signal-400">
                  <Check className="h-3 w-3" />
                  Active
                </span>
              ) : (
                <StatusBadge status={model.status} />
              )}
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-ink-500">Accuracy</dt>
                <dd className="mt-0.5 font-mono text-ink-200">{model.accuracy}%</dd>
              </div>
              <div>
                <dt className="text-ink-500">Latency</dt>
                <dd className="mt-0.5 font-mono text-ink-200">{model.latencyMs}ms</dd>
              </div>
              <div>
                <dt className="text-ink-500">Cost</dt>
                <dd className="mt-0.5 font-mono text-ink-200">{COST_LABEL[model.costLevel]}</dd>
              </div>
            </dl>

            {!isActive && (
              <p className="mt-3 text-xs text-ink-500">Click to make this the active model</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
