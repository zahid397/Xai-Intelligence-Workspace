'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IntelligenceStage } from '@/types';

interface FlowCardProps {
  stage: IntelligenceStage;
  icon: LucideIcon;
  isActive: boolean;
  isLast: boolean;
  onSelect: () => void;
}

export function FlowCard({ stage, icon: Icon, isActive, isLast, onSelect }: FlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1"
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`Preview stage ${stage.index}: ${stage.title}`}
        className={cn(
          'glass relative flex h-full w-full flex-col rounded-2xl p-6 text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
          isActive ? 'border-signal-500/50 shadow-glow' : 'border-white/10 hover:border-white/20',
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-500',
              isActive
                ? 'border-signal-400 text-signal-400'
                : 'border-white/15 text-ink-500',
            )}
          >
            {stage.index}
          </span>
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-500',
              isActive ? 'bg-signal-500/15 text-signal-400' : 'bg-white/5 text-ink-500',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
          {stage.eyebrow}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold text-ink-100">{stage.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">{stage.description}</p>

        <dl className="mt-5 space-y-1.5 border-t border-white/10 pt-4">
          {stage.stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between text-xs">
              <dt className="text-ink-500">{stat.label}</dt>
              <dd className="font-mono text-ink-300">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </button>

      {!isLast && (
        <div
          className="absolute right-[-1.25rem] top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-white/20 to-transparent md:block"
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
