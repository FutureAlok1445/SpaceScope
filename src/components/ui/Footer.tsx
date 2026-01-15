"use client";

export default function Footer() {
    return (
        <footer className="relative bg-black border-t border-white/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/50 rounded-full">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                            </div>
                            <span className="font-orbitron font-bold text-xl tracking-widest text-white">
                                SPACESCOPE
                            </span>
                        </div>
                        <p className="text-white/60 font-inter max-w-md leading-relaxed">
                            Your gateway to the cosmos. Explore real-time space data, track celestial events,
                            and discover how satellites help solve Earth's challenges.
                        </p>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-widest mb-4">
                            Data Sources
                        </h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">NASA DONKI API</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">NOAA Space Weather</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">SpaceX API</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Open-Notify ISS</li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-widest mb-4">
                            Features
                        </h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Celestial Events</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Aurora Forecast</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Mission Timeline</li>
                            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Space Academy</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-white/40 font-mono">
                        © 2026 SpaceScope. Built for CodeBytes Hackathon.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-xs font-mono text-green-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        </footer>
    );
}
