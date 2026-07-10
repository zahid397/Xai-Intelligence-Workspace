'use client';

import { Bell, Search } from 'lucide-react';
import { CURRENT_USER } from '@/data/mockData';

interface HeaderProps {
  activeModelName: string;
}

export function Header({ activeModelName }: HeaderProps) {
  return (
    <header className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-ink-100">Good morning, {CURRENT_USER.name.split(' ')[0]}</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
            </span>
            {activeModelName} active
          </span>
        </div>
        <p className="mt-0.5 text-xs text-ink-500">48 automations active</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            placeholder="Search insights, sources…"
            aria-label="Search dashboard"
            className="glass w-56 rounded-full py-2 pl-9 pr-3 text-xs text-ink-200 placeholder:text-ink-500 focus:border-signal-500/50 focus:outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative rounded-full p-2 text-ink-400 hover:bg-white/5 hover:text-ink-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-signal-500 font-mono text-[8px] font-bold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-signal-gradient text-[10px] font-semibold text-void">
            {CURRENT_USER.initials}
          </span>
          <span className="text-xs text-ink-300">{CURRENT_USER.workspace}</span>
        </div>
      </div>
    </header>
  );
}
