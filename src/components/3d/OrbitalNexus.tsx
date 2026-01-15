"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Earth } from "./Earth";
import { Starfield } from "./Starfield";
import { ISSMarker } from "./ISSMarker";
import { NebulaBackground } from "./NebulaBackground";
import { detectDeviceCapabilities } from "@/lib/utils/device-capabilities";
import { usePerformance } from "@/lib/hooks/usePerformance";
import * as THREE from "three";

export default function OrbitalNexus() {
  const [dpr, setDpr] = useState([1, 2]);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const capabilities = detectDeviceCapabilities();
  const { fps } = usePerformance();

  // Auto-LOD based on performance
  useEffect(() => {
    if (fps < 55 && quality === "high") {
      setQuality("medium");
      setDpr([1, 1.5]);
    } else if (fps < 45 && quality === "medium") {
      setQuality("low");
      setDpr([1, 1]);
    }
  }, [fps, quality]);

  const starCount = quality === "high" ? capabilities.recommendedStarCount : quality === "medium" ? 3000 : 2000;

  return (
    <div className="w-full h-screen bg-black" data-testid="orbital-nexus">
      <Canvas dpr={dpr} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerformanceMonitor
          onIncline={() => {
            if (quality !== "high") {
              setQuality(quality === "low" ? "medium" : "high");
              setDpr([1, 2]);
            }
          }}
          onDecline={() => {
            if (quality === "high") {
              setQuality("medium");
              setDpr([1, 1.5]);
            } else if (quality === "medium") {
              setQuality("low");
              setDpr([1, 1]);
            }
          }}
        />

        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 5, 5]} intensity={2} castShadow />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Earth />
            <ISSMarker />
          </group>
          
          {/* Nebula background (disabled on mobile/low-end) */}
          {capabilities.enableNebula && quality !== "low" && <NebulaBackground enabled={true} />}
          
          {/* Starfield with adaptive count */}
          <Starfield count={starCount} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={20}
          autoRotate={false}
        />
      </Canvas>

      {/* Performance indicator (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded font-mono text-xs text-white/60">
          FPS: {Math.round(fps)} | Quality: {quality} | Stars: {starCount}
        </div>
      )}
    </div>
  );
}
