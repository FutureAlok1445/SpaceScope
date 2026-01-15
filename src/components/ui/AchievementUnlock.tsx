"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementUnlockProps {
  title: string;
  description?: string;
  onComplete: () => void;
  duration?: number;
}

export function AchievementUnlock({
  title,
  description,
  onComplete,
  duration = 1.5,
}: AchievementUnlockProps) {
  const [visible, setVisible] = useState(true);
  const [rippleProgress, setRippleProgress] = useState(0);

  useEffect(() => {
    // Golden shockwave ripple
    const interval = setInterval(() => {
      setRippleProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300);
          }, 200);
          return 1;
        }
        return prev + 0.05;
      });
    }, 16);

    // Harmonic chord (C-E-G) - Web Audio API with error handling
    let audioContext: AudioContext | null = null;
    let oscillators: Array<{ osc: OscillatorNode; gain: GainNode }> = [];
    
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const frequencies = [261.63, 329.63, 392.0]; // C4, E4, G4
      oscillators = frequencies.map((freq) => {
        const osc = audioContext!.createOscillator();
        const gain = audioContext!.createGain();
        osc.connect(gain);
        gain.connect(audioContext!.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, audioContext!.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, audioContext!.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, audioContext!.currentTime + duration);
        osc.start();
        osc.stop(audioContext!.currentTime + duration);
        return { osc, gain };
      });
    } catch (error) {
      console.debug("Audio context not available");
    }

    return () => {
      clearInterval(interval);
      if (oscillators.length > 0) {
        oscillators.forEach(({ osc }) => {
          try {
            osc.stop();
          } catch (e) {
            // Already stopped
          }
        });
      }
      if (audioContext) {
        try {
          audioContext.close();
        } catch (e) {
          // Already closed
        }
      }
    };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Golden shockwave */}
      <div
        className="absolute inset-0 bg-gradient-radial from-yellow-500/30 via-transparent to-transparent"
        style={{
          transform: `scale(${1 + rippleProgress * 2})`,
          opacity: 1 - rippleProgress,
        }}
      />

      {/* Particle burst effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = rippleProgress * 200;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                opacity: 1 - rippleProgress,
              }}
            />
          );
        })}
      </div>

      {/* Achievement card */}
      <div
        className={cn(
          "relative bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-8 text-center space-y-4",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          transition: "all 0.3s ease-out",
        }}
      >
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
        <h3 className="font-orbitron text-2xl text-white uppercase tracking-widest">
          {title}
        </h3>
        {description && (
          <p className="font-mono text-sm text-white/70">{description}</p>
        )}
      </div>

      {/* HUD counter update effect */}
      <div className="absolute top-8 right-8 bg-black/80 border border-yellow-500/50 px-4 py-2 rounded-lg font-mono text-yellow-400">
        +100 XP
      </div>
    </div>
  );
}

