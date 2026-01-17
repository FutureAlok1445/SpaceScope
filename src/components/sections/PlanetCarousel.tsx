'use client';

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
// Import from new subdirectory
import Experience from './planet-carousel/Experience';
import Planet from './planet-carousel/Planet';
import UIOverlay from './planet-carousel/UIOverlay';
import PlanetLoader from './planet-carousel/PlanetLoader';

// Original CSS module for container styles if needed, though we use inline mostly
import styles from './PlanetCarousel.module.css';

const PLANETS = [
    {
        id: 'mercury',
        name: 'MERCURY',
        description: 'The Swift Planet. A sun-scorched world of extremes, where temperatures swing wildly on a cratered surface stripped of atmosphere. It stands as a silent sentinel closest to the star.',
        color: '#E0E0E0',
        model: '/models/mercury.glb', // Corrected path for spacescope
        scale: 0.03, // Adjusted scale logic? Source used 1 for Mercury
        orbitSpeed: '47.87 km/s',
        distance: '57.9 million km'
    },
    {
        id: 'earth',
        name: 'EARTH',
        description: 'The Cradle of Life. A vibrant oasis in the cosmic void, shielded by a magnetic field and teeming with biodiversity. It is the only known harbor of life in the universe.',
        color: '#4FACFE',
        model: '/models/earth.glb', // Corrected path
        scale: 0.005, // Source scale
        orbitSpeed: '29.78 km/s',
        distance: '149.6 million km'
    },
    {
        id: 'mars',
        name: 'MARS',
        description: 'The Red Frontier. A cold, rust-colored desert holding ancient secrets of water and the promise of future human expansion. Its dust storms engulf the entire planet.',
        color: '#FF6B6B',
        model: '/models/mars.glb', // Corrected path
        scale: 0.5, // Source was 0.5, but spacescope models scale different? Keeping similar to source for now but mindful of 0.2 logic earlier
        orbitSpeed: '24.07 km/s',
        distance: '227.9 million km'
    },
    {
        id: 'jupiter',
        name: 'JUPITER',
        description: 'The Gas Giant. A colossal storm-wracked world, shielding the inner system with its immense gravity field. Its Great Red Spot has raged for centuries.',
        color: '#F4D03F',
        model: '/models/realistic_jupiter.glb', // Corrected path
        scale: 0.04, // Estimating scale for gas giant
        orbitSpeed: '13.07 km/s',
        distance: '778.5 million km'
    }
];

export default function PlanetCarousel() {
    const [currentIndex, setCurrentIndex] = useState(1); // Start with Earth
    const [isTransitioning, setIsTransitioning] = useState(false);
    const planetRefs = useRef<(THREE.Group | null)[]>([]);

    const handleNext = () => {
        if (isTransitioning) return;
        const nextIndex = (currentIndex + 1) % PLANETS.length;
        animateTransition(currentIndex, nextIndex, 1);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        const prevIndex = (currentIndex - 1 + PLANETS.length) % PLANETS.length;
        animateTransition(currentIndex, prevIndex, -1);
    };

    const animateTransition = (fromIndex: number, toIndex: number, direction: number) => {
        setIsTransitioning(true);

        const fromPlanet = planetRefs.current[fromIndex];
        const toPlanet = planetRefs.current[toIndex];

        if (!fromPlanet || !toPlanet) return;

        // Animate OUT
        gsap.to(fromPlanet.position, {
            x: -direction * 20,
            z: -10,
            duration: 1.5,
            ease: 'power3.inOut',
        });
        gsap.to(fromPlanet.scale, {
            x: 0, y: 0, z: 0,
            duration: 1.5,
            ease: 'power3.inOut',
        });

        // Prepare IN
        const targetScale = PLANETS[toIndex].scale;
        toPlanet.position.set(direction * 20, 0, -10);
        toPlanet.scale.set(0, 0, 0);

        // Animate IN
        gsap.to(toPlanet.position, {
            x: 5,
            z: 0,
            duration: 1.5,
            ease: 'power3.inOut',
        });
        gsap.to(toPlanet.scale, {
            x: targetScale, y: targetScale, z: targetScale,
            duration: 1.5,
            ease: 'power3.inOut',
            onComplete: () => {
                setCurrentIndex(toIndex);
                setIsTransitioning(false);
            }
        });
    };

    // derived state for UI
    const currentPlanet = PLANETS[currentIndex];
    const prevPlanet = PLANETS[(currentIndex - 1 + PLANETS.length) % PLANETS.length];
    const nextPlanet = PLANETS[(currentIndex + 1) % PLANETS.length];

    return (
        <div className={styles.container}>
            <UIOverlay
                currentPlanet={currentPlanet}
                prevPlanetName={prevPlanet.name}
                nextPlanetName={nextPlanet.name}
                onNext={handleNext}
                onPrev={handlePrev}
                isTransitioning={isTransitioning}
            />

            <div style={{ width: '100vw', height: '100vh' }}>
                <Canvas camera={{ position: [0, 0, 20], fov: 35 }} shadows>
                    <Experience>
                        <Suspense fallback={<PlanetLoader />}>
                            {PLANETS.map((planet, index) => {
                                const isActive = index === currentIndex;
                                const targetScale = planet.scale;
                                const initialScale = isActive ? targetScale : 0;

                                return (
                                    <group
                                        key={planet.id}
                                        ref={(el) => { planetRefs.current[index] = el; }}
                                        scale={[initialScale, initialScale, initialScale]}
                                        position={isActive ? [5, 0, 0] : [0, 0, -50]}
                                    >
                                        <Planet
                                            id={planet.id}
                                            color={planet.color}
                                            modelPath={planet.model}
                                            position={[0, 0, 0]}
                                        />
                                    </group>
                                );
                            })}
                        </Suspense>
                    </Experience>
                </Canvas>
            </div>
        </div>
    );
}
