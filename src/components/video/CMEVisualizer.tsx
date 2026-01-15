"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface CMEVisualizerProps {
  intensity?: number; // 0-1
}

function CMEVisualizerMesh({ intensity = 0.5 }: CMEVisualizerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const duration = 8.0; // 8 seconds
    const newProgress = Math.min(elapsed / duration, 1);

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = elapsed;
        material.uniforms.progress.value = newProgress;
        material.uniforms.intensity.value = intensity;
      }
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
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      // CME propagation from center
      float wave = sin(dist * 20.0 - progress * 10.0) * 0.5 + 0.5;
      float propagation = smoothstep(0.0, 0.8, progress) * (1.0 - smoothstep(0.8, 1.0, progress));
      
      // Aurora oval expansion
      float oval = 1.0 - abs(dist - progress * 0.4) * 5.0;
      oval = max(0.0, oval);
      
      // Green aurora color
      vec3 color = vec3(0.0, 1.0, 0.5) * wave * propagation * oval * intensity;
      
      // Data-HUD overlay effect
      float grid = mod(uv.x * 10.0, 1.0) < 0.1 || mod(uv.y * 10.0, 1.0) < 0.1 ? 0.2 : 0.0;
      color += vec3(grid);
      
      gl_FragColor = vec4(color, propagation * intensity);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[10, 10, 1]} position={[0, 0, -5]}>
      <planeGeometry args={[2, 2, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          progress: { value: 0 },
          intensity: { value: intensity },
        }}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function CMEVisualizer(props: CMEVisualizerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <CMEVisualizerMesh {...props} />
      </Canvas>
    </div>
  );
}

