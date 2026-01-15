"use client";

import { useState, useRef, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Slider } from "@/components/ui/slider";
import { celestialApi, CelestialEvent, AuroraRegion } from "@/lib/api/api-service";
import {
  Play,
  Pause,
  MapPin,
  Satellite,
  Globe,
  Sparkles,
  Moon,
  Sun,
  Star,
  Eye,
  EyeOff,
  Gauge,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const EVENT_ICONS: Record<string, React.ElementType> = {
  meteor_shower: Sparkles,
  eclipse: Moon,
  satellite: Satellite,
  conjunction: Star,
  aurora: Zap,
  default: Globe,
};

const REGION_COLORS = [
  "from-green-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-green-500",
  "from-violet-400 to-purple-500",
];

export function SkyEventsCinema() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeValue, setTimeValue] = useState(12);
  const [skyEvents, setSkyEvents] = useState<CelestialEvent[]>([]);
  const [auroraRegions, setAuroraRegions] = useState<AuroraRegion[]>([]);
  const [kpIndex, setKpIndex] = useState(3);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch data from API
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [eventsRes, auroraRes] = await Promise.all([
        celestialApi.getEvents(),
        celestialApi.getAurora(),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setSkyEvents(eventsRes.data.skyEvents || []);
      } else {
        setSkyEvents(getFallbackEvents());
      }
      if (auroraRes.success && auroraRes.data) {
        setAuroraRegions(auroraRes.data.visibility || []);
        setKpIndex(auroraRes.data.kpIndex?.current || 3);
      } else {
        setAuroraRegions(getFallbackAuroraRegions());
      }
    } catch (error) {
      setSkyEvents(getFallbackEvents());
      setAuroraRegions(getFallbackAuroraRegions());
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-play timeline
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimeValue((prev) => {
          const next = prev + 0.1;
          return next >= 24 ? 0 : next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Draw world map with aurora overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with dark background
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, width, height);

      // Draw grid with slight glow
      ctx.strokeStyle = "rgba(0, 200, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 24; i++) {
        ctx.beginPath();
        ctx.moveTo((width / 24) * i, 0);
        ctx.lineTo((width / 24) * i, height);
        ctx.stroke();
      }
      for (let i = 0; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (height / 12) * i);
        ctx.lineTo(width, (height / 12) * i);
        ctx.stroke();
      }

      // Draw simplified world map
      ctx.strokeStyle = "rgba(0, 200, 255, 0.2)";
      ctx.fillStyle = "rgba(0, 200, 255, 0.03)";
      ctx.lineWidth = 1.5;

      const continents = [
        // North America
        { points: [[0.08, 0.2], [0.28, 0.18], [0.32, 0.35], [0.25, 0.45], [0.08, 0.35]] },
        // South America
        { points: [[0.2, 0.48], [0.32, 0.5], [0.28, 0.8], [0.15, 0.75]] },
        // Europe
        { points: [[0.4, 0.18], [0.55, 0.2], [0.52, 0.35], [0.4, 0.32]] },
        // Africa
        { points: [[0.4, 0.38], [0.55, 0.4], [0.52, 0.7], [0.4, 0.68]] },
        // Asia
        { points: [[0.55, 0.15], [0.88, 0.18], [0.85, 0.5], [0.55, 0.45]] },
        // Australia
        { points: [[0.78, 0.62], [0.9, 0.6], [0.88, 0.78], [0.76, 0.76]] },
      ];

      continents.forEach((continent) => {
        ctx.beginPath();
        continent.points.forEach(([x, y], i) => {
          const px = x * width;
          const py = y * height;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Draw aurora regions with pulsing animation
      const animationTime = Date.now() * 0.001;
      auroraRegions.forEach((region, idx) => {
        const x = ((region.lon + 180) / 360) * width;
        const y = ((90 - region.lat) / 180) * height;

        const pulse = Math.sin(animationTime * 2 + idx * 0.5) * 0.3 + 0.7;
        const intensity = (region.intensity || 0.5) * pulse;

        if (region.visible) {
          // Outer glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 120);
          gradient.addColorStop(0, `rgba(0, 255, 180, ${intensity * 0.8})`);
          gradient.addColorStop(0.3, `rgba(100, 0, 255, ${intensity * 0.5})`);
          gradient.addColorStop(1, "rgba(0, 255, 200, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 120, 0, Math.PI * 2);
          ctx.fill();
        }

        // Location marker
        ctx.fillStyle = region.visible ? "#00ffc8" : "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Marker border
        ctx.strokeStyle = region.visible ? "#00ffc8" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "bold 11px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(region.name, x, y - 18);
      });

      // Draw day/night terminator
      const hourAngle = (timeValue / 24) * Math.PI * 2 - Math.PI;
      const sunX = width * 0.5 + Math.cos(hourAngle) * width * 0.4;

      // Night gradient
      const nightGradient = ctx.createLinearGradient(sunX - width * 0.4, 0, sunX + width * 0.4, 0);
      nightGradient.addColorStop(0, "rgba(0, 0, 30, 0)");
      nightGradient.addColorStop(0.4, "rgba(0, 0, 30, 0.5)");
      nightGradient.addColorStop(0.6, "rgba(0, 0, 30, 0.5)");
      nightGradient.addColorStop(1, "rgba(0, 0, 30, 0)");
      ctx.fillStyle = nightGradient;
      ctx.fillRect(0, 0, width, height);

      // Sun indicator
      ctx.fillStyle = "#fcd34d";
      ctx.shadowColor = "#fcd34d";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(sunX, height * 0.1, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeValue, auroraRegions]);

  const currentEventIndex = Math.floor(timeValue / (24 / Math.max(skyEvents.length, 1)));
  const currentEvent = skyEvents[currentEventIndex] || skyEvents[0];

  const getEventIcon = (type: string) => EVENT_ICONS[type] || EVENT_ICONS.default;

  return (
    <div ref={sectionRef} className="w-full min-h-screen py-24 px-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-full mb-6">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
              Live Tracking
            </span>
          </div>
          <h2 className="font-orbitron font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
            SKY <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EVENTS</span>
          </h2>
          <p className="text-white/60 font-inter max-w-xl mx-auto text-lg">
            Interactive visibility map for celestial events, ISS passes, and aurora forecasts
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
            </div>
            <span className="text-indigo-400/60 font-mono text-sm">Loading celestial data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Aurora Forecast Panel */}
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-orbitron text-sm text-white uppercase tracking-widest">
                    Aurora Forecast
                  </h3>
                  <button
                    onClick={fetchData}
                    disabled={isRefreshing}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <RefreshCw className={cn("w-4 h-4 text-white/40", isRefreshing && "animate-spin")} />
                  </button>
                </div>

                {/* KP Gauge */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="relative">
                    <Gauge className="w-12 h-12 text-indigo-400" />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {kpIndex}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-mono text-white">KP Index</span>
                    <span className={cn(
                      "text-xs",
                      kpIndex >= 5 ? "text-red-400" : kpIndex >= 3 ? "text-amber-400" : "text-green-400"
                    )}>
                      {kpIndex >= 5 ? "Storm Active" : kpIndex >= 3 ? "Moderate" : "Quiet"}
                    </span>
                  </div>
                </div>

                {/* Visibility List */}
                <div className="space-y-2">
                  {auroraRegions.slice(0, 6).map((region, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-all",
                        region.visible ? "bg-green-500/10 border border-green-500/20" : "bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {region.visible ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-white/30" />
                        )}
                        <span className="text-sm text-white/80">{region.name}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-mono px-2 py-0.5 rounded",
                        region.visible
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/40"
                      )}>
                        {region.visible ? "Visible" : "Low"}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              {/* Events List */}
              <GlassPanel className="p-6">
                <h3 className="font-orbitron text-sm text-white uppercase tracking-widest mb-4">
                  Upcoming Events
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                  {skyEvents.map((event, idx) => {
                    const EventIcon = getEventIcon(event.type);
                    const isActive = event === currentEvent;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-xl border transition-all cursor-pointer",
                          isActive
                            ? "bg-indigo-500/20 border-indigo-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isActive ? "bg-indigo-500/30" : "bg-white/10"
                          )}>
                            <EventIcon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-white/50")} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-mono text-white truncate">{event.name}</span>
                            <span className="text-xs text-white/40">{event.visibility}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            </div>

            {/* Main Map */}
            <div className="lg:col-span-3">
              <GlassPanel className="p-0 overflow-hidden">
                <div className="relative aspect-video">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    width={1920}
                    height={1080}
                  />

                  {/* Current Event Overlay */}
                  {currentEvent && (
                    <div className="absolute top-4 left-4 right-4">
                      <div className="inline-flex items-center gap-3 bg-black/70 backdrop-blur-md px-5 py-3 rounded-xl border border-indigo-500/30">
                        {(() => {
                          const EventIcon = getEventIcon(currentEvent.type);
                          return <EventIcon className="w-5 h-5 text-indigo-400" />;
                        })()}
                        <div>
                          <span className="font-orbitron text-white block">{currentEvent.name}</span>
                          <span className="text-xs text-white/50">{currentEvent.visibility}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Time Indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      {timeValue >= 6 && timeValue < 18 ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="font-mono text-white">
                        {String(Math.floor(timeValue)).padStart(2, "0")}:00 UTC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={cn(
                        "w-14 h-14 flex items-center justify-center rounded-xl transition-all",
                        isPlaying
                          ? "bg-indigo-500 text-black"
                          : "bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30"
                      )}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                          Timeline Simulation (UTC)
                        </span>
                        <span className="text-sm font-mono text-indigo-400">
                          {String(Math.floor(timeValue)).padStart(2, "0")}:00
                        </span>
                      </div>
                      <Slider
                        value={[timeValue]}
                        onValueChange={([value]) => setTimeValue(value)}
                        min={0}
                        max={24}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-xs text-white/30 font-mono">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getFallbackEvents(): CelestialEvent[] {
  return [
    { id: "1", name: "ISS Pass", type: "satellite", peak: new Date().toISOString(), visibility: "North America", intensity: "Bright", status: "upcoming" },
    { id: "2", name: "Quadrantids Meteor Shower", type: "meteor_shower", peak: "2026-01-03T06:00:00Z", visibility: "Northern Hemisphere", intensity: "Strong", status: "past" },
    { id: "3", name: "Total Lunar Eclipse", type: "eclipse", peak: "2026-03-03T12:00:00Z", visibility: "Americas, Europe", intensity: "Total", status: "upcoming" },
    { id: "4", name: "Lyrids Meteor Shower", type: "meteor_shower", peak: "2026-04-22T08:00:00Z", visibility: "Global", intensity: "Moderate", status: "upcoming" },
    { id: "5", name: "Jupiter-Saturn Conjunction", type: "conjunction", peak: "2026-08-15T00:00:00Z", visibility: "Worldwide", intensity: "High", status: "upcoming" },
  ];
}

function getFallbackAuroraRegions(): AuroraRegion[] {
  return [
    { name: "Alaska", lat: 65, lon: -150, visible: true, intensity: 0.8 },
    { name: "Norway", lat: 70, lon: 20, visible: true, intensity: 0.9 },
    { name: "Iceland", lat: 65, lon: -18, visible: true, intensity: 0.7 },
    { name: "Canada", lat: 60, lon: -100, visible: false, intensity: 0.3 },
    { name: "Scotland", lat: 57, lon: -4, visible: false, intensity: 0.2 },
    { name: "Finland", lat: 68, lon: 26, visible: true, intensity: 0.75 },
  ];
}
