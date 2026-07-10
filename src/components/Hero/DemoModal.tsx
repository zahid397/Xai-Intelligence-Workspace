'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Zap } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: Database, title: 'Connect raw data', detail: 'CRMs, spreadsheets, APIs, and internal tools stream in.' },
  { icon: Cpu, title: 'Analyze with AI', detail: '48 models cross-check the signal for patterns and risk.' },
  { icon: Zap, title: 'Trigger automation', detail: 'Approved insights dispatch actions automatically.' },
];

const STEP_DURATION_MS = 2200;

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }
    if (reducedMotion) return; // static — let the user click through manually below

    const interval = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [isOpen, reducedMotion]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How Xai works">
      <div className="space-y-5">
        {STEPS.map((s, index) => {
          const isActive = step === index;
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-300',
                isActive ? 'border-signal-500/50 bg-signal-500/5' : 'border-white/10',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isActive ? 'bg-signal-500/20 text-signal-400' : 'bg-white/5 text-ink-500',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className={cn('text-sm font-medium', isActive ? 'text-ink-100' : 'text-ink-400')}>
                  {index + 1}. {s.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">{s.detail}</p>
              </div>
            </button>
          );
        })}

        <div className="flex gap-1.5 pt-1">
          {STEPS.map((s, index) => (
            <div key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              {index === step && !reducedMotion && (
                <motion.div
                  key={step}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: STEP_DURATION_MS / 1000, ease: 'linear' }}
                  className="h-full bg-signal-gradient"
                />
              )}
              {index <= step && reducedMotion && <div className="h-full w-full bg-signal-gradient" />}
              {index < step && !reducedMotion && <div className="h-full w-full bg-signal-gradient" />}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
