'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = ['Initializing neural core…', 'Calibrating models…', 'Ready.'];

/**
 * A short, purposeful boot sequence — not decoration for its own sake, but a
 * beat that frames what's about to load as an "intelligence system," not a
 * website. Skips straight through (no delay) if reduced motion is set.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const reducedMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const lineTimer = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, BOOT_LINES.length - 1));
    }, 700);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(lineTimer);
      clearTimeout(completeTimer);
    };
  }, [reducedMotion, onComplete]);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            className="absolute rounded-full border border-signal-500/40"
            style={{ inset: -ring * 14 }}
            animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: ring * 0.25, ease: 'easeInOut' }}
          />
        ))}
        <motion.div
          className="h-10 w-10 rounded-full bg-signal-gradient"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500">
          Xai
        </span>
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm text-ink-300"
        >
          {BOOT_LINES[lineIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
}
