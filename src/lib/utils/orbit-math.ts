// Simplified SGP4 orbit propagation
// For production, use a proper SGP4 library like satellite.js

export interface TLE {
  line1: string;
  line2: string;
}

export interface OrbitalPosition {
  x: number;
  y: number;
  z: number;
  velocity: {
    x: number;
    y: number;
    z: number;
  };
}

// Simplified circular orbit calculation
export function calculateOrbitPosition(
  radius: number,
  inclination: number,
  period: number,
  time: number
): OrbitalPosition {
  const t = (time % period) / period;
  const angle = t * Math.PI * 2;
  
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle) * Math.sin(inclination);
  const z = radius * Math.sin(angle) * Math.cos(inclination);

  const velocity = 2 * Math.PI * radius / period;
  const vx = -velocity * Math.sin(angle);
  const vy = velocity * Math.cos(angle) * Math.sin(inclination);
  const vz = velocity * Math.cos(angle) * Math.cos(inclination);

  return { x, y, z, velocity: { x: vx, y: vy, z: vz } };
}

// Convert lat/lon/alt to 3D position
export function latLonAltToXYZ(
  lat: number,
  lon: number,
  alt: number,
  earthRadius = 6371
): { x: number; y: number; z: number } {
  const r = (earthRadius + alt) / earthRadius; // Normalized radius
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  return {
    x: r * Math.cos(latRad) * Math.cos(lonRad),
    y: r * Math.sin(latRad),
    z: r * Math.cos(latRad) * Math.sin(lonRad),
  };
}

