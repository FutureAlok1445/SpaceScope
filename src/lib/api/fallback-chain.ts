import { ISSPosition, getISSPosition } from "./nasa-client";

// Fallback strategy: Try primary source, fall back to simulated data
export async function getISSPositionWithFallback(): Promise<ISSPosition> {
  const result = await getISSPosition();
  
  if (result.data) {
    return result.data;
  }

  // Fallback: Simulated ISS orbit (simplified)
  const now = Date.now() / 1000;
  const orbitPeriod = 92.68 * 60; // 92.68 minutes in seconds
  const t = (now % orbitPeriod) / orbitPeriod;
  
  return {
    latitude: 51.6 * Math.sin(t * Math.PI * 2), // Inclined orbit
    longitude: (t * 360 - 180) % 360,
    altitude: 408,
    velocity: 7.66,
    timestamp: now,
  };
}

export function createFallbackChain<T>(
  primary: () => Promise<T>,
  fallback: () => T,
  timeout = 2000
): Promise<T> {
  return Promise.race([
    primary(),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback()), timeout);
    }),
  ]);
}

