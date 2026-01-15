"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "./GlassPanel";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HUDAlertProps {
  message: string;
  type?: "alert" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export function HUDAlert({
  message,
  type = "alert",
  duration = 5000,
  onClose,
}: HUDAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Haptic pulse simulation (if available)
  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <GlassPanel
        className={cn(
          "px-6 py-4 flex items-center gap-4 border-2",
          type === "alert" && "border-red-500/50 bg-red-500/10",
          type === "warning" && "border-amber-500/50 bg-amber-500/10",
          type === "info" && "border-cyan-500/50 bg-cyan-500/10"
        )}
      >
        {/* Red-alert rim glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl blur-xl -z-10",
            type === "alert" && "bg-red-500/30",
            type === "warning" && "bg-amber-500/30",
            type === "info" && "bg-cyan-500/30"
          )}
        />

        <AlertTriangle
          className={cn(
            "w-6 h-6 shrink-0",
            type === "alert" && "text-red-500",
            type === "warning" && "text-amber-500",
            type === "info" && "text-cyan-500"
          )}
        />

        <div className="flex-1">
          <p className="font-mono text-sm text-white uppercase tracking-widest">
            {message}
          </p>
        </div>

        {/* Scan lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-white to-transparent bg-[length:100%_2px] animate-pulse" />
        </div>
      </GlassPanel>
    </div>
  );
}

