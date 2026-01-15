export interface DeviceCapabilities {
  isMobile: boolean;
  isVR: boolean;
  isHighEnd: boolean;
  maxTextureSize: number;
  maxDrawCalls: number;
  recommendedStarCount: number;
  enableNebula: boolean;
  enableVolumetricClouds: boolean;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isVR: false,
      isHighEnd: true,
      maxTextureSize: 4096,
      maxDrawCalls: 100,
      recommendedStarCount: 6000,
      enableNebula: true,
      enableVolumetricClouds: true,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const isVR = "xr" in navigator;
  
  // Detect GPU capabilities
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  let renderer = "";
  
  if (gl) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
    }
  }
  
  const isHighEnd = !isMobile && (
    renderer.includes("NVIDIA") ||
    renderer.includes("AMD") ||
    renderer.includes("Apple M1") ||
    renderer.includes("Apple M2") ||
    renderer.includes("Apple M3")
  );

  const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048;
  const maxDrawCalls = isHighEnd ? 100 : isMobile ? 30 : 60;

  return {
    isMobile,
    isVR,
    isHighEnd,
    maxTextureSize,
    maxDrawCalls,
    recommendedStarCount: isMobile ? 2000 : isHighEnd ? 6000 : 4000,
    enableNebula: !isMobile,
    enableVolumetricClouds: isHighEnd,
  };
}

