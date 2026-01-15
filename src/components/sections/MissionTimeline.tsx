"use client";

import { useRef, useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { missionsApi, Mission } from "@/lib/api/api-service";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Rocket,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Satellite,
    Globe,
    Telescope,
    X,
    Play,
} from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MISSION_TYPE_ICONS: Record<string, React.ElementType> = {
    "rover": Rocket,
    "orbiter": Satellite,
    "flyby": Globe,
    "telescope": Telescope,
    "crewed": Rocket,
    "default": Rocket,
};

const STATUS_CONFIG = {
    success: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500", label: "Success" },
    active: { icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500", label: "Active", pulse: true },
    scheduled: { icon: Calendar, color: "text-amber-400", bg: "bg-amber-500", label: "Scheduled" },
    failed: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500", label: "Failed" },
};

export function MissionTimeline() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMissions() {
            try {
                const response = await missionsApi.getAll();
                if (response.success && response.data) {
                    const allMissions = [
                        ...response.data.nasa,
                        ...response.data.spacex.slice(0, 8),
                    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setMissions(allMissions);
                } else {
                    setMissions(getFallbackMissions());
                }
            } catch (error) {
                setMissions(getFallbackMissions());
            } finally {
                setLoading(false);
            }
        }
        fetchMissions();
    }, []);

    useEffect(() => {
        if (!loading && sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll(".mission-card");
            gsap.fromTo(
                cards,
                { opacity: 0, x: 60, scale: 0.9, rotateY: -15 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    rotateY: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                }
            );
        }
    }, [loading]);

    const scrollTimeline = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const filteredMissions = filterStatus
        ? missions.filter((m) => m.status === filterStatus)
        : missions;

    const getStatusConfig = (status: string) => STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.scheduled;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getMissionIcon = (mission: Mission) => {
        const type = mission.type?.toLowerCase() || "default";
        for (const [key, Icon] of Object.entries(MISSION_TYPE_ICONS)) {
            if (type.includes(key)) return Icon;
        }
        return MISSION_TYPE_ICONS.default;
    };

    return (
        <div ref={sectionRef} className="w-full min-h-screen py-24 px-6 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-full mb-6">
                            <Rocket className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
                                Space Exploration
                            </span>
                        </div>
                        <h2 className="font-orbitron font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
                            MISSION <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">CONTROL</span>
                        </h2>
                        <p className="text-white/60 font-inter max-w-xl text-lg">
                            Track past, current, and upcoming space missions from NASA and SpaceX
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterStatus(null)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all",
                                    filterStatus === null
                                        ? "bg-white/20 text-white"
                                        : "bg-white/5 text-white/50 hover:bg-white/10"
                                )}
                            >
                                All
                            </button>
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterStatus(key)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5",
                                        filterStatus === key
                                            ? `${config.bg}/20 ${config.color}`
                                            : "bg-white/5 text-white/50 hover:bg-white/10"
                                    )}
                                >
                                    <config.icon className="w-3.5 h-3.5" />
                                    {config.label}
                                </button>
                            ))}
                        </div>

                        {/* Scroll Controls */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollTimeline("left")}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => scrollTimeline("right")}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                        </div>
                        <span className="text-cyan-400/60 font-mono text-sm">Loading missions...</span>
                    </div>
                ) : (
                    <>
                        {/* Timeline Line */}
                        <div className="relative mb-8">
                            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50" />
                        </div>

                        {/* Mission Count */}
                        <div className="text-center mb-8">
                            <span className="text-sm font-mono text-white/40">
                                Showing {filteredMissions.length} of {missions.length} missions
                            </span>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                        >
                            {filteredMissions.map((mission, i) => {
                                const statusConfig = getStatusConfig(mission.status);
                                const MissionIcon = getMissionIcon(mission);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={mission.id} className="snap-center shrink-0">
                                        <GlassPanel
                                            className={cn(
                                                "w-[340px] h-[440px] mission-card relative group cursor-pointer transition-all duration-500",
                                                "hover:scale-[1.02] hover:shadow-2xl",
                                                `hover:${statusConfig.bg}/20`
                                            )}
                                            onClick={() => setSelectedMission(mission)}
                                        >
                                            {/* Status Stripe */}
                                            <div className={cn("absolute top-0 left-0 w-full h-1 rounded-t-xl", statusConfig.bg)} />

                                            <div className="p-6 h-full flex flex-col">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                        "bg-gradient-to-br from-white/10 to-white/5 border border-white/10",
                                                        "group-hover:scale-110 transition-transform duration-500"
                                                    )}>
                                                        <MissionIcon className={cn("w-7 h-7", statusConfig.color)} />
                                                    </div>
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase",
                                                        `${statusConfig.bg}/20 ${statusConfig.color}`
                                                    )}>
                                                        <StatusIcon className={cn("w-3.5 h-3.5", statusConfig.pulse && "animate-pulse")} />
                                                        {statusConfig.label}
                                                    </div>
                                                </div>

                                                {/* Mission Info */}
                                                <div className="flex-1">
                                                    <span className="text-5xl font-black text-white/10 font-orbitron absolute top-4 right-6">
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>

                                                    <h3 className="text-2xl font-orbitron text-white mb-2 group-hover:text-cyan-400 transition-colors pr-12">
                                                        {mission.name}
                                                    </h3>
                                                    <p className="text-sm font-mono text-white/50 mb-4">
                                                        {mission.type || mission.source.toUpperCase()}
                                                    </p>

                                                    {mission.details && (
                                                        <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">
                                                            {mission.details}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                                    <div>
                                                        <span className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
                                                            {new Date(mission.date) > new Date() ? "Launch Date" : "Launched"}
                                                        </span>
                                                        <span className="text-lg font-orbitron font-bold text-white">
                                                            {formatDate(mission.date)}
                                                        </span>
                                                    </div>
                                                    <span className={cn(
                                                        "px-3 py-1.5 text-xs font-bold uppercase rounded-lg border",
                                                        mission.source === "nasa"
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                                            : "bg-white/5 text-white/60 border-white/10"
                                                    )}>
                                                        {mission.source}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Hover Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
                                        </GlassPanel>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mission Modal */}
                        {selectedMission && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                                onClick={() => setSelectedMission(null)}
                            >
                                <GlassPanel
                                    className="max-w-lg w-full p-0 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Modal Header */}
                                    <div className={cn(
                                        "p-6 border-b border-white/10",
                                        `bg-gradient-to-r from-${getStatusConfig(selectedMission.status).bg}/20 to-transparent`
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-orbitron text-2xl text-white mb-2">
                                                    {selectedMission.name}
                                                </h3>
                                                <p className="text-sm text-white/60">
                                                    {selectedMission.type || selectedMission.source.toUpperCase()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedMission(null)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5 text-white/60" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="p-6">
                                        {selectedMission.details && (
                                            <p className="text-white/70 mb-6 leading-relaxed">{selectedMission.details}</p>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                <span className="text-xs text-white/40 uppercase block mb-1">Date</span>
                                                <p className="text-white font-mono">
                                                    {formatDate(selectedMission.date)}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                <span className="text-xs text-white/40 uppercase block mb-1">Source</span>
                                                <p className="text-white font-mono uppercase">{selectedMission.source}</p>
                                            </div>
                                        </div>

                                        {selectedMission.links?.webcast && (
                                            <a
                                                href={selectedMission.links.webcast}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-orbitron text-sm uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                            >
                                                <Play className="w-4 h-4" />
                                                Watch Launch
                                            </a>
                                        )}
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

function getFallbackMissions(): Mission[] {
    return [
        { id: "artemis-2", name: "Artemis II", date: "2025-09-01T00:00:00Z", status: "scheduled", type: "Crewed Lunar Flyby", details: "First crewed Artemis mission, sending astronauts around the Moon", source: "nasa" },
        { id: "europa-clipper", name: "Europa Clipper", date: "2024-10-14T00:00:00Z", status: "active", type: "Jovian Orbiter", details: "Detailed reconnaissance of Jupiter's moon Europa", source: "nasa" },
        { id: "jwst", name: "James Webb Space Telescope", date: "2021-12-25T00:00:00Z", status: "active", type: "Space Telescope", details: "Most powerful space telescope ever built", source: "nasa" },
        { id: "perseverance", name: "Perseverance Rover", date: "2021-02-18T00:00:00Z", status: "active", type: "Mars Rover", details: "Searching for signs of ancient microbial life", source: "nasa" },
        { id: "starship-1", name: "Starship IFT-6", date: "2024-11-19T00:00:00Z", status: "success", type: "Test Flight", details: "Sixth integrated flight test of Starship", source: "spacex" },
        { id: "psyche", name: "Psyche", date: "2023-10-13T00:00:00Z", status: "active", type: "Asteroid Probe", details: "Journey to a unique metal asteroid", source: "nasa" },
        { id: "dragonfly", name: "Dragonfly", date: "2028-06-01T00:00:00Z", status: "scheduled", type: "Titan Rotorcraft", details: "Exploring Saturn's largest moon", source: "nasa" },
        { id: "mars-sample-return", name: "Mars Sample Return", date: "2027-01-01T00:00:00Z", status: "scheduled", type: "Sample Return", details: "Bringing Martian samples back to Earth", source: "nasa" },
    ];
}
