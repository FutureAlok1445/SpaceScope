"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Sky Events" },
    { id: "weather", label: "Cosmic Weather" },
    { id: "missions", label: "Missions" },
    { id: "earth", label: "Earth Impact" },
    { id: "academy", label: "Academy" },
];

export default function Navigation() {
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = NAV_ITEMS.map((item) => ({
                id: item.id,
                offset: document.getElementById(item.id)?.offsetTop || 0,
            }));

            const scrollPosition = window.scrollY + 200;

            for (let i = sections.length - 1; i >= 0; i--) {
                if (scrollPosition >= sections[i].offset) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setMobileMenuOpen(false);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection("home")}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/50 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                        <span className="font-orbitron font-bold text-xl tracking-widest text-white">
                            SPACESCOPE
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={cn(
                                    "px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full transition-all duration-300",
                                    activeSection === item.id
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Live Status Indicator */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-green-400">LIVE</span>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        "px-4 py-3 text-left text-sm font-mono uppercase tracking-widest rounded-lg transition-all",
                                        activeSection === item.id
                                            ? "bg-cyan-500/20 text-cyan-400"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
