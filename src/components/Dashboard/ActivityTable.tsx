'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ACTIVITY_TABLE } from '@/data/mockData';
import type { ActivityStatus } from '@/types';

const STATUS_STYLES: Record<ActivityStatus, string> = {
  critical: 'bg-red-500/15 text-red-400',
  warning: 'bg-amber-500/15 text-amber-400',
  insight: 'bg-cyan-500/15 text-cyan-400',
  positive: 'bg-emerald-500/15 text-emerald-400',
  resolved: 'bg-ink-500/15 text-ink-300',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 w-full max-w-[140px] animate-pulse rounded bg-white/5" />
        </td>
      ))}
    </tr>
  );
}

export function ActivityTable() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass overflow-x-auto rounded-2xl p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink-200">Recent Intelligence</h3>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-ink-500">
            <th scope="col" className="px-4 py-2 font-medium">
              Source
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Analysis
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Confidence
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : ACTIVITY_TABLE.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-ink-200">
                    {row.source}
                  </td>
                  <td className="px-4 py-3.5 text-ink-400">{row.analysis}</td>
                  <td className="px-4 py-3.5 font-mono text-ink-300">{row.confidence}%</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                        STATUS_STYLES[row.status],
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink-500">{row.time}</td>
                </motion.tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
