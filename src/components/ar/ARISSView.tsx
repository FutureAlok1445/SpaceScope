"use client";

import { useEffect, useRef, useState } from "react";
import { useISSPosition } from "@/lib/hooks/useISSPosition";

interface ARISSViewProps {
  onClose: () => void;
}

export function ARISSView({ onClose }: ARISSViewProps) {
  const [arSupported, setArSupported] = useState(false);
  const [arActive, setArActive] = useState(false);
  const { position } = useISSPosition();

  useEffect(() => {
    // Check WebXR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        setArSupported(supported);
      });
    }
  }, []);

  const startARSession = async () => {
    if (!navigator.xr || !arSupported) {
      alert("AR not supported on this device");
      return;
    }

    try {
      const session = await (navigator.xr as any).requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
      });

      setArActive(true);

      // Spatial beep (5 kHz, 100 ms) - Web Audio API with error handling
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 5000;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.debug("Audio playback not available");
      }

      session.addEventListener("end", () => {
        setArActive(false);
      });
    } catch (error) {
      console.error("Failed to start AR session:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h2 className="font-orbitron text-3xl text-white uppercase tracking-widest">
          AR ISS Tracker
        </h2>

        {!arSupported && (
          <p className="text-white/60 font-mono text-sm">
            WebXR AR not supported on this device
          </p>
        )}

        {arSupported && !arActive && (
          <button
            onClick={startARSession}
            className="px-8 py-4 bg-cyan-500/20 border-2 border-cyan-500 rounded-xl font-mono text-white uppercase tracking-widest hover:bg-cyan-500/30 transition-colors"
          >
            Start AR Session
          </button>
        )}

        {arActive && position && (
          <div className="space-y-4">
            <div className="font-mono text-white/80">
              <div>Lat: {position.latitude.toFixed(2)}°</div>
              <div>Lon: {position.longitude.toFixed(2)}°</div>
              <div>Alt: {position.altitude.toFixed(0)} km</div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

