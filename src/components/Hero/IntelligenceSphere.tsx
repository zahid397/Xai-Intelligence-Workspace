'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const PARTICLE_COUNT = 2400;
const RADIUS = 2.2;
const NODE_COUNT = 36;

/** Evenly distributes `count` points on a sphere surface (Fibonacci lattice)
 * — this is the "structured" target state particles converge into. */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    positions[i * 3] = Math.cos(theta) * radiusAtY * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;
  }
  return positions;
}

/** Scatters `count` points chaotically through a spherical volume — the
 * "raw data" starting state. */
function chaoticCloud(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (1.4 + Math.random() * 1.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

const VERTEX_SHADER = `
  uniform float uPixelRatio;
  attribute float aSize;
  varying float vDist;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vDist = length(position) / 3.6;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColorCore;
  uniform vec3 uColorEdge;
  varying float vDist;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    vec3 color = mix(uColorCore, uColorEdge, clamp(vDist, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * 0.4);
  }
`;

interface ParticleFieldProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

function ParticleField({ scrollProgress, mousePosition }: ParticleFieldProps) {
  const reducedMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const idleAngle = useRef(0);

  const chaotic = useMemo(() => chaoticCloud(PARTICLE_COUNT, RADIUS), []);
  const structured = useMemo(() => fibonacciSphere(PARTICLE_COUNT, RADIUS), []);
  const current = useMemo(() => new Float32Array(chaotic), [chaotic]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) arr[i] = 1.5 + Math.random() * 2.5;
    return arr;
  }, []);

  // Pick a fixed set of node pairs (indices into the structured layout) to
  // connect with lines once the sphere is "structured" — a stand-in neural net.
  const nodePairs = useMemo(() => {
    const step = Math.floor(PARTICLE_COUNT / NODE_COUNT);
    const nodeIndices = Array.from({ length: NODE_COUNT }, (_, i) => i * step);
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodeIndices.length; i++) {
      const a = nodeIndices[i];
      const b = nodeIndices[(i + 5) % nodeIndices.length];
      pairs.push([a, b]);
    }
    return pairs;
  }, []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(nodePairs.length * 2 * 3), 3),
    );
    return geometry;
  }, [nodePairs]);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uColorCore: { value: new THREE.Color('#a78bfa') },
      uColorEdge: { value: new THREE.Color('#22d3ee') },
    }),
    [],
  );

  // Reduced motion: jump straight to the final structured state, no animation loop.
  const staticPositions = useMemo(() => (reducedMotion ? structured : null), [reducedMotion, structured]);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const group = groupRef.current;
    const points = pointsRef.current;
    const lines = linesRef.current;
    if (!group || !points || !lines) return;

    const progress = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    const eased = progress * progress * (3 - 2 * progress); // smoothstep easing

    const positionAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      current[i] = THREE.MathUtils.lerp(chaotic[i], structured[i], eased);
    }
    positionAttr.needsUpdate = true;

    const lineAttr = lines.geometry.attributes.position as THREE.BufferAttribute;
    nodePairs.forEach(([a, b], i) => {
      lineAttr.setXYZ(i * 2, current[a * 3], current[a * 3 + 1], current[a * 3 + 2]);
      lineAttr.setXYZ(i * 2 + 1, current[b * 3], current[b * 3 + 1], current[b * 3 + 2]);
    });
    lineAttr.needsUpdate = true;
    (lines.material as THREE.LineBasicMaterial).opacity = eased * 0.25;

    idleAngle.current += delta * 0.08;
    const targetY = idleAngle.current + mousePosition.x * 0.6;
    const targetX = mousePosition.y * 0.3;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.04);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.04);
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={0}
      floatIntensity={reducedMotion ? 0 : 0.6}
    >
      <group ref={groupRef}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[staticPositions ?? current, 3]}
            />
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

        <lineSegments ref={linesRef} geometry={lineGeometry}>
          <lineBasicMaterial color="#8b5cf6" transparent opacity={reducedMotion ? 0.25 : 0} />
        </lineSegments>
      </group>
    </Float>
  );
}

interface IntelligenceSphereProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

/**
 * The Hero's centerpiece: a particle sphere that reads as "raw data" when
 * chaotic and "structured intelligence" once scrolled/settled. See
 * ParticleField for the transformation logic; this wrapper owns the Canvas,
 * accessibility labeling, and reduced-motion pass-through.
 */
export function IntelligenceSphere({ scrollProgress, mousePosition }: IntelligenceSphereProps) {
  return (
    <Canvas
      role="img"
      aria-label="Interactive AI intelligence sphere, visualizing data transforming into structured insight"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        // Set directly on the real renderer instance rather than passing
        // toneMapping/toneMappingExposure through the `gl` prop object —
        // those aren't WebGLRenderer *constructor* parameters (they're
        // post-construction properties), so passing them as plain gl-prop
        // keys was silently dropped and additive-blended particles were
        // still rendering with no tone mapping — the actual cause of the
        // "still blown out to solid white" bug. This is the fix.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
      }}
      className="pointer-events-none"
    >
      <ParticleField scrollProgress={scrollProgress} mousePosition={mousePosition} />
    </Canvas>
  );
}
