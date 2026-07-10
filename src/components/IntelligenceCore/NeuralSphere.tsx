'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const NODE_COUNT = 16;
const RADIUS = 1.8;

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

const VERTEX_SHADER = `
  uniform float uPixelRatio;
  uniform float uScale;
  attribute float aSize;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position * uScale, 1.0);
    gl_PointSize = aSize * uPixelRatio * (240.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uColor, alpha * uIntensity);
  }
`;

function NeuralNodes() {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  useCursor(hovered);

  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const scaleRef = useRef(1);
  const glowRef = useRef(0);

  const nodePositions = useMemo(() => fibonacciSphere(NODE_COUNT, RADIUS), []);
  const sizes = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT);
    arr.fill(6);
    return arr;
  }, []);

  // Connect each node to its two nearest-index neighbors — a simple,
  // deterministic "neural net" look without expensive nearest-neighbor search.
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const next = (i + 1) % NODE_COUNT;
      const across = (i + Math.floor(NODE_COUNT / 2)) % NODE_COUNT;
      positions.push(
        nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
        nodePositions[next * 3], nodePositions[next * 3 + 1], nodePositions[next * 3 + 2],
      );
      if (i % 3 === 0) {
        positions.push(
          nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
          nodePositions[across * 3], nodePositions[across * 3 + 1], nodePositions[across * 3 + 2],
        );
      }
    }
    return new Float32Array(positions);
  }, [nodePositions]);

  const pointUniforms = useMemo(
    () => ({
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uScale: { value: 1 },
      uColor: { value: new THREE.Color('#a78bfa') },
      uIntensity: { value: 0.5 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!reducedMotion) {
      group.rotation.y += delta * (hovered ? 0.25 : 0.12);
    }

    const targetScale = hovered ? 1.18 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.08);
    pointUniforms.uScale.value = scaleRef.current;

    const targetGlow = active ? 0.3 : 0;
    glowRef.current = THREE.MathUtils.lerp(glowRef.current, targetGlow, 0.06);
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = glowRef.current;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Invisible pointer target — raycasting against a mesh is far more
          reliable than against a sparse Points cloud. */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive((a) => !a)}
        visible={false}
      >
        <sphereGeometry args={[RADIUS * 1.15, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          args={[
            {
              uniforms: pointUniforms,
              vertexShader: VERTEX_SHADER,
              fragmentShader: FRAGMENT_SHADER,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            },
          ]}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/**
 * The closing "signature" sphere: idle rotation always runs (unless reduced
 * motion), hover both speeds the rotation and expands the node cluster
 * slightly, and a click toggles the neural connections glowing on/off —
 * matching "Hover to explore. Click to activate the network."
 */
export function NeuralSphere() {
  return (
    <Canvas
      role="img"
      aria-label="Interactive neural sphere — hover to expand, click to activate its connections"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
      }}
    >
      <NeuralNodes />
    </Canvas>
  );
}
