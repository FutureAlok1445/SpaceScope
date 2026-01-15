"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface PortalIrisProps {
  onComplete: () => void;
  duration?: number;
}

function PortalMesh({ onComplete, duration = 2.0 }: PortalIrisProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const startTimeRef = useRef(Date.now());
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newProgress = Math.min(elapsed / duration, 1);
    setProgress(newProgress);

    if (groupRef.current) {
      // Camera brake effect - slow rotation
      groupRef.current.rotation.z = (1 - newProgress) * Math.PI * 2;
    }

    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = newProgress * 2;
    }

    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = 1 - newProgress;
    }

    if (newProgress >= 1) {
      setTimeout(onComplete, 100);
    }
  });

  const particleCount = 1000;
  const particles = useRef<Float32Array | null>(null);

  useEffect(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.random() * 2 + 1;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    particles.current = positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Portal ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Particle inversion effect */}
      {particles.current && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particles.current}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#ffffff"
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Bloom threshold ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1 + progress * 0.5, 1 + progress * 0.5, 1]}>
        <ringGeometry args={[1.8, 2.2, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={(1 - progress) * 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function PortalIris(props: PortalIrisProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <PortalMesh {...props} />
      </Canvas>
    </div>
  );
}

