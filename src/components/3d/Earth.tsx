"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Earth() {
    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const texturesRef = useRef<{
        colorMap: THREE.Texture | null;
        normalMap: THREE.Texture | null;
        cloudsMap: THREE.Texture | null;
    }>({
        colorMap: null,
        normalMap: null,
        cloudsMap: null,
    });
    const [textures, setTextures] = useState<{
        colorMap: THREE.Texture | null;
        normalMap: THREE.Texture | null;
        cloudsMap: THREE.Texture | null;
    }>({
        colorMap: null,
        normalMap: null,
        cloudsMap: null,
    });

    // Load textures with error handling
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const texturePaths = [
            "/cosmic/textures/earth_8k_color.jpg",
            "/cosmic/textures/earth_normal_8k.jpg",
            "/cosmic/textures/earth_clouds_4k.jpg",
        ];

        const loadTexture = (path: string): Promise<THREE.Texture | null> => {
            return new Promise((resolve) => {
                loader.load(
                    path,
                    (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        resolve(texture);
                    },
                    undefined,
                    (error) => {
                        console.warn(`Failed to load texture: ${path}`, error);
                        resolve(null);
                    }
                );
            });
        };

        Promise.allSettled(texturePaths.map(loadTexture)).then((results) => {
            const loadedTextures = {
                colorMap: results[0].status === "fulfilled" ? results[0].value : null,
                normalMap: results[1].status === "fulfilled" ? results[1].value : null,
                cloudsMap: results[2].status === "fulfilled" ? results[2].value : null,
            };
            texturesRef.current = loadedTextures;
            setTextures(loadedTextures);
        });

        // Cleanup function to dispose textures on unmount
        return () => {
            Object.values(texturesRef.current).forEach((texture) => {
                if (texture) {
                    texture.dispose();
                }
            });
        };
    }, []);

    useFrame(({ clock }) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07; // Clouds move slightly faster
        }
    });

    return (
        <group ref={earthRef} dispose={null}>
            {/* Earth Surface */}
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={textures.colorMap}
                    normalMap={textures.normalMap || undefined}
                    color={textures.colorMap ? undefined : "#4a90e2"} // Fallback blue color for Earth
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Clouds */}
            {textures.cloudsMap && (
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[2.02, 64, 64]} />
                    <meshStandardMaterial
                        map={textures.cloudsMap}
                        transparent={true}
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Fallback clouds effect when texture is missing */}
            {!textures.cloudsMap && (
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[2.02, 64, 64]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent={true}
                        opacity={0.3}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Atmosphere Glow */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshBasicMaterial
                    color="#00beff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}
