"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { nebulaVertexShader, nebulaFragmentShader } from "@/lib/shaders/nebula";
import * as THREE from "three";

interface NebulaBackgroundProps {
  enabled?: boolean;
}

export function NebulaBackground({ enabled = true }: NebulaBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    if (materialRef.current && enabled) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={meshRef} scale={[100, 100, 1]} position={[0, 0, -50]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={{
          time: { value: 0 },
          color1: { value: new THREE.Color(0.2, 0.1, 0.4) },
          color2: { value: new THREE.Color(0.4, 0.2, 0.6) },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

