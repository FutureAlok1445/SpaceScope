"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useISSPosition } from "@/lib/hooks/useISSPosition";
import { latLonAltToXYZ } from "@/lib/utils/orbit-math";
import * as THREE from "three";

export function ISSMarker() {
    const ref = useRef<THREE.Group>(null);
    const { position, loading } = useISSPosition(5000); // Update every 5 seconds
    const [displayPosition, setDisplayPosition] = useState({ lat: 0, lon: 0, alt: 408 });

    // Update display position when real data arrives
    useEffect(() => {
        if (position && !loading) {
            setDisplayPosition({
                lat: position.latitude,
                lon: position.longitude,
                alt: position.altitude,
            });
        }
    }, [position, loading]);

    // Earth radius in scene units (2 units = 6371 km)
    const earthRadiusScene = 2;
    const scaleFactor = earthRadiusScene / 6371; // km to scene units

    useFrame(() => {
        if (ref.current) {
            // Convert lat/lon/alt to 3D position
            const scenePos = latLonAltToXYZ(
                displayPosition.lat,
                displayPosition.lon,
                displayPosition.alt,
                6371 // Earth radius in km
            );

            // Scale to scene units and position
            ref.current.position.set(
                scenePos.x * scaleFactor,
                scenePos.y * scaleFactor,
                scenePos.z * scaleFactor
            );
            ref.current.lookAt(0, 0, 0); // Always face earth center (nadir)
        }
    });

    return (
        <group ref={ref}>
            {/* 3D Model Placeholder (Yellow Box) */}
            <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.3]} />
                <meshStandardMaterial color="#FFaa00" emissive="#FFaa00" emissiveIntensity={0.5} />
            </mesh>

            {/* Label Overlay */}
            <Html position={[0.2, 0.2, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
                <div className="flex items-center gap-2 pointer-events-none">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <div className="bg-black/80 border border-amber-500/50 px-2 py-1 rounded text-[0.5rem] font-mono text-amber-500 uppercase whitespace-nowrap">
                        ISS (ZARYA)
                        <br />
                        <span className="text-white/50">
                            {displayPosition.alt.toFixed(0)} KM • {position?.velocity.toFixed(2) || "7.66"} KM/S
                        </span>
                        {loading && <span className="text-cyan-400 ml-1">• UPDATING</span>}
                    </div>
                </div>
            </Html>

            {/* Trajectory Line (Simple Trail) - simplified for MVP */}
        </group>
    );
}
