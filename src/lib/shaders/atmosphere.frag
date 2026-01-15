uniform sampler2D earthTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 dayColor = texture2D(earthTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float intensity = dot(normalize(vNormal), sunDirection);
  float mixFactor = smoothstep(-0.1, 0.1, intensity);
  
  // Atmosphere (Rayleigh scattering)
  float atmosphere = 1.0 - exp(-0.6 * abs(vPosition.y) / 6371.0);
  vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * atmosphere;
  
  gl_FragColor = vec4(mix(nightColor, dayColor + atmosphereColor, mixFactor), 1.0);
}

