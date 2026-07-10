'use client';

import { useEffect, useState } from 'react';

export interface NormalizedMousePosition {
  x: number;
  y: number;
}

/**
 * Mouse position as fractions of the viewport, centered at 0
 * (range roughly -0.5 to 0.5 on each axis) — ready to feed straight into a
 * parallax rotation without extra math at the call site.
 */
export function useMousePosition(): NormalizedMousePosition {
  const [position, setPosition] = useState<NormalizedMousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setPosition({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      });
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
