import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

void THREE;

function FloatingObject({ geometry, position, color, speed = 1, distort = 0, wobble = 0, scale = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    ref.current.rotation.y += 0.003 * speed;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        {geometry}
        {distort > 0 ? (
          <MeshDistortMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            distort={distort}
            speed={2}
          />
        ) : wobble > 0 ? (
          <MeshWobbleMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
            factor={wobble}
            speed={1.5}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.85}
          />
        )}
      </mesh>
    </Float>
  );
}

function MouseCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  useFrame((state) => {
    if (typeof window !== 'undefined') {
      mouse.current.x = ((window.innerWidth / 2 - state.pointer.x * window.innerWidth / 2) / window.innerWidth) * 2;
      mouse.current.y = ((window.innerHeight / 2 - state.pointer.y * window.innerHeight / 2) / window.innerHeight) * 2;
    }
  });

  return null;
}

function Particles({ count = 40 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.y = t * 0.1;
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#818cf8" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ pointerEvents: 'auto' }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        <fog attach="fog" args={['#F8FAFC', 6, 18]} />
        <MouseCamera />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#c7d2fe" />
        <pointLight position={[-4, 3, -3]} intensity={0.6} color="#818cf8" />
        <pointLight position={[4, -2, 3]} intensity={0.4} color="#34d399" />

        {/* Tool-themed 3D objects */}
        {/* Scissors — two rotating torus shapes */}
        <FloatingObject
          geometry={<torusGeometry args={[0.5, 0.12, 16, 32]} />}
          position={[-4.5, 1.5, -2]}
          color="#3b82f6"
          speed={0.8}
        />
        <FloatingObject
          geometry={<torusGeometry args={[0.5, 0.12, 16, 32]} />}
          position={[-3.8, 0.8, -1.5]}
          color="#60a5fa"
          speed={0.6}
        />

        {/* File/Document — box */}
        <FloatingObject
          geometry={<boxGeometry args={[0.9, 1.2, 0.08]} />}
          position={[-2.2, 2, -3]}
          color="#8b5cf6"
          speed={0.5}
        />

        {/* Download arrow — cone */}
        <FloatingObject
          geometry={<coneGeometry args={[0.35, 0.7, 4]} />}
          position={[3.5, 1.8, -2.5]}
          color="#10b981"
          speed={0.7}
          scale={0.9}
        />

        {/* Shield — sphere */}
        <FloatingObject
          geometry={<icosahedronGeometry args={[0.6, 0]} />}
          position={[-3, -1.5, -2]}
          color="#22c55e"
          speed={0.6}
        />

        {/* Palette — distorted sphere */}
        <FloatingObject
          geometry={<sphereGeometry args={[0.55, 32, 32]} />}
          position={[4, -1, -1]}
          color="#a855f7"
          speed={0.9}
          distort={0.3}
        />

        {/* Sparkle — octahedron */}
        <FloatingObject
          geometry={<octahedronGeometry args={[0.45, 0]} />}
          position={[1.5, 2.5, -3.5]}
          color="#f97316"
          speed={1}
        />

        {/* Play button — torus knot */}
        <FloatingObject
          geometry={<torusKnotGeometry args={[0.35, 0.1, 64, 16]} />}
          position={[2, -2, -2]}
          color="#ef4444"
          speed={0.7}
        />

        {/* Search magnifier — sphere + torus */}
        <FloatingObject
          geometry={<sphereGeometry args={[0.4, 32, 32]} />}
          position={[-1, -2.5, -3]}
          color="#6366f1"
          speed={0.8}
          distort={0.15}
        />
        <FloatingObject
          geometry={<torusGeometry args={[0.55, 0.06, 16, 32]} />}
          position={[-1, -2.5, -3]}
          color="#818cf8"
          speed={0.8}
        />

        {/* Big center wobbling shape */}
        <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
          <mesh position={[0, 0, -4]} scale={1.2}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <MeshWobbleMaterial
              color="#6366f1"
              roughness={0.2}
              metalness={0.9}
              factor={0.15}
              speed={1}
            />
          </mesh>
        </Float>

        {/* Background particles */}
        <Particles count={50} />
      </Canvas>
    </div>
  );
}
