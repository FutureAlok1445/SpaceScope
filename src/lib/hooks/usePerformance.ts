"use client";

import { useState, useEffect, useRef } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: number;
  drawCalls: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    drawCalls: 0,
  });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const updateMetrics = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      frameCountRef.current++;

      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Memory usage (if available)
        const memory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize / 1048576
          : 0;

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory,
        }));
      }

      requestAnimationFrame(updateMetrics);
    };

    const rafId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return metrics;
}

