import { useEffect, useState } from 'react';

interface PlanetData {
    id: string;
    name: string;
    description: string;
    color: string;
    orbitSpeed?: string;
    distance?: string;
    [key: string]: any;
}

interface UIOverlayProps {
    currentPlanet: PlanetData;
    prevPlanetName: string;
    nextPlanetName: string;
    onNext: () => void;
    onPrev: () => void;
    isTransitioning: boolean;
}

export default function UIOverlay({
    currentPlanet,
    prevPlanetName,
    nextPlanetName,
    onNext,
    onPrev,
    isTransitioning,
}: UIOverlayProps) {
    const [showText, setShowText] = useState(true);

    // Sync text animation with planet transition
    useEffect(() => {
        if (isTransitioning) {
            setShowText(false);
        } else {
            const timer = setTimeout(() => setShowText(true), 200);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning, currentPlanet.id]);

    const accentColor = currentPlanet.color || '#ffffff';

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '3rem',
                boxSizing: 'border-box',
                zIndex: 10,
                background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)' // Subtle vignette
            }}
        >
            {/* Header / Top Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '4px', color: accentColor, margin: 0 }}>
                        SYSTEM: SOL
                    </h3>
                    <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem', letterSpacing: '1px' }}>
                        SECTOR 7 // {currentPlanet.name}
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '0.9rem', color: accentColor }}>
                        LIVE TELEMETRY
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                        SIGNAL STRENGTH: 100%
                    </div>
                </div>
            </div>

            {/* Center Main Text */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '8%',
                    transform: `translateY(-50%) ${showText ? 'translateX(0)' : 'translateX(-20px)'}`,
                    maxWidth: '550px',
                    textAlign: 'left',
                    opacity: showText ? 1 : 0,
                    transition: 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
            >
                <div style={{
                    fontFamily: 'Inter',
                    fontSize: '1rem',
                    color: accentColor,
                    letterSpacing: '4px',
                    marginBottom: '1rem',
                    opacity: 0.8
                }}>
                    0{['mercury', 'earth', 'mars', 'jupiter'].indexOf(currentPlanet.id) + 1} // OVERVIEW
                </div>

                <h1
                    style={{
                        fontFamily: 'Cinzel',
                        fontWeight: 700,
                        fontSize: '6rem',
                        margin: '0 0 1.5rem 0',
                        lineHeight: '0.9',
                        textTransform: 'uppercase',
                        color: 'white',
                        textShadow: `0 0 30px ${accentColor}40`, // Subtle colored glow
                    }}
                >
                    {currentPlanet.name}
                </h1>

                <p
                    style={{
                        fontFamily: 'Inter',
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        borderLeft: `2px solid ${accentColor}`,
                        paddingLeft: '1.5rem',
                        marginBottom: '2rem'
                    }}
                >
                    {currentPlanet.description}
                </p>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '3rem' }}>
                    {currentPlanet.distance && (
                        <div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>AVG. DISTANCE</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: 'white' }}>{currentPlanet.distance}</div>
                        </div>
                    )}
                    {currentPlanet.orbitSpeed && (
                        <div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>ORBIT SPEED</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: 'white' }}>{currentPlanet.orbitSpeed}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                pointerEvents: 'auto',
                width: '100%'
            }}>
                {/* Previous Button */}
                <button
                    onClick={onPrev}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        opacity: isTransitioning ? 0.3 : 1,
                        transform: isTransitioning ? 'translateX(-10px)' : 'translateX(0)',
                        transition: 'all 0.5s ease',
                        padding: 0
                    }}
                    className="nav-btn"
                >
                    <span style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>PREVIOUS</span>
                    <span style={{ fontFamily: 'Cinzel', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: accentColor }}>&lt;</span> {prevPlanetName}
                    </span>
                </button>

                {/* Next Button */}
                <button
                    onClick={onNext}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'right',
                        opacity: isTransitioning ? 0.3 : 1,
                        transform: isTransitioning ? 'translateX(10px)' : 'translateX(0)',
                        transition: 'all 0.5s ease',
                        padding: 0
                    }}
                    className="nav-btn"
                >
                    <span style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>NEXT</span>
                    <span style={{ fontFamily: 'Cinzel', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {nextPlanetName} <span style={{ color: accentColor }}>&gt;</span>
                    </span>
                </button>
            </div>

            {/* Dynamic Scroll Indicator / Decoration */}
            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '60px',
                background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
                opacity: 0.5
            }} />

            <style>{`
                .nav-btn:hover {
                    opacity: 1 !important;
                }
                .nav-btn:hover span:last-child {
                    text-shadow: 0 0 15px ${accentColor}80;
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
}
