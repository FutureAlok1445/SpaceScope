"use client";

import Spline from '@splinetool/react-spline/next';
import { useEffect, useState } from "react";

export default function Loading() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Auto-complete after 3 seconds to prevent infinite loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoaded) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Spline 3D Model */}
      <div className="w-full h-full relative">
        <Spline
          scene="https://prod.spline.design/RYGLNglgXqlSI6sk/scene.splinecode"
          onLoad={() => console.log("Spline model loaded")}
        />
      </div>

      {/* Loading Text Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="font-orbitron text-2xl md:text-4xl text-white/90 tracking-widest">
          SPACESCOPE
        </div>
        <div className="font-mono text-sm text-cyan/70 tracking-widest uppercase mt-2">
          Initializing Cosmic Systems...
        </div>
      </div>

      {/* Grain Overlay for atmosphere */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
