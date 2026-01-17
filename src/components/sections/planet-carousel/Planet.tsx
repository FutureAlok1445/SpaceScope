import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
    id: string;
    modelPath?: string;
    color?: string; // Fallback color if no model
    position: [number, number, number];
    scale?: number;
    rotationSpeed?: number;
}

export default function Planet({
    id,
    modelPath,
    color = '#ffffff',
    position,
    scale = 1,
    rotationSpeed = 0.002,
}: PlanetProps) {
    const meshRef = useRef<THREE.Group>(null);
    const gltf = modelPath ? useGLTF(modelPath) : null;

    // Apply specific visual settings for Mercury (simulating model-viewer props)
    useEffect(() => {
        if (id === 'mercury' && gltf) {
            gltf.scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    // Simulate exposure="0.7" by reducing environment lighting impact
                    if (mesh.material instanceof THREE.MeshStandardMaterial) {
                        mesh.material.envMapIntensity = 0.7;
                        mesh.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [id, gltf]);

    // Idle rotation (Day/Night cycle)
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
        }
    });

    // Custom shader material for "Rim Light" effect on placeholder spheres
    const rimMaterial = useMemo(() => {
        if (modelPath) return null; // Use model's own materials if GLB is loaded

        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.7,
            metalness: 0.2,
            // Note: Full custom shader for perfect rim light is complex, 
            // utilizing standard material props + scene lights to achieve the effect for now.
        });
    }, [color, modelPath]);

    return (
        <group ref={meshRef} position={position} scale={scale}>
            <PresentationControls
                global={false} // Only interact when looking at this object
                cursor={true}
                snap={false} // Keep rotation after release
                speed={1.5}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 2, Math.PI / 2]} // Allow full vertical rotation
                azimuth={[-Infinity, Infinity]} // Allow full horizontal rotation
            >
                {modelPath && gltf ? (
                    <primitive object={gltf.scene} />
                ) : (
                    <mesh>
                        <sphereGeometry args={[1, 64, 64]} />
                        {rimMaterial && <primitive object={rimMaterial} attach="material" />}
                    </mesh>
                )}
                {/* Specific lighting for Earth to increase visibility */}
                {id === 'earth' && <ambientLight intensity={4} color="#ffffff" />}
            </PresentationControls>

            {/* Mercury Settings: Shadow Intensity Sim (Floor Shadow) */}
            {id === 'mercury' && (
                <ContactShadows
                    opacity={0.8} // Simulating shadow-intensity="1.82" (clamped visually)
                    scale={10}
                    blur={2}      // Simulating shadow-softness
                    far={4}
                    resolution={512}
                    color="#000000"
                />
            )}
        </group>
    );
}
