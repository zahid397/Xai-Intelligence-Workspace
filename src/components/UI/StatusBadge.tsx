import { cn } from '@/lib/utils';

const STYLES: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  running: 'bg-emerald-500/15 text-emerald-400',
  ready: 'bg-emerald-500/15 text-emerald-400',
  completed: 'bg-emerald-500/15 text-emerald-400',
  syncing: 'bg-amber-500/15 text-amber-400',
  processing: 'bg-amber-500/15 text-amber-400',
  paused: 'bg-ink-500/15 text-ink-300',
  available: 'bg-ink-500/15 text-ink-300',
  generating: 'bg-amber-500/15 text-amber-400',
  failed: 'bg-red-500/15 text-red-400',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        STYLES[status] ?? 'bg-white/5 text-ink-400',
      )}
    >
      {status}
    </span>
  );
}
