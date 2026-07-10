'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Database, GitBranch, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useToast } from '@/components/UI/Toast';
import { AUTOMATIONS, WORKFLOW_STEPS } from '@/data/mockData';

const STEP_ICONS = [Database, Sparkles, GitBranch, Zap];

const STEP_STATUS_COLOR: Record<string, string> = {
  active: 'text-emerald-400',
  processing: 'text-pulse-400',
  deciding: 'text-amber-400',
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  input: 'Every connected source streams in continuously — no manual imports, no batch delays.',
  processing: 'Forty-eight models cross-check every signal before anything reaches a decision.',
  decision: 'Deterministic rules apply on top of AI confidence, so outcomes stay explainable.',
  automation: 'Approved actions dispatch immediately to the tools your team already uses.',
};

export function AutomationWorkflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress(sectionRef as React.RefObject<HTMLElement>);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const { showToast } = useToast();

  // Map section scroll progress (0-1 across the whole section, since no ref
  // narrowing is applied here) into a 0-1 "how much of the pipeline should
  // look connected" value — connectors finish drawing by the time the
  // section is a third of the way through the viewport.
  const drawProgress = reducedMotion ? 1 : Math.min(scrollProgress * 3, 1);

  return (
    <section id="automations" ref={sectionRef} className="scroll-mt-16 px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
          Intelligence that acts
        </h2>
        <p className="mt-4 text-ink-400">
          Connect any source to any action. Xai handles the reasoning — you handle the strategy.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <p className="mb-5 font-mono text-xs uppercase tracking-wider text-ink-500">
          Workflow Pipeline
        </p>

        <div className="relative grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — desktop only, drawn behind the cards. A plain
              CSS scaleX transform, not SVG pathLength: pathLength relies on
              getTotalLength()-derived stroke-dasharray math, which is
              unreliable on a <line> defined with percentage coordinates and
              no viewBox. A transform-based bar has no such dependency. */}
          <div
            className="pointer-events-none absolute left-[12.5%] top-8 hidden h-0.5 w-[75%] overflow-hidden rounded-full bg-white/[0.08] lg:block"
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-left rounded-full bg-signal-500"
              style={{ scaleX: drawProgress }}
              initial={false}
            />
          </div>

          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            const isHovered = hoveredStep === step.id;
            return (
              <div
                key={step.id}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                onFocus={() => setHoveredStep(step.id)}
                onBlur={() => setHoveredStep(null)}
                tabIndex={0}
                className={cn(
                  'glass relative z-10 rounded-2xl p-5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
                  isHovered && 'border-signal-500/50 shadow-glow',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-500/10 text-signal-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-100">{step.title}</p>
                    <p className={cn('font-mono text-[11px]', STEP_STATUS_COLOR[step.status] ?? 'text-ink-400')}>
                      {step.status}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink-500">{step.detail}</p>
                <p className="mt-1 font-mono text-xs text-ink-300">{step.metric}</p>

                <motion.p
                  initial={false}
                  animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                  className="overflow-hidden text-xs leading-relaxed text-ink-400"
                >
                  <span className="mt-3 block border-t border-white/10 pt-3">
                    {STEP_DESCRIPTIONS[step.id]}
                  </span>
                </motion.p>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-500">
              Active Automations
            </p>
            <button
              type="button"
              onClick={() => showToast('Automations are created from the dashboard', 'info')}
              className="rounded-lg border border-signal-500/40 bg-signal-500/10 px-3 py-1.5 text-xs font-medium text-signal-400 transition-colors hover:bg-signal-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
            >
              + New Automation
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {AUTOMATIONS.map((automation) => (
              <div key={automation.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-100">
                    {automation.name}
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-500" />
                  </h3>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px]',
                      automation.badge === 'scheduled'
                        ? 'bg-pulse-500/15 text-pulse-400'
                        : 'bg-emerald-500/15 text-emerald-400',
                    )}
                  >
                    {automation.badge}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-ink-500">Trigger</p>
                    <p className="mt-1 text-ink-300">{automation.trigger}</p>
                  </div>
                  <div>
                    <p className="text-ink-500">Action</p>
                    <p className="mt-1 text-ink-300">{automation.action}</p>
                  </div>
                </div>
                <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-ink-500">
                  {automation.runsThisMonth.toLocaleString()} runs this month
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
