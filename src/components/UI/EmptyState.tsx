import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  message,
  icon: Icon = Inbox,
}: {
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <Icon className="h-6 w-6 text-ink-500" />
      </span>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
    </div>
  );
}
