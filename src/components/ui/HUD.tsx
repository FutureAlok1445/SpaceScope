"use client";

import { GlassPanel } from "./GlassPanel";
import { cn } from "@/lib/utils";
import { Menu, Wifi, Sun } from "lucide-react";

export function HUD() {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none">

            {/* Top Bar */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center pointer-events-auto">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-cyan/10 border border-cyan/50 rounded-full animate-spin-slow">
                        <span className="w-2 h-2 bg-cyan rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-orbitron font-bold text-2xl tracking-widest text-white uppercase">
                            SpaceScope
                        </h1>
                        <span className="text-[10px] text-cyan/70 font-mono tracking-[0.2em] uppercase">
                            System v2.0 // Online
                        </span>
                    </div>
                </div>

                <nav className="hidden md:flex gap-8 bg-black/50 backdrop-blur-md px-8 py-2 rounded-full border border-white/10">
                    {["Nexus", "Dashboard", "Missions", "Academy"].map((item) => (
                        <button key={item} className="text-white/60 hover:text-cyan font-inter text-xs uppercase tracking-widest transition-colors">
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <GlassPanel className="px-3 py-1 flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-mono text-white/50">LIVE</span>
                    </GlassPanel>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>
            </header>

            {/* Cosmic Weather Widget (Top Right) */}
            <div className="absolute top-24 right-6 w-64 pointer-events-auto">
                <GlassPanel className="p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="text-xs font-orbitron text-amber-500 tracking-widest uppercase">Cosmic Wx</h3>
                        <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60 font-mono">SOLAR WIND</span>
                            <span className="text-xs text-cyan font-mono">450 km/s</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-cyan h-full w-[45%]" />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-white/60 font-mono">GEOMAGNETIC</span>
                            <span className="text-xs text-green-400 font-mono">KP 2.0</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-green-400 h-full w-[20%]" />
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Hero Center Text (Fades out on interaction usually, kept static for now) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto mix-blend-screen">
                <h2 className="text-8xl md:text-9xl font-orbitron font-black text-white/10 tracking-tighter select-none">
                    NEXUS
                </h2>
            </div>


            {/* Bottom Data Ticker */}
            <div className="absolute bottom-0 left-0 w-full bg-void-light/80 backdrop-blur-md border-t border-white/5 py-2 overflow-hidden pointer-events-auto">
                <div className="flex whitespace-nowrap animate-marquee gap-12 px-4">
                    {[
                        "ISS: ORBITSTABLE",
                        "SOLAR FLARE: NONE",
                        "METEOR SHOWER: GEMINIDS PEAK IN 12H",
                        "NEO WATCH: 2024 XR2 (SAFE)",
                        "MOON PHASE: WAXING GIBBOUS"
                    ].map((text, i) => (
                        <span key={i} className="text-xs font-mono text-cyan/70 tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan rounded-full" />
                            {text}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}
