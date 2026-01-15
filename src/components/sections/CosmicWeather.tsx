"use client";

import { useState, useEffect, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { weatherApi, SpaceWeather } from "@/lib/api/api-service";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import {
    AlertTriangle,
    Sun,
    Wind,
    Activity,
    Zap,
    Radio,
    Thermometer,
    Gauge,
    Waves,
    Shield,
    TrendingUp,
    TrendingDown,
    RefreshCw,
} from "lucide-react";

const KP_LEVELS = [
    { min: 0, max: 1, color: "#22c55e", label: "Quiet", desc: "No significant activity" },
    { min: 1, max: 3, color: "#84cc16", label: "Unsettled", desc: "Minor fluctuations" },
    { min: 3, max: 4, color: "#eab308", label: "Active", desc: "Possible aurora at high latitudes" },
    { min: 4, max: 5, color: "#f97316", label: "Minor Storm", desc: "Aurora visible at higher latitudes" },
    { min: 5, max: 6, color: "#ef4444", label: "Moderate Storm", desc: "Aurora may be visible at mid-latitudes" },
    { min: 6, max: 7, color: "#dc2626", label: "Strong Storm", desc: "Aurora visible at mid-latitudes" },
    { min: 7, max: 9, color: "#991b1b", label: "Severe Storm", desc: "Possible power grid fluctuations" },
    { min: 9, max: 10, color: "#7f1d1d", label: "Extreme Storm", desc: "Major geomagnetic storm in progress" },
];

export default function CosmicWeather() {
    const [weather, setWeather] = useState<SpaceWeather | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const fetchWeather = async () => {
        setIsRefreshing(true);
        try {
            const response = await weatherApi.getAll();
            if (response.success && response.data) {
                setWeather(response.data);
            } else {
                setWeather(getFallbackWeather());
            }
        } catch (err) {
            setWeather(getFallbackWeather());
        } finally {
            setLoading(false);
            setIsRefreshing(false);
            setLastUpdate(new Date());
        }
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading && sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll(".weather-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );
        }
    }, [loading]);

    const kpValue = weather?.kpIndex?.current || 2;
    const kpLevel = KP_LEVELS.find((l) => kpValue >= l.min && kpValue < l.max) || KP_LEVELS[0];
    const solarWindSpeed = weather?.solarWind?.speed || 400;
    const solarWindDensity = weather?.solarWind?.density || 5;

    // Determine alert level
    const getWindStatus = (speed: number) => {
        if (speed > 600) return { status: "High", color: "text-red-400", icon: TrendingUp };
        if (speed > 450) return { status: "Elevated", color: "text-amber-400", icon: TrendingUp };
        return { status: "Normal", color: "text-green-400", icon: TrendingDown };
    };

    const windStatus = getWindStatus(solarWindSpeed);
    const WindIcon = windStatus.icon;

    return (
        <div ref={sectionRef} className="w-full min-h-screen py-24 px-6 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full mb-6">
                        <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
                            Real-Time Monitoring
                        </span>
                    </div>
                    <h2 className="font-orbitron font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
                        COSMIC <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">WEATHER</span>
                    </h2>
                    <p className="text-white/60 font-inter max-w-xl mx-auto text-lg mb-4">
                        Monitor solar activity, geomagnetic storms, and aurora forecasts
                    </p>

                    {/* Last Update & Refresh */}
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-xs font-mono text-white/40">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={fetchWeather}
                            disabled={isRefreshing}
                            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full" />
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
                            <Sun className="absolute inset-0 m-auto w-8 h-8 text-amber-400 animate-pulse" />
                        </div>
                        <span className="text-purple-400/60 font-mono text-sm">Fetching solar data...</span>
                    </div>
                ) : (
                    <>
                        {/* Main KP Index Display */}
                        <div className="mb-10">
                            <GlassPanel className="p-8 weather-card overflow-visible">
                                <div className="flex flex-col lg:flex-row items-center gap-10">
                                    {/* KP Gauge */}
                                    <div className="relative">
                                        {/* Outer ring */}
                                        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                                            {/* Background track */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="8"
                                            />
                                            {/* Value arc */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke={kpLevel.color}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(kpValue / 9) * 264} 264`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>

                                        {/* Center content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-orbitron font-black" style={{ color: kpLevel.color }}>
                                                {kpValue}
                                            </span>
                                            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                                                KP Index
                                            </span>
                                        </div>

                                        {/* Pulse ring effect */}
                                        {kpValue >= 5 && (
                                            <div className="absolute inset-0 rounded-full border-2 animate-pulse-ring" style={{ borderColor: kpLevel.color }} />
                                        )}
                                    </div>

                                    {/* KP Info */}
                                    <div className="flex-1 text-center lg:text-left">
                                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                            <span
                                                className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
                                                style={{ backgroundColor: `${kpLevel.color}20`, color: kpLevel.color }}
                                            >
                                                {kpLevel.label}
                                            </span>
                                            {kpValue >= 5 && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-mono">
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    STORM ACTIVE
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/60 text-lg mb-6">{kpLevel.desc}</p>

                                        {/* 24h History */}
                                        <div className="bg-black/30 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                                                    24-Hour History
                                                </span>
                                                <span className="text-xs font-mono text-white/40">
                                                    {weather?.kpIndex?.history?.length || 0} readings
                                                </span>
                                            </div>
                                            <div className="flex items-end gap-1 h-16">
                                                {(weather?.kpIndex?.history || Array(24).fill({ value: 2 })).slice(-24).map((point, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex-1 rounded-t transition-all duration-300 hover:opacity-100 opacity-80 cursor-pointer"
                                                        style={{
                                                            height: `${Math.max((point.value / 9) * 100, 8)}%`,
                                                            backgroundColor: KP_LEVELS.find(l => point.value >= l.min && point.value < l.max)?.color || "#22c55e",
                                                        }}
                                                        title={`KP: ${point.value}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>

                        {/* Weather Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Solar Wind Speed */}
                            <GlassPanel className="p-6 weather-card group hover:border-orange-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Wind className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div className={cn("flex items-center gap-1.5 text-xs font-mono", windStatus.color)}>
                                        <WindIcon className="w-3.5 h-3.5" />
                                        {windStatus.status}
                                    </div>
                                </div>
                                <h4 className="font-orbitron text-sm text-white/60 uppercase tracking-widest mb-2">
                                    Solar Wind
                                </h4>
                                <div className="text-3xl font-orbitron font-bold text-white">
                                    {Math.round(solarWindSpeed)}
                                    <span className="text-lg text-white/40 ml-1">km/s</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <span className="text-xs text-white/40">Density: </span>
                                    <span className="text-sm font-mono text-white/70">{solarWindDensity.toFixed(1)} p/cm³</span>
                                </div>
                            </GlassPanel>

                            {/* X-Ray Flux */}
                            <GlassPanel className="p-6 weather-card group hover:border-yellow-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Sun className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <span className="text-xs font-mono text-green-400">Active</span>
                                </div>
                                <h4 className="font-orbitron text-sm text-white/60 uppercase tracking-widest mb-2">
                                    X-Ray Flux
                                </h4>
                                <div className="text-2xl font-orbitron font-bold text-white">
                                    {weather?.xrayFlux?.level || "B-class"}
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <span className="text-xs text-white/40">Solar flare activity level</span>
                                </div>
                            </GlassPanel>

                            {/* Aurora Probability */}
                            <GlassPanel className="p-6 weather-card group hover:border-green-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Waves className="w-6 h-6 text-green-400" />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-mono",
                                        kpValue >= 4 ? "text-green-400" : "text-white/40"
                                    )}>
                                        {kpValue >= 4 ? "High" : kpValue >= 2 ? "Moderate" : "Low"}
                                    </span>
                                </div>
                                <h4 className="font-orbitron text-sm text-white/60 uppercase tracking-widest mb-2">
                                    Aurora Forecast
                                </h4>
                                <div className="text-2xl font-orbitron font-bold text-white">
                                    {kpValue >= 4 ? "Visible" : kpValue >= 2 ? "Possible" : "Unlikely"}
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <span className="text-xs text-white/40">
                                        {kpValue >= 4 ? "Mid-latitudes" : "Polar regions only"}
                                    </span>
                                </div>
                            </GlassPanel>

                            {/* Radio Status */}
                            <GlassPanel className="p-6 weather-card group hover:border-cyan-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Radio className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <span className="text-xs font-mono text-green-400">Normal</span>
                                </div>
                                <h4 className="font-orbitron text-sm text-white/60 uppercase tracking-widest mb-2">
                                    HF Radio
                                </h4>
                                <div className="text-2xl font-orbitron font-bold text-green-400">
                                    Clear
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <span className="text-xs text-white/40">No blackouts expected</span>
                                </div>
                            </GlassPanel>
                        </div>

                        {/* Conditions Summary */}
                        {weather?.summary && weather.summary.length > 0 && (
                            <div className="mt-8">
                                <GlassPanel className="p-6 weather-card border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-500/5 to-transparent">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                                            <Shield className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-orbitron text-lg text-white mb-3">Current Conditions Summary</h4>
                                            <ul className="space-y-2">
                                                {weather.summary.map((msg, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-white/70">
                                                        <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                                                        {msg}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function getFallbackWeather(): SpaceWeather {
    return {
        kpIndex: {
            current: 3,
            level: { level: "quiet", color: "#22c55e", description: "Quiet" },
            history: Array.from({ length: 24 }, (_, i) => ({
                time: new Date(Date.now() - i * 3600000).toISOString(),
                value: Math.floor(Math.random() * 4) + 1,
            })),
        },
        solarWind: {
            speed: 420,
            density: 5.2,
            history: [],
        },
        xrayFlux: {
            current: 1e-7,
            level: "B-class",
        },
        alerts: [],
        summary: [
            "Geomagnetic field is quiet (KP 3)",
            "Solar wind speed is nominal at 420 km/s",
            "No significant solar flare activity",
        ],
    };
}
