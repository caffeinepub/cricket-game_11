import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BallEventInfo {
  runs: number;
  isWicket: boolean;
  isSix: boolean;
  isFour: boolean;
  id: number; // increment to trigger new animation
}

interface CricketStadium3DProps {
  ballEvent?: BallEventInfo | null;
  wickets?: number;
  overs?: number;
  runRate?: number;
  format?: string;
  team1Color?: string;
  team2Color?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PITCH_LENGTH = 20.12;
const PITCH_WIDTH = 3.05;
const GROUND_RADIUS = 65;
const BOUNDARY_RADIUS = 60;

// Fielder positions: [x, z] on the ground plane (y=0)
// Pitch runs along Z axis: bowler at z=-10, batsman at z=+10
const ATTACKING_FIELD: [number, number][] = [
  [0, 12],       // wicketkeeper
  [2, 9],        // slip 1
  [4, 8],        // slip 2
  [-3, 7],       // gully
  [8, 2],        // point
  [-8, 2],       // cover
  [5, -5],       // mid-on
  [-5, -5],      // mid-off
  [0, -18],      // long-on
  [20, -10],     // fine leg
  [-20, -10],    // third man
];

const DEFENSIVE_FIELD: [number, number][] = [
  [0, 12],       // wicketkeeper
  [2, 10],       // slip
  [25, 5],       // deep point
  [-25, 5],      // deep cover
  [30, -5],      // long-on
  [-30, -5],     // long-off
  [0, -30],      // long-on deep
  [20, 20],      // fine leg
  [-20, 20],     // third man
  [15, -20],     // mid-wicket deep
  [-15, -20],    // extra cover deep
];

// ─── Ground Plane ─────────────────────────────────────────────────────────────

function Ground() {
  return (
    <group>
      {/* Main outfield */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[GROUND_RADIUS, 64]} />
        <meshStandardMaterial color="#1a4a1a" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Inner circle (30-yard) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <ringGeometry args={[27, 30, 64]} />
        <meshStandardMaterial color="#ffffff" opacity={0.15} transparent />
      </mesh>

      {/* Boundary rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[BOUNDARY_RADIUS - 0.5, BOUNDARY_RADIUS + 0.5, 128]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>

      {/* Pitch strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[PITCH_WIDTH, PITCH_LENGTH]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.8} />
      </mesh>

      {/* Crease lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 8.5]}>
        <planeGeometry args={[4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -8.5]}>
        <planeGeometry args={[4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ─── Stumps ───────────────────────────────────────────────────────────────────

function Stumps({ position }: { position: [number, number, number] }) {
  const offsets = [-0.11, 0, 0.11];
  return (
    <group position={position}>
      {offsets.map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#f5deb3" />
        </mesh>
      ))}
      {/* Bails */}
      <mesh position={[-0.055, 0.72, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.11, 6]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
      <mesh position={[0.055, 0.72, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.11, 6]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
    </group>
  );
}

// ─── Stadium Stands ───────────────────────────────────────────────────────────

function StadiumStands() {
  const segments = 32;
  const stands = useMemo(() => {
    const items: { x: number; z: number; angle: number }[] = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * (GROUND_RADIUS + 5);
      const z = Math.sin(angle) * (GROUND_RADIUS + 5);
      items.push({ x, z, angle });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Stand tiers */}
      {[0, 1, 2].map(tier => (
        <mesh key={tier} rotation={[-Math.PI / 2, 0, 0]} position={[0, tier * 3 + 1, 0]}>
          <ringGeometry args={[GROUND_RADIUS + tier * 4, GROUND_RADIUS + tier * 4 + 3.5, 64]} />
          <meshStandardMaterial
            color={tier === 0 ? '#2a2a3a' : tier === 1 ? '#1e1e2e' : '#161622'}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Crowd dots on stands */}
      {stands.map((s, i) => (
        <mesh key={i} position={[s.x, 2.5, s.z]}>
          <sphereGeometry args={[0.8, 6, 6]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#cc2222' : i % 3 === 1 ? '#2244cc' : '#22aa44'}
            roughness={1}
          />
        </mesh>
      ))}

      {/* Outer wall */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[GROUND_RADIUS + 14, GROUND_RADIUS + 14, 8, 64, 1, true]} />
        <meshStandardMaterial color="#111118" side={THREE.BackSide} roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Floodlight Towers ────────────────────────────────────────────────────────

function FloodlightTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tower pole */}
      <mesh position={[0, 15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 30, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Light head */}
      <mesh position={[0, 31, 0]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Light cone (semi-transparent) */}
      <mesh position={[0, 20, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[12, 20, 16, 1, true]} />
        <meshBasicMaterial color="#ffffcc" opacity={0.04} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Point light at top */}
      <pointLight position={[0, 32, 0]} intensity={80} distance={120} color="#fff8e0" castShadow />
    </group>
  );
}

function FloodlightTowers() {
  const positions: [number, number, number][] = [
    [50, 0, 50],
    [-50, 0, 50],
    [50, 0, -50],
    [-50, 0, -50],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <FloodlightTower key={i} position={pos} />
      ))}
    </>
  );
}

// ─── Cricket Ball ─────────────────────────────────────────────────────────────

interface BallProps {
  event: BallEventInfo | null;
  onAnimationComplete?: () => void;
}

function CricketBall({ event, onAnimationComplete }: BallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const activeEventRef = useRef<BallEventInfo | null>(null);
  const completedRef = useRef(false);

  // Bowler end: z = -9, Batsman end: z = 9
  // For a six, ball goes beyond boundary
  const BOWLER_Z = -9;
  const BATSMAN_Z = 9;
  const SIX_Z = 45;

  useEffect(() => {
    if (event && event.id !== activeEventRef.current?.id) {
      activeEventRef.current = event;
      progressRef.current = 0;
      completedRef.current = false;
    }
  }, [event]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const active = activeEventRef.current;
    if (!active || completedRef.current) {
      // Park ball at bowler end when idle
      meshRef.current.position.set(0, 0.5, BOWLER_Z);
      return;
    }

    const speed = active.isSix ? 0.55 : 0.75;
    progressRef.current = Math.min(progressRef.current + delta * speed, 1);
    const t = progressRef.current;

    const endZ = active.isSix ? SIX_Z : BATSMAN_Z;
    const startZ = BOWLER_Z;

    // Parabolic arc: height peaks at mid-delivery
    const z = startZ + (endZ - startZ) * t;
    const arcHeight = active.isSix ? 18 : 4;
    const y = arcHeight * 4 * t * (1 - t) + 0.3;

    // Slight lateral drift
    const x = active.isWicket ? Math.sin(t * Math.PI) * 0.3 : 0;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.x += delta * 20;

    if (t >= 1 && !completedRef.current) {
      completedRef.current = true;
      onAnimationComplete?.();
    }
  });

  const ballColor = event?.isSix ? '#ff4444' : '#cc2222';

  return (
    <mesh ref={meshRef} position={[0, 0.5, BOWLER_Z]} castShadow>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={ballColor} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

// ─── Fielders ─────────────────────────────────────────────────────────────────

interface FieldersProps {
  isAttacking: boolean;
  team2Color: string;
}

function Fielders({ isAttacking, team2Color }: FieldersProps) {
  const positions = isAttacking ? ATTACKING_FIELD : DEFENSIVE_FIELD;
  const color = team2Color || '#2244cc';

  return (
    <>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Body */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
            <meshStandardMaterial color={i === 0 ? '#ffcc00' : color} roughness={0.8} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.35, 0]} castShadow>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#f5c5a0" roughness={0.9} />
          </mesh>
          {/* Shadow disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <circleGeometry args={[0.25, 8]} />
            <meshBasicMaterial color="#000000" opacity={0.3} transparent />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ─── Crowd Wave Particles ─────────────────────────────────────────────────────

interface CrowdWaveProps {
  active: boolean;
  color: string;
}

function CrowdWave({ active, color }: CrowdWaveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      timeRef.current = 0;
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!visible || !groupRef.current) return;
    timeRef.current += delta;
    if (timeRef.current > 2.5) {
      setVisible(false);
      return;
    }
    const t = timeRef.current / 2.5;
    groupRef.current.children.forEach((child, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const wave = Math.sin(angle * 3 - t * 8) * 0.5 + 0.5;
      child.position.y = GROUND_RADIUS + 2 + wave * 4;
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).setValues({
          opacity: (1 - t) * 0.8,
        });
      }
    });
  });

  if (!visible) return null;

  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    return {
      x: Math.cos(angle) * (GROUND_RADIUS + 2),
      z: Math.sin(angle) * (GROUND_RADIUS + 2),
    };
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, GROUND_RADIUS + 2, p.z]}>
          <sphereGeometry args={[1.2, 6, 6]} />
          <meshBasicMaterial color={color} opacity={0.8} transparent />
        </mesh>
      ))}
    </group>
  );
}

// ─── Batsman Silhouette ───────────────────────────────────────────────────────

function Batsman({ team1Color }: { team1Color: string }) {
  const color = team1Color || '#cc2222';
  return (
    <group position={[0, 0, 8.5]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.9, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#f5c5a0" roughness={0.9} />
      </mesh>
      {/* Bat */}
      <mesh position={[0.4, 0.7, 0.1]} rotation={[0.3, 0, 0.5]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.15]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ─── Bowler Silhouette ────────────────────────────────────────────────────────

function Bowler({ team2Color }: { team2Color: string }) {
  const color = team2Color || '#2244cc';
  return (
    <group position={[0, 0, -9]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.9, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#f5c5a0" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

interface SceneProps {
  ballEvent: BallEventInfo | null;
  wickets: number;
  overs: number;
  runRate: number;
  team1Color: string;
  team2Color: string;
  crowdWaveActive: boolean;
  crowdWaveColor: string;
}

function Scene({
  ballEvent,
  wickets,
  overs,
  runRate,
  team1Color,
  team2Color,
  crowdWaveActive,
  crowdWaveColor,
}: SceneProps) {
  // Determine field placement
  const isAttacking = wickets < 3 && overs < 10;

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 45, 55]}
        fov={45}
        near={0.1}
        far={500}
        onUpdate={cam => cam.lookAt(0, 0, 0)}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#334466" />
      <hemisphereLight args={['#334466', '#112211', 0.4]} />

      {/* Stars */}
      <Stars radius={200} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      {/* Ground & Pitch */}
      <Ground />

      {/* Stumps */}
      <Stumps position={[0, 0, 9]} />
      <Stumps position={[0, 0, -9]} />

      {/* Players */}
      <Batsman team1Color={team1Color} />
      <Bowler team2Color={team2Color} />

      {/* Fielders */}
      <Fielders isAttacking={isAttacking} team2Color={team2Color} />

      {/* Ball */}
      <CricketBall event={ballEvent} />

      {/* Stadium */}
      <StadiumStands />
      <FloodlightTowers />

      {/* Crowd wave effect */}
      <CrowdWave active={crowdWaveActive} color={crowdWaveColor} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CricketStadium3D({
  ballEvent = null,
  wickets = 0,
  overs = 0,
  runRate = 0,
  format = 't20',
  team1Color = '#cc2222',
  team2Color = '#2244cc',
}: CricketStadium3DProps) {
  const [crowdWaveActive, setCrowdWaveActive] = useState(false);
  const [crowdWaveColor, setCrowdWaveColor] = useState('#ffcc00');
  const lastEventIdRef = useRef<number>(-1);

  useEffect(() => {
    if (!ballEvent || ballEvent.id === lastEventIdRef.current) return;
    lastEventIdRef.current = ballEvent.id;

    if (ballEvent.isSix || ballEvent.isWicket) {
      setCrowdWaveColor(ballEvent.isSix ? '#ffcc00' : '#ff4444');
      setCrowdWaveActive(false);
      // Small delay to re-trigger
      setTimeout(() => setCrowdWaveActive(true), 50);
    }
  }, [ballEvent]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border" style={{ height: '340px', background: '#0a0a14' }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene
          ballEvent={ballEvent}
          wickets={wickets}
          overs={overs}
          runRate={runRate}
          team1Color={team1Color}
          team2Color={team2Color}
          crowdWaveActive={crowdWaveActive}
          crowdWaveColor={crowdWaveColor}
        />
      </Canvas>

      {/* Overlay labels */}
      <div className="absolute bottom-2 left-3 flex gap-3 pointer-events-none">
        <span className="text-xs font-heading text-white/60 bg-black/40 px-2 py-0.5 rounded">
          🏟 Live 3D View
        </span>
        {ballEvent?.isSix && (
          <span className="text-xs font-heading text-yellow-300 bg-black/60 px-2 py-0.5 rounded animate-pulse">
            ⚡ SIX!
          </span>
        )}
        {ballEvent?.isWicket && (
          <span className="text-xs font-heading text-red-400 bg-black/60 px-2 py-0.5 rounded animate-pulse">
            🎯 WICKET!
          </span>
        )}
      </div>
    </div>
  );
}
