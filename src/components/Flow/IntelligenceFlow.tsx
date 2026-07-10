'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Boxes, Cpu, Sparkles, Zap } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { INTELLIGENCE_STAGES } from '@/data/mockData';
import { FlowCard } from './FlowCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ParticleCanvas = dynamic(() => import('./ParticleCanvas').then((mod) => mod.ParticleCanvas), {
  ssr: false,
});

const STAGE_ICONS = [Boxes, Cpu, Sparkles, Zap];
const SEGMENT = 1 / INTELLIGENCE_STAGES.length;

export function IntelligenceFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  // Clicking a card "pins" the preview to that stage until the user scrolls
  // again — this is what makes "clicking a card updates the visual preview"
  // true, rather than the canvas only ever reacting to scroll position.
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setScrollProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          setPreviewIndex(null); // real scroll always takes back control
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollIndex = Math.min(
    Math.floor(scrollProgress / SEGMENT),
    INTELLIGENCE_STAGES.length - 1,
  );
  const activeIndex = previewIndex ?? scrollIndex;
  // When a card is clicked, feed the particle canvas the midpoint progress
  // of that stage's segment so it visually matches the selected card.
  const displayProgress =
    previewIndex !== null ? previewIndex * SEGMENT + SEGMENT / 2 : scrollProgress;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative flex min-h-screen scroll-mt-16 flex-col justify-center overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-35">
        <ErrorBoundary fallback={null}>
          <ParticleCanvas progress={displayProgress} />
        </ErrorBoundary>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
            How Xai turns data into action
          </h2>
          <p className="mt-4 text-ink-400">
            Four stages, one continuous pipeline — from raw noise to a dispatched action. Click
            any stage to preview it, or keep scrolling to watch it unfold.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6 md:flex-row md:gap-8">
          {INTELLIGENCE_STAGES.map((stage, index) => (
            <FlowCard
              key={stage.id}
              stage={stage}
              icon={STAGE_ICONS[index]}
              isActive={activeIndex === index}
              isLast={index === INTELLIGENCE_STAGES.length - 1}
              onSelect={() => setPreviewIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
