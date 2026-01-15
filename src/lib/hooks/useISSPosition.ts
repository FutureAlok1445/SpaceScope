"use client";

import { useState, useEffect } from "react";
import { getISSPositionWithFallback, ISSPosition } from "../api/fallback-chain";

export function useISSPosition(updateInterval = 5000) {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updatePosition = async () => {
      try {
        setLoading(true);
        const pos = await getISSPositionWithFallback();
        setPosition(pos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ISS position");
      } finally {
        setLoading(false);
      }
    };

    updatePosition();
    intervalId = setInterval(updatePosition, updateInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateInterval]);

  return { position, loading, error };
}

