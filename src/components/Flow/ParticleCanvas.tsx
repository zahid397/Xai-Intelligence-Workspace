'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const COUNT = 1600;

function randomCloud(count: number, spread: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
  }
  return positions;
}

function gridLayout(count: number, spread: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const perRow = Math.ceil(Math.sqrt(count));
  const step = spread / perRow;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    positions[i * 3] = (col - perRow / 2) * step;
    positions[i * 3 + 1] = (row - perRow / 2) * step;
    positions[i * 3 + 2] = 0;
  }
  return positions;
}

/** Same grid, but nudged into loose clusters — reads as "network" rather
 * than "spreadsheet" once connecting lines are drawn between clusters. */
function networkLayout(count: number, spread: number): Float32Array {
  const base = gridLayout(count, spread);
  const positions = new Float32Array(base);
  const clusterCount = 8;
  for (let i = 0; i < count; i++) {
    const cluster = i % clusterCount;
    const angle = (cluster / clusterCount) * Math.PI * 2;
    const pull = spread * 0.28;
    positions[i * 3] += Math.cos(angle) * pull * 0.3;
    positions[i * 3 + 1] += Math.sin(angle) * pull * 0.3;
    positions[i * 3 + 2] += Math.sin(i) * 0.4;
  }
  return positions;
}

/** Final state: particles converge onto a small ring of "action icon" slots. */
function actionLayout(count: number, spread: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const slots = 5;
  for (let i = 0; i < count; i++) {
    const slot = i % slots;
    const angle = (slot / slots) * Math.PI * 2 - Math.PI / 2;
    const slotRadius = spread * 0.32;
    const jitter = (Math.random() - 0.5) * 0.25;
    positions[i * 3] = Math.cos(angle) * slotRadius + jitter;
    positions[i * 3 + 1] = Math.sin(angle) * slotRadius * 0.55 + jitter;
    positions[i * 3 + 2] = jitter;
  }
  return positions;
}

const VERTEX_SHADER = `
  uniform float uPixelRatio;
  attribute float aSize;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (190.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uColor, alpha * 0.4);
  }
`;

interface ParticleSystemProps {
  progress: number; // 0-1 overall flow progress, driven by GSAP ScrollTrigger
}

function ParticleSystem({ progress }: ParticleSystemProps) {
  const reducedMotion = useReducedMotion();
  const pointsRef = useRef<THREE.Points>(null);

  const spread = 5;
  const stage0 = useMemo(() => randomCloud(COUNT, spread), []);
  const stage1 = useMemo(() => gridLayout(COUNT, spread), []);
  const stage2 = useMemo(() => networkLayout(COUNT, spread), []);
  const stage3 = useMemo(() => actionLayout(COUNT, spread), []);
  const current = useMemo(() => new Float32Array(stage0), [stage0]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) arr[i] = 1.2 + Math.random() * 2;
    return arr;
  }, []);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uColor: { value: new THREE.Color('#8b5cf6') },
    }),
    [],
  );

  const staticPositions = useMemo(() => (reducedMotion ? stage3 : null), [reducedMotion, stage3]);

  // Blend across three consecutive segments (0-.33, .33-.66, .66-1) rather
  // than a single global lerp, so each phase transition reads distinctly
  // instead of everything drifting toward the end state at once.
  useFrame(() => {
    if (reducedMotion) return;
    const points = pointsRef.current;
    if (!points) return;

    const p = THREE.MathUtils.clamp(progress, 0, 1);
    let from: Float32Array;
    let to: Float32Array;
    let t: number;

    if (p < 0.333) {
      from = stage0;
      to = stage1;
      t = p / 0.333;
    } else if (p < 0.666) {
      from = stage1;
      to = stage2;
      t = (p - 0.333) / 0.333;
    } else {
      from = stage2;
      to = stage3;
      t = (p - 0.666) / 0.334;
    }

    const eased = t * t * (3 - 2 * t);
    for (let i = 0; i < COUNT * 3; i++) {
      current[i] = THREE.MathUtils.lerp(from[i], to[i], eased);
    }
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    attr.needsUpdate = true;

    points.rotation.z = p * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[staticPositions ?? current, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        args={[
          {
            uniforms,
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  );
}

export function ParticleCanvas({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.85;
      }}
      aria-hidden="true"
    >
      <ParticleSystem progress={progress} />
    </Canvas>
  );
}
