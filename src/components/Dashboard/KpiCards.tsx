'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUp, Database, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { KPI_CARDS } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { KpiData } from '@/types';

const ICON_MAP: Record<string, typeof Database> = {
  Database,
  Sparkles,
  Workflow,
  ShieldCheck,
};

const TREND_ICON: Record<KpiData['trend'], typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: ArrowRight,
};

const TREND_COLOR: Record<KpiData['trend'], string> = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  flat: 'text-ink-500',
};

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPI_CARDS.map((kpi, index) => {
        const Icon = ICON_MAP[kpi.icon] ?? Sparkles;
        const TrendIcon = TREND_ICON[kpi.trend];
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.015 }}
            className="glass group rounded-2xl p-5 transition-shadow duration-300 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-500/10 text-signal-400">
                <Icon className="h-4 w-4" />
              </span>
              <span className={cn('flex items-center gap-1 font-mono text-xs', TREND_COLOR[kpi.trend])}>
                <TrendIcon className="h-3 w-3" />
                {kpi.delta}
              </span>
            </div>
            <p className="mt-4 font-mono text-2xl font-semibold text-ink-100">{kpi.value}</p>
            <p className="mt-1 text-xs text-ink-500">{kpi.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
