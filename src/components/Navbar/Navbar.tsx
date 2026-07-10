'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/useActiveSection';

// Matches the section ids rendered in page.tsx exactly — this is the single
// source of truth both the links and the scroll-spy read from, so they
// can never silently drift apart again.
const NAV_LINKS = [
  { id: 'product', label: 'Product' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'automations', label: 'Automations' },
];

const WORKSPACES = ['Enterprise', 'Growth', 'Sandbox'];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection(NAV_LINKS.map((link) => link.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setWorkspaceOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleNavClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + workspace switcher */}
        <div className="flex items-center gap-3">
          <a
            href="#product"
            onClick={(e) => handleNavClick(e, 'product')}
            className="flex items-center gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-signal-gradient text-sm font-bold text-void">
              X
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-100">Xai</span>
          </a>

          <div ref={workspaceRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setWorkspaceOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={workspaceOpen}
              className="flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-xs text-ink-400 transition-colors hover:border-white/20 hover:text-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
            >
              {workspace}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {workspaceOpen && (
              <ul
                role="listbox"
                className="glass-strong absolute left-0 top-full mt-2 w-40 rounded-lg p-1 shadow-glow"
              >
                {WORKSPACES.map((ws) => (
                  <li key={ws} role="option" aria-selected={ws === workspace}>
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspace(ws);
                        setWorkspaceOpen(false);
                      }}
                      className={cn(
                        'w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10',
                        ws === workspace ? 'text-signal-400' : 'text-ink-300',
                      )}
                    >
                      {ws}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Center links — active section highlighted via scroll-spy */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id} className="relative">
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
                    isActive ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-white/5"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 lg:flex" title="AI model status">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-ink-400">Active</span>
          </div>

          <button
            type="button"
            aria-label="Notifications, 3 unread"
            className="relative rounded-full p-2 text-ink-400 transition-colors hover:bg-white/5 hover:text-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-signal-500 font-mono text-[9px] font-bold text-white">
              3
            </span>
          </button>

          <button
            type="button"
            aria-label="Account menu for Alex Chan"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-gradient text-xs font-semibold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
          >
            AC
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="text-ink-300 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/10 px-4 pb-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={cn(
                'block py-2.5 text-sm',
                activeSection === link.id ? 'text-signal-400' : 'text-ink-300 hover:text-ink-100',
              )}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
