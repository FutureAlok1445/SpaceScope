import { Stars } from '@react-three/drei';
import { Color } from 'three';

interface ExperienceProps {
    children: React.ReactNode;
}

export default function Experience({ children }: ExperienceProps) {
    return (
        <>
            {/* Background Color */}
            <color attach="background" args={[new Color('#020204')]} />

            {/* Lighting Setup */}
            {/* Ambient: soft fill */}
            <ambientLight intensity={0.1} color="#4facfe" />

            {/* Key Light: Main directional source (Sun from top-left) */}
            <directionalLight
                position={[-10, 10, 5]}
                intensity={2.5}
                castShadow
                color="#ffffff"
            />

            {/* Rim Light: Back light to create the halo */}
            <spotLight
                position={[0, 5, -15]}
                angle={0.5}
                penumbra={1}
                intensity={5}
                color="#4facfe"
                distance={50}
            />

            {/* Environment: Starfield */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Fog for depth fading */}
            <fog attach="fog" args={['#020204', 10, 50]} />

            {children}
        </>
    );
}
