"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { Rocket, Sparkles, ChevronDown, Radio, Users, Globe2 } from "lucide-react";

// Dynamically import 3D component to avoid SSR issues
const OrbitalNexus = dynamic(() => import("@/components/3d/OrbitalNexus"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-black" />,
});

interface StatItem {
    icon: React.ElementType;
    value: string;
    label: string;
    color: string;
}

const STATS: StatItem[] = [
    { icon: Rocket, value: "200+", label: "Active Missions", color: "text-cyan-400" },
    { icon: Globe2, value: "24/7", label: "Earth Monitoring", color: "text-green-400" },
    { icon: Users, value: "7", label: "ISS Crew", color: "text-amber-400" },
    { icon: Radio, value: "Live", label: "Data Feeds", color: "text-purple-400" },
];

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);

        const ctx = gsap.context(() => {
            // Staggered text animation
            gsap.fromTo(
                ".hero-animate",
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    stagger: 0.15,
                    delay: 0.3,
                    ease: "power3.out",
                }
            );

            // Stats animation
            gsap.fromTo(
                ".stat-item",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 1,
                    ease: "power2.out",
                }
            );

            // Floating animation for decorative elements
            gsap.to(".float-element", {
                y: -15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.5,
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div ref={heroRef} className="relative w-full h-screen overflow-hidden">
            {/* 3D Background */}
            <div className="absolute inset-0">
                <OrbitalNexus />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,200,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
                <div ref={textRef} className="text-center max-w-5xl">
                    {/* Badge */}
                    <div className="hero-animate mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
                                Real-Time Space Intelligence
                            </span>
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="hero-animate font-orbitron font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight leading-tight">
                        <span className="block">SPACE</span>
                        <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            SCOPE
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="hero-animate text-lg md:text-xl lg:text-2xl text-white/60 font-inter mb-4 max-w-2xl mx-auto leading-relaxed">
                        Explore, Learn & Stay Connected with the Universe
                    </p>

                    <p className="hero-animate text-sm md:text-base text-white/40 font-inter mb-10 max-w-xl mx-auto">
                        Real-time cosmic weather • Live ISS tracking • Space mission updates • Interactive learning
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button
                            onClick={() => scrollToSection("dashboard")}
                            className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-orbitron font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Explore Now
                        </button>

                        <button
                            onClick={() => scrollToSection("academy")}
                            className="px-8 py-4 border border-white/20 text-white font-orbitron font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-3"
                        >
                            <Sparkles className="w-5 h-5" />
                            Start Learning
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {STATS.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="stat-item flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                    <div className="text-left">
                                        <div className="text-lg font-orbitron font-bold text-white">{stat.value}</div>
                                        <div className="text-xs text-white/50 font-mono">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Scroll to explore</span>
                    <div className="w-8 h-12 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
                        <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-cyan-500/20 float-element" />
            <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-purple-500/20 float-element" />
            <div className="absolute bottom-24 left-8 w-24 h-24 border-l-2 border-b-2 border-cyan-500/20 float-element" />
            <div className="absolute bottom-24 right-8 w-24 h-24 border-r-2 border-b-2 border-purple-500/20 float-element" />

            {/* Side Accents */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
        </div>
    );
}
