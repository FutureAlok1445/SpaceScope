"use client";

import { useState, useEffect, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import {
    Leaf,
    Thermometer,
    CloudRain,
    Flame,
    Wind,
    Waves,
    Factory,
    Satellite,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Info,
    ChevronDown,
} from "lucide-react";

interface Scenario {
    id: string;
    title: string;
    location: string;
    icon: React.ElementType;
    color: string;
    bgGradient: string;
    satellite: string;
    data: { year: string; value: number }[];
    description: string;
    impact: string;
    beforeLabel: string;
    afterLabel: string;
    beforeColor: string;
    afterColor: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: "deforestation",
        title: "Deforestation Watch",
        location: "Amazon Rainforest, Brazil",
        icon: Leaf,
        color: "#10b981",
        bgGradient: "from-emerald-600/20 to-green-600/20",
        satellite: "Landsat 9 / Sentinel-2",
        data: [
            { year: "2019", value: 100 },
            { year: "2020", value: 92 },
            { year: "2021", value: 86 },
            { year: "2022", value: 80 },
            { year: "2023", value: 75 },
            { year: "2024", value: 72 },
        ],
        description: "Satellite NDVI data reveals 28% canopy loss over 5 years. Real-time monitoring helps track illegal logging and enforce conservation policies.",
        impact: "3.2M hectares monitored annually",
        beforeLabel: "2019 (Healthy)",
        afterLabel: "2024 (Degraded)",
        beforeColor: "from-emerald-700 to-green-500",
        afterColor: "from-amber-800 to-orange-700",
    },
    {
        id: "glacier",
        title: "Glacier Meltdown",
        location: "Greenland Ice Sheet",
        icon: Thermometer,
        color: "#3b82f6",
        bgGradient: "from-blue-600/20 to-cyan-600/20",
        satellite: "ICESat-2 / GRACE-FO",
        data: [
            { year: "2019", value: 100 },
            { year: "2020", value: 95 },
            { year: "2021", value: 89 },
            { year: "2022", value: 83 },
            { year: "2023", value: 78 },
            { year: "2024", value: 74 },
        ],
        description: "Laser altimetry shows 3.2m ice thickness loss since 2019. Critical data for sea level rise predictions and climate models.",
        impact: "280 billion tons ice loss/year",
        beforeLabel: "2019 (Intact)",
        afterLabel: "2024 (Melted)",
        beforeColor: "from-cyan-300 to-blue-300",
        afterColor: "from-blue-600 to-indigo-800",
    },
    {
        id: "wildfire",
        title: "Wildfire Detection",
        location: "California, USA",
        icon: Flame,
        color: "#ef4444",
        bgGradient: "from-red-600/20 to-orange-600/20",
        satellite: "MODIS / VIIRS",
        data: [
            { year: "2019", value: 45 },
            { year: "2020", value: 78 },
            { year: "2021", value: 62 },
            { year: "2022", value: 55 },
            { year: "2023", value: 89 },
            { year: "2024", value: 67 },
        ],
        description: "Thermal imaging detects fires within 15 minutes of ignition. Enables rapid response and evacuation planning.",
        impact: "2,500+ fires detected in 2024",
        beforeLabel: "Before Fire",
        afterLabel: "Active Fire",
        beforeColor: "from-green-600 to-green-400",
        afterColor: "from-orange-600 to-red-700",
    },
    {
        id: "pollution",
        title: "Air Quality Monitor",
        location: "Delhi NCR, India",
        icon: Factory,
        color: "#a855f7",
        bgGradient: "from-purple-600/20 to-violet-600/20",
        satellite: "Sentinel-5P / TROPOMI",
        data: [
            { year: "2019", value: 85 },
            { year: "2020", value: 45 },
            { year: "2021", value: 72 },
            { year: "2022", value: 78 },
            { year: "2023", value: 82 },
            { year: "2024", value: 76 },
        ],
        description: "NO2 and PM2.5 concentrations tracked from space. Visible improvement during 2020 lockdowns proved human impact on air quality.",
        impact: "AQI predictions 48hrs ahead",
        beforeLabel: "Clear Day",
        afterLabel: "Polluted Day",
        beforeColor: "from-sky-400 to-blue-300",
        afterColor: "from-amber-600 to-gray-500",
    },
    {
        id: "flood",
        title: "Flood Mapping",
        location: "Bangladesh Delta",
        icon: CloudRain,
        color: "#06b6d4",
        bgGradient: "from-cyan-600/20 to-teal-600/20",
        satellite: "Sentinel-1 SAR",
        data: [
            { year: "2019", value: 32 },
            { year: "2020", value: 45 },
            { year: "2021", value: 58 },
            { year: "2022", value: 67 },
            { year: "2023", value: 72 },
            { year: "2024", value: 78 },
        ],
        description: "Radar imaging works through clouds to map flood extent in real-time. Critical for disaster response and relief coordination.",
        impact: "15M people in flood zones tracked",
        beforeLabel: "Pre-Monsoon",
        afterLabel: "Flood Extent",
        beforeColor: "from-green-500 to-emerald-400",
        afterColor: "from-blue-600 to-cyan-400",
    },
];

export function EarthImpactSim() {
    const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
    const [sliderValue, setSliderValue] = useState(50);
    const [showInfo, setShowInfo] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const bars = chartRef.current.querySelectorAll(".chart-bar");
            gsap.fromTo(
                bars,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "back.out(1.7)",
                    transformOrigin: "bottom",
                }
            );
        }
    }, [activeScenario]);

    const Icon = activeScenario.icon;
    const latestValue = activeScenario.data[activeScenario.data.length - 1].value;
    const firstValue = activeScenario.data[0].value;
    const changePercent = ((latestValue - firstValue) / firstValue * 100).toFixed(1);
    const isPositiveChange = parseFloat(changePercent) > 0;

    return (
        <div ref={sectionRef} className="w-full min-h-screen py-24 px-6 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${activeScenario.color}10` }} />
                <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `${activeScenario.color}08` }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-full mb-6">
                        <Satellite className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">
                            Satellite Applications
                        </span>
                    </div>
                    <h2 className="font-orbitron font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
                        EARTH <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">IMPACT</span>
                    </h2>
                    <p className="text-white/60 font-inter max-w-xl mx-auto text-lg">
                        See how satellite data helps solve real-world problems
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Scenario Selection */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Scenario Cards */}
                        <GlassPanel className="p-6">
                            <h3 className="font-orbitron text-sm text-white uppercase tracking-widest mb-4">
                                Select Application
                            </h3>
                            <div className="space-y-3">
                                {SCENARIOS.map((scenario) => {
                                    const ScenarioIcon = scenario.icon;
                                    const isActive = activeScenario.id === scenario.id;
                                    return (
                                        <button
                                            key={scenario.id}
                                            onClick={() => setActiveScenario(scenario)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left group",
                                                isActive
                                                    ? "border-white/30 bg-white/10"
                                                    : "border-white/10 hover:bg-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                    isActive ? "scale-110" : ""
                                                )}
                                                style={{ backgroundColor: `${scenario.color}20` }}
                                            >
                                                <ScenarioIcon className="w-6 h-6" style={{ color: scenario.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={cn(
                                                    "font-orbitron text-sm transition-colors truncate",
                                                    isActive ? "text-white" : "text-white/80"
                                                )}>
                                                    {scenario.title}
                                                </h4>
                                                <p className="text-xs text-white/50 truncate">{scenario.location}</p>
                                            </div>
                                            <ArrowRight className={cn(
                                                "w-4 h-4 transition-all",
                                                isActive ? "text-white translate-x-0" : "text-white/30 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                                            )} />
                                        </button>
                                    );
                                })}
                            </div>
                        </GlassPanel>

                        {/* Trend Analysis */}
                        <GlassPanel className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-orbitron text-sm text-white uppercase tracking-widest">
                                    Trend Analysis
                                </h3>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-mono",
                                    isPositiveChange ? "text-red-400" : "text-green-400"
                                )}>
                                    {isPositiveChange ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                    {isPositiveChange ? "+" : ""}{changePercent}%
                                </div>
                            </div>
                            <div ref={chartRef} className="h-32 flex items-end justify-between gap-2">
                                {activeScenario.data.map((point, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="chart-bar w-full rounded-t-lg transition-all hover:opacity-100 opacity-80"
                                            style={{
                                                height: `${point.value}%`,
                                                backgroundColor: activeScenario.color,
                                                opacity: 0.5 + (idx / activeScenario.data.length) * 0.5,
                                            }}
                                        />
                                        <span className="text-xs text-white/40 mt-2 font-mono">
                                            {point.year.slice(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <Satellite className="w-3.5 h-3.5" />
                                    <span>Data: {activeScenario.satellite}</span>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Right Panel: Visualization */}
                    <div className="lg:col-span-2">
                        <GlassPanel className="h-full overflow-hidden">
                            {/* Before/After Comparison */}
                            <div className="relative aspect-video overflow-hidden">
                                {/* After State (Background) */}
                                <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-700", activeScenario.afterColor)}>
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMEw2MCA2ME02MCAwTDAgNjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-8xl md:text-9xl font-black text-white/5 font-orbitron select-none">
                                            {activeScenario.afterLabel.split(" ")[0]}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-white/70">
                                        {activeScenario.afterLabel}
                                    </div>
                                </div>

                                {/* Before State (Clipped) */}
                                <div
                                    className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-700", activeScenario.beforeColor)}
                                    style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                                >
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMEw2MCA2ME02MCAwTDAgNjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-8xl md:text-9xl font-black text-white/5 font-orbitron select-none">
                                            {activeScenario.beforeLabel.split(" ")[0]}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-white/70">
                                        {activeScenario.beforeLabel}
                                    </div>

                                    {/* Divider Line */}
                                    <div className="absolute top-0 right-0 w-1 h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                                </div>

                                {/* Info Overlays */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                                        <span className="text-xs text-white/50 block mb-1">Monitoring Satellite</span>
                                        <span className="text-sm text-white font-mono">{activeScenario.satellite}</span>
                                    </div>
                                    <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                                        <span className="text-xs text-white/50 block mb-1">Annual Impact</span>
                                        <span className="text-sm font-mono" style={{ color: activeScenario.color }}>
                                            {activeScenario.impact}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Slider Control */}
                            <div className="p-6 border-t border-white/10 bg-black/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-orbitron text-white/80">PAST</span>
                                        <span className="text-lg font-mono font-bold" style={{ color: activeScenario.color }}>
                                            {sliderValue}%
                                        </span>
                                    </div>
                                    <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${sliderValue}%`, backgroundColor: activeScenario.color }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-mono font-bold" style={{ color: activeScenario.color }}>
                                            {100 - sliderValue}%
                                        </span>
                                        <span className="text-sm font-orbitron text-white/80">PRESENT</span>
                                    </div>
                                </div>
                                <Slider
                                    value={sliderValue}
                                    onValueChange={setSliderValue}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Description */}
                            <div className="p-6 border-t border-white/10">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${activeScenario.color}20` }}
                                    >
                                        <Icon className="w-7 h-7" style={{ color: activeScenario.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-orbitron text-xl text-white mb-2">
                                            {activeScenario.title}
                                        </h4>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {activeScenario.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}
