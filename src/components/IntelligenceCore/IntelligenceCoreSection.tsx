'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';
import { SPHERE_STATS } from '@/data/mockData';

const NeuralSphere = dynamic(
  () => import('./NeuralSphere').then((mod) => mod.NeuralSphere),
  { ssr: false },
);

export function IntelligenceCoreSection() {
  const [left, right] = [SPHERE_STATS.slice(0, 3), SPHERE_STATS.slice(3)];

  return (
    <section id="core" className="relative px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-400">
          Intelligence Core
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
          Where intelligence lives
        </h2>
        <p className="mt-4 text-ink-400">Hover to explore. Click to activate the network.</p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <StatColumn stats={left} align="right" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80"
        >
          <ErrorBoundary
            fallback={
              <div className="glass flex h-full w-full items-center justify-center rounded-full">
                <span className="text-xs text-ink-500">Neural core unavailable</span>
              </div>
            }
          >
            <NeuralSphere />
          </ErrorBoundary>
        </motion.div>

        <StatColumn stats={right} align="left" />
      </div>
    </section>
  );
}

function StatColumn({
  stats,
  align,
}: {
  stats: { label: string; value: string }[];
  align: 'left' | 'right';
}) {
  return (
    <div
      className={cn(
        'flex flex-row justify-center gap-6 md:flex-col md:gap-5',
        align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left',
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-mono text-lg font-semibold text-ink-100">{stat.value}</p>
          <p className="text-xs text-ink-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
