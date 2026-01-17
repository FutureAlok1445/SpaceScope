import { Html, useProgress } from '@react-three/drei';

export default function PlanetLoader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div style={{ color: 'white', fontFamily: 'Inter', letterSpacing: '4px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>INITIALIZING TELEMETRY...</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(progress)}%</p>
            </div>
        </Html>
    );
}
