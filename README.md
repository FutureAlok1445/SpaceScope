# 🚀 SpaceScope – The IMAX Experience

A cinematic, interactive platform that centralizes real-time space information and educational content in a user-friendly visual format. Built with Next.js 15, React Three Fiber, and Three.js.

## ✨ Features

### 🎬 Cinematic 12-Shot Sequence
- **Shot 0**: Boot sequence with lens flare and grain
- **Shot 1**: Wormhole transition with chromatic aberration
- **Shot 2**: Portal iris opening effect
- **Shot 3**: Orbital Nexus - Interactive Earth with ISS tracking
- **Shot 4**: HUD alerts with haptic feedback
- **Shot 5**: AR ISS view with WebXR
- **Shot 6**: Solar storm visualization (CME propagation)
- **Shot 7**: Mission timeline with Mobius strip scroll
- **Shot 8**: Earth impact simulation with NDVI overlay
- **Shot 9**: Astro-Assist AI chat with TTS
- **Shot 10**: Cosmic comic generator
- **Shot 11**: Achievement unlock animations

### 🌍 Core Features
- **Real-time ISS Tracking**: Live position updates with fallback simulation
- **Solar Weather**: Cosmic weather data and alerts
- **Mission Timeline**: Visual timeline of past, current, and future missions
- **Earth Impact Sim**: Interactive globe with satellite data overlays
- **Learning Zone**: Educational content with quizzes and infographics
- **AR Mode**: WebXR-based AR ISS tracker

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your NASA API key: NEXT_PUBLIC_NASA_API_KEY=your_key_here
# Get a free key at: https://api.nasa.gov/

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📦 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page with shot orchestration
│   └── loading.tsx        # Boot sequence
├── components/
│   ├── 3d/               # 3D React Three Fiber components
│   │   ├── OrbitalNexus.tsx
│   │   ├── Earth.tsx
│   │   ├── ISSMarker.tsx
│   │   ├── Starfield.tsx
│   │   ├── BootSequence.tsx
│   │   ├── WormholeTransition.tsx
│   │   ├── PortalIris.tsx
│   │   └── NebulaBackground.tsx
│   ├── ui/               # UI components
│   │   ├── HUD.tsx
│   │   ├── HUDAlert.tsx
│   │   ├── AchievementUnlock.tsx
│   │   └── GlassPanel.tsx
│   ├── ar/               # AR components
│   │   └── ARISSView.tsx
│   ├── video/            # Video/visualization components
│   │   └── CMEVisualizer.tsx
│   └── sections/         # Page sections
│       ├── SkyEventsCinema.tsx
│       ├── MissionTimeline.tsx
│       ├── EarthImpactSim.tsx
│       ├── Academy.tsx
│       ├── AstroAssistChat.tsx
│       └── ComicGenerator.tsx
├── lib/
│   ├── api/              # API clients
│   │   ├── nasa-client.ts
│   │   └── fallback-chain.ts
│   ├── shaders/          # GLSL shaders
│   │   ├── atmosphere.ts
│   │   ├── starfield.ts
│   │   └── nebula.ts
│   ├── hooks/            # React hooks
│   │   ├── useISSPosition.ts
│   │   └── usePerformance.ts
│   └── utils/            # Utilities
│       ├── orbit-math.ts
│       └── device-capabilities.ts
└── public/
    └── cosmic/           # Assets (textures, models, audio, video)
        ├── textures/
        ├── models/
        ├── audio/
        └── video/
```

## 🎨 Assets

### Textures
Place Earth textures in `/public/cosmic/textures/`:
- `earth_8k_color.jpg` - Earth day texture
- `earth_night_4k.jpg` - Earth night lights
- `earth_normal_8k.jpg` - Normal map
- `earth_clouds_4k.jpg` - Cloud overlay

**Note**: The app works without textures using fallback materials. To download textures, see the asset manifest in the original prompt.

### 3D Models
Place GLB models in `/public/cosmic/models/`:
- `iss_draco.glb` - ISS model
- `jwst_draco.glb` - JWST model

### Audio
Place audio files in `/public/cosmic/audio/`:
- `spaceroom.wav` - Ambient space sounds
- `iss_beep.wav` - ISS notification sound
- `solar_flare.wav` - Solar event sound

## ⚡ Performance

The app includes automatic performance monitoring and LOD (Level of Detail) adjustment:
- **High-end devices**: Full quality (6000 stars, nebula, volumetric clouds)
- **Mid-tier devices**: Medium quality (3000 stars, no nebula)
- **Low-end/Mobile**: Reduced quality (2000 stars, simplified effects)

Performance metrics are displayed in development mode (top-left corner).

## ♿ Accessibility

- **Screen Reader Support**: ARIA labels on all interactive elements
- **Keyboard Navigation**: Full keyboard support with focus indicators
- **Motion Reduced**: Respects `prefers-reduced-motion`
- **High Contrast**: Supports `prefers-contrast: more`
- **Font Size**: Minimum 18px, uses rem units

## 🧪 Testing

```bash
# Run E2E tests (requires Playwright setup)
npm run test

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t spacescope .
docker run -p 3000:3000 spacescope
```

## 📝 Environment Variables

```env
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
```

Get a free NASA API key at: https://api.nasa.gov/

## 🎯 Roadmap

- [ ] Real-time ISS position with SGP4 propagation
- [ ] WebXR AR mode improvements
- [ ] Stable Diffusion integration for comic generation
- [ ] GPT-4o-mini integration for Astro-Assist
- [ ] Video texture support for Veo-3 generated content
- [ ] Service Worker for offline support
- [ ] Playwright E2E test suite

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

- **NASA**: API data and textures
- **ESA**: Additional space data
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Next.js**: React framework

## 🐛 Known Issues

- Texture loading errors are handled gracefully with fallbacks
- AR mode requires WebXR-capable device
- Some features require API keys (NASA API)

## 💡 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

**Built with ❤️ for space enthusiasts**
