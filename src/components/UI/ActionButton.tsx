'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  loading?: boolean;
}

/** The one button component every dashboard action routes through, so
 * loading state (disabled + spinner) is consistent everywhere instead of
 * each tab reinventing it slightly differently. */
export function ActionButton({
  variant = 'outline',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-cta text-white hover:bg-cta-hover',
        variant === 'outline' && 'border border-white/15 text-ink-300 hover:border-white/30 hover:text-ink-100',
        variant === 'ghost' && 'text-ink-400 hover:bg-white/5 hover:text-ink-100',
        variant === 'danger' && 'border border-red-500/30 text-red-400 hover:bg-red-500/10',
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
      {children}
    </button>
  );
}
