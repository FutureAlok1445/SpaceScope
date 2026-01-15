"use client";

import { useEffect, useState, useRef } from "react";

interface BootSequenceProps {
  onComplete: () => void;
  duration?: number;
}

export function BootSequence({ onComplete, duration = 3.0 }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, startTime, onComplete]);


  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Lens Flare */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
          style={{
            opacity: Math.sin(progress * Math.PI * 4) * 0.5 + 0.3,
          }}
        />
      </div>

      {/* Boot Text */}
      <div className="text-center space-y-4">
        <div className="font-orbitron text-4xl md:text-6xl text-white/90 tracking-widest">
          SPACESCOPE
        </div>
        <div className="font-mono text-sm text-cyan/70 tracking-widest uppercase">
          Initializing Cosmic Systems...
        </div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="font-mono text-xs text-white/40">
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.1 + progress * 0.2,
        }}
      />
    </div>
  );
}

