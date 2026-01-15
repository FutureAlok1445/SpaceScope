import * as THREE from "three";

export const starfieldVertexShader = `
attribute float magnitude;
attribute vec3 starColor;
varying float vMagnitude;
varying vec3 vStarColor;

void main() {
  vMagnitude = magnitude;
  vStarColor = starColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (300.0 / -mvPosition.z) * (1.0 - magnitude);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const starfieldFragmentShader = `
varying float vMagnitude;
varying vec3 vStarColor;

void main() {
  float distance = length(gl_PointCoord - vec2(0.5));
  float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
  alpha *= (1.0 - vMagnitude * 0.5); // Dimmer stars fade more
  
  // Scintillation effect
  float twinkle = sin(vMagnitude * 1000.0) * 0.1 + 0.9;
  
  gl_FragColor = vec4(vStarColor * twinkle, alpha);
}
`;

export function createStarfieldMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: starfieldVertexShader,
    fragmentShader: starfieldFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

