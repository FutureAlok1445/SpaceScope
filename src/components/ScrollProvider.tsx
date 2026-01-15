"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollProviderProps {
    children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP's ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Add Lenis to GSAP ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Cleanup
        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, []);

    return <>{children}</>;
}

// Custom hook to access Lenis instance
export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);
    return lenisRef.current;
}

// Animation utilities
export const gsapAnimations = {
    fadeInUp: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
            element,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay,
                ease: "power3.out",
            }
        );
    },

    fadeInLeft: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
            element,
            { opacity: 0, x: -60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                delay,
                ease: "power3.out",
            }
        );
    },

    fadeInRight: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
            element,
            { opacity: 0, x: 60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                delay,
                ease: "power3.out",
            }
        );
    },

    scaleIn: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
            element,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay,
                ease: "back.out(1.7)",
            }
        );
    },

    staggerFadeIn: (elements: string | Element[], stagger = 0.1) => {
        return gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger,
                ease: "power3.out",
            }
        );
    },

    createScrollTrigger: (
        element: string | Element,
        animation: gsap.core.Tween,
        options: ScrollTrigger.Vars = {}
    ) => {
        return ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            animation,
            toggleActions: "play none none reverse",
            ...options,
        });
    },

    parallax: (element: string | Element, speed = 0.5) => {
        return gsap.to(element, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    },

    horizontalScroll: (container: string | Element, sections: string | Element) => {
        const containerEl = typeof container === "string"
            ? document.querySelector(container)
            : container;

        if (!containerEl) return null;

        const sectionsEl = containerEl.querySelectorAll(sections as string);
        const totalWidth = (sectionsEl.length - 1) * 100;

        return gsap.to(sectionsEl, {
            xPercent: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                snap: 1 / (sectionsEl.length - 1),
                end: () => "+=" + (containerEl as HTMLElement).offsetWidth,
            },
        });
    },
};

export { gsap, ScrollTrigger };
