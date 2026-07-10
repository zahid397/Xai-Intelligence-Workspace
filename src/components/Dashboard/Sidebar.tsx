'use client';

import { motion } from 'framer-motion';
import {
  Cpu,
  Database,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Workflow,
  FileBarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardTabId } from '@/types';

const NAV_ITEMS: { id: DashboardTabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sources', label: 'Data Sources', icon: Database },
  { id: 'models', label: 'AI Models', icon: Cpu },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
  systemHealth: number;
}

/** Controlled by Dashboard.tsx — clicking an item calls back up rather than
 * just toggling a local highlight, which is what makes the tabs actually
 * switch content instead of only looking selected. */
export function Sidebar({ activeTab, onTabChange, systemHealth }: SidebarProps) {
  return (
    <nav
      role="navigation"
      aria-label="Dashboard navigation"
      className="glass sticky top-20 hidden h-fit w-60 shrink-0 flex-col justify-between rounded-2xl p-4 md:flex"
    >
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
                  isActive ? 'text-ink-100' : 'text-ink-400 hover:text-ink-200',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-signal-500/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4 shrink-0" />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-signal-400"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs text-ink-400">AI Model Status</span>
        </div>
        <p className="font-mono text-xs text-emerald-400">Operational</p>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
            <span>System Health</span>
            <span className="font-mono">{systemHealth}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-signal-gradient" style={{ width: `${systemHealth}%` }} />
          </div>
        </div>

        <p className="text-xs text-ink-500">
          Last sync <span className="text-ink-300">2 min ago</span>
        </p>
      </div>
    </nav>
  );
}
