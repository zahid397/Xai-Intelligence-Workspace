'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowDown, PlayCircle } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TrialModal } from './TrialModal';
import { DemoModal } from './DemoModal';

// Heavy 3D dependency — never touch the server bundle, and don't block the
// initial paint of the text/CTAs above it.
const IntelligenceSphere = dynamic(
  () => import('./IntelligenceSphere').then((mod) => mod.IntelligenceSphere),
  { ssr: false },
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mousePosition = useMousePosition();
  const scrollProgress = useScrollProgress(sectionRef as React.RefObject<HTMLElement>);
  const [trialOpen, setTrialOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative flex min-h-screen scroll-mt-16 items-center justify-center overflow-hidden px-4"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_45%_at_50%_20%,rgba(99,102,241,0.08),transparent)]" />
      <div className="absolute inset-0 -z-0">
        <ErrorBoundary fallback={null}>
          <IntelligenceSphere scrollProgress={scrollProgress} mousePosition={mousePosition} />
        </ErrorBoundary>
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass mb-6 rounded-full px-4 py-1.5 font-mono text-xs tracking-wide text-ink-300"
        >
          INTELLIGENCE WORKSPACE v2.4
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink-100 sm:text-6xl"
        >
          Intelligence that transforms <span className="text-gradient">data into decisions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-balance text-base text-ink-400 sm:text-lg"
        >
          Xai connects raw information, AI reasoning, and automated actions into one
          intelligent workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => setTrialOpen(true)}
            className="rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            Start Free Trial
          </button>
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="glass flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-ink-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Demo
          </button>
        </motion.div>

        <p className="mt-4 text-xs text-ink-500">
          No credit card required — see your first insight in under two minutes.
        </p>
      </div>

      <motion.a
        href="#how-it-works"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="Scroll to how it works section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink-500 transition-colors hover:text-ink-200"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.span>
      </motion.a>

      <TrialModal isOpen={trialOpen} onClose={() => setTrialOpen(false)} />
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
