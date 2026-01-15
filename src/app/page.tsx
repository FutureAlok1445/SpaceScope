"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BootSequence } from "@/components/3d/BootSequence";
import { WormholeTransition } from "@/components/3d/WormholeTransition";
import { PortalIris } from "@/components/3d/PortalIris";
import HeroSection from "@/components/sections/HeroSection";
import { SkyEventsCinema } from "@/components/sections/SkyEventsCinema";
import CosmicWeather from "@/components/sections/CosmicWeather";
import { MissionTimeline } from "@/components/sections/MissionTimeline";
import { EarthImpactSim } from "@/components/sections/EarthImpactSim";
import { Academy } from "@/components/sections/Academy";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type BootState = "boot" | "wormhole" | "portal" | "ready";

export default function Home() {
  const [bootState, setBootState] = useState<BootState>("boot");
  const mainRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    if (bootState === "boot") {
      const timer = setTimeout(() => setBootState("wormhole"), 3000);
      return () => clearTimeout(timer);
    } else if (bootState === "wormhole") {
      const timer = setTimeout(() => setBootState("portal"), 4200);
      return () => clearTimeout(timer);
    } else if (bootState === "portal") {
      const timer = setTimeout(() => setBootState("ready"), 2000);
      return () => clearTimeout(timer);
    }
  }, [bootState]);

  // GSAP Animations after boot
  useEffect(() => {
    if (bootState !== "ready") return;

    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>(".animate-section").forEach((section, i) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Parallax effect for backgrounds
      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((bg) => {
        gsap.to(bg, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: bg.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Stagger animations for cards
      gsap.utils.toArray<HTMLElement>(".stagger-container").forEach((container) => {
        const cards = container.querySelectorAll(".stagger-item");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
            },
          }
        );
      });

      // Text reveal animations
      gsap.utils.toArray<HTMLElement>(".text-reveal").forEach((text) => {
        gsap.fromTo(
          text,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [bootState]);

  // Boot sequence overlays
  if (bootState === "boot") {
    return <BootSequence onComplete={() => setBootState("wormhole")} />;
  }

  if (bootState === "wormhole") {
    return (
      <div className="fixed inset-0 z-50">
        <WormholeTransition onComplete={() => setBootState("portal")} />
      </div>
    );
  }

  if (bootState === "portal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <PortalIris onComplete={() => setBootState("ready")} />
      </div>
    );
  }

  return (
    <main ref={mainRef} className="relative bg-transparent">
      {/* Fixed Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative">
        <HeroSection />
      </section>

      {/* Sky Events Dashboard */}
      <section id="dashboard" className="min-h-screen relative animate-section">
        <div className="absolute inset-0 parallax-bg bg-gradient-to-b from-black/80 via-indigo-950/20 to-black/80" />
        <div className="relative z-10">
          <SkyEventsCinema />
        </div>
      </section>

      {/* Cosmic Weather */}
      <section id="weather" className="min-h-screen relative animate-section">
        <div className="absolute inset-0 parallax-bg bg-gradient-to-b from-black/80 via-purple-950/20 to-black/80" />
        <div className="relative z-10">
          <CosmicWeather />
        </div>
      </section>

      {/* Mission Timeline */}
      <section id="missions" className="min-h-screen relative animate-section">
        <div className="absolute inset-0 parallax-bg bg-gradient-to-b from-black/80 via-cyan-950/10 to-black/80" />
        <div className="relative z-10">
          <MissionTimeline />
        </div>
      </section>

      {/* Earth Impact Simulation */}
      <section id="earth" className="min-h-screen relative animate-section">
        <div className="absolute inset-0 parallax-bg bg-gradient-to-b from-black/80 via-emerald-950/20 to-black/80" />
        <div className="relative z-10">
          <EarthImpactSim />
        </div>
      </section>

      {/* Academy Learning Zone */}
      <section id="academy" className="min-h-screen relative animate-section">
        <div className="absolute inset-0 parallax-bg bg-gradient-to-b from-black/80 via-amber-950/10 to-black/80" />
        <div className="relative z-10">
          <Academy />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
