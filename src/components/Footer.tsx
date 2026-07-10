import { cn } from '@/lib/utils';

const STATS = [
  { label: 'Total Runs', value: '1,288' },
  { label: 'Time Saved', value: '482h' },
  { label: 'Actions Fired', value: '3,847' },
];

const COLUMNS = [
  { heading: 'Product', links: ['Documentation', 'API Reference', 'Changelog', 'Roadmap'] },
  { heading: 'Company', links: ['Security', 'Privacy', 'Terms', 'Contact'] },
  { heading: 'Resources', links: ['Blog', 'Case Studies', 'Status', 'Community'] },
];

export function Footer() {
  return (
    <footer className="glass border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-6 border-b border-white/10 pb-10 sm:gap-10">
          {STATS.map((stat) => (
            <div key={stat.label} className={cn('text-center sm:text-left')}>
              <p className="font-mono text-2xl font-semibold text-ink-100 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-signal-gradient text-xs font-bold text-void">
                X
              </span>
              <span className="font-semibold text-ink-100">Xai</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-500">
              Building the future of intelligent decisions.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs text-ink-500">All systems operational</span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-ink-500 transition-colors hover:text-ink-100">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© 2026 Xai Intelligence Workspace. All rights reserved.</p>
          <p>Built with care, for enterprise intelligence.</p>
        </div>
      </div>
    </footer>
  );
}
