"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface WormholeTransitionProps {
  onComplete: () => void;
  duration?: number;
}

function WormholeMesh({ onComplete, duration = 4.2 }: WormholeTransitionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newProgress = Math.min(elapsed / duration, 1);

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = elapsed;
        material.uniforms.progress.value = newProgress;
      }
    }

    if (newProgress >= 1) {
      setTimeout(onComplete, 100);
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float progress;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      
      // Tunnel effect with quaternion-like rotation
      float tunnel = 1.0 - dist * 2.0 + progress;
      float spiral = sin(angle * 3.0 + time * 2.0 + dist * 10.0) * 0.5 + 0.5;
      
      // Chromatic aberration
      vec3 color = vec3(
        spiral * tunnel * (1.0 + progress * 2.0),
        spiral * tunnel * (1.0 + progress * 1.5),
        spiral * tunnel * (1.0 + progress * 1.0)
      );
      
      // Particle stretch effect
      float stretch = 1.0 - abs(uv.y) * 2.0;
      color *= stretch;
      
      gl_FragColor = vec4(color, tunnel);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          progress: { value: 0 },
        }}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function WormholeTransition(props: WormholeTransitionProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Canvas>
        <WormholeMesh {...props} />
      </Canvas>
    </div>
  );
}

