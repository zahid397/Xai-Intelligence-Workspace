'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Drawer } from '@/components/UI/Drawer';
import { EmptyState } from '@/components/UI/EmptyState';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { cn } from '@/lib/utils';
import type { InsightRow } from '@/types';

type FilterChip = 'completed' | 'processing' | 'high-confidence' | 'low-confidence';

const FILTERS: { id: FilterChip; label: string }[] = [
  { id: 'completed', label: 'Completed' },
  { id: 'processing', label: 'Processing' },
  { id: 'high-confidence', label: 'High Confidence' },
  { id: 'low-confidence', label: 'Low Confidence' },
];

const HIGH_CONFIDENCE_THRESHOLD = 90;

function matchesFilter(insight: InsightRow, filter: FilterChip): boolean {
  switch (filter) {
    case 'completed':
      return insight.status === 'completed';
    case 'processing':
      return insight.status === 'processing';
    case 'high-confidence':
      return insight.confidence >= HIGH_CONFIDENCE_THRESHOLD;
    case 'low-confidence':
      return insight.confidence < HIGH_CONFIDENCE_THRESHOLD;
  }
}

export function InsightsTab({ initialInsights }: { initialInsights: InsightRow[] }) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<FilterChip>>(new Set());
  const [selected, setSelected] = useState<InsightRow | null>(null);

  function toggleFilter(filter: FilterChip) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return initialInsights.filter((insight) => {
      const matchesSearch =
        !query ||
        insight.source.toLowerCase().includes(query) ||
        insight.analysis.toLowerCase().includes(query);
      const matchesFilters =
        activeFilters.size === 0 || [...activeFilters].every((f) => matchesFilter(insight, f));
      return matchesSearch && matchesFilters;
    });
  }, [initialInsights, search, activeFilters]);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-ink-200">Insights</h2>
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search insights…"
            aria-label="Search insights"
            className="w-full rounded-full border border-white/10 bg-void-800/60 py-2 pl-9 pr-3 text-xs text-ink-200 placeholder:text-ink-500 focus:border-signal-500/50 focus:outline-none sm:w-64"
          />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = activeFilters.has(filter.id);
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => toggleFilter(filter.id)}
              aria-pressed={isActive}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition-colors',
                isActive
                  ? 'border-signal-500/50 bg-signal-500/10 text-signal-400'
                  : 'border-white/10 text-ink-400 hover:border-white/20 hover:text-ink-200',
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No insights match your search or filters." />
      ) : (
        <ul className="divide-y divide-white/5">
          {filtered.map((insight) => (
            <li key={insight.id}>
              <button
                type="button"
                onClick={() => setSelected(insight)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-100">{insight.analysis}</p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {insight.source} · {insight.createdAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-xs text-ink-300">{insight.confidence}%</span>
                  <StatusBadge status={insight.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Drawer isOpen={selected !== null} onClose={() => setSelected(null)} title="Insight detail">
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-ink-500">Source</p>
              <p className="mt-1 text-sm text-ink-100">{selected.source}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Analysis</p>
              <p className="mt-1 text-sm text-ink-200">{selected.analysis}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Confidence</p>
              <p className="mt-1 font-mono text-sm text-ink-200">{selected.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Status</p>
              <div className="mt-1">
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="rounded-xl border border-signal-500/20 bg-signal-500/5 p-4">
              <p className="text-xs font-medium text-signal-400">Recommendation</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{selected.recommendation}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
