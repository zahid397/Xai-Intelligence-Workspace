'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of whichever of `sectionIds` currently occupies the most
 * "focus band" of the viewport (a horizontal strip roughly a third of the
 * way down), via IntersectionObserver rather than a scroll-position
 * calculation — cheaper, and it doesn't fight the sticky navbar's height
 * the way naive `getBoundingClientRect` math tends to.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Focus band: ignore the sticky navbar strip at the top, watch the
        // middle third of the viewport for whichever section dominates it.
        rootMargin: '-15% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
