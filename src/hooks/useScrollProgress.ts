'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useScroll } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

/**
 * Returns a plain 0→1 number tracking scroll progress of `target` moving
 * through the viewport (or the whole document if no ref is passed).
 * Built on Framer Motion's useScroll/MotionValue, exposed as plain state so
 * consumers that aren't already Framer-driven (e.g. GSAP, R3F useFrame) can
 * read it without importing motion-value plumbing themselves.
 *
 * Returns 0 permanently if the user prefers reduced motion, so anything
 * driven by this value renders its resting state.
 */
export function useScrollProgress(target?: RefObject<HTMLElement>): number {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll(
    target
      ? { target, offset: ['start end', 'end start'] }
      : { layoutEffect: false },
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0);
      return;
    }
    const unsubscribe = scrollYProgress.on('change', (value) => setProgress(value));
    return () => unsubscribe();
  }, [scrollYProgress, reducedMotion]);

  return reducedMotion ? 0 : progress;
}
