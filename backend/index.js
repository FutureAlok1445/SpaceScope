import express from 'express';
import cors from 'cors';

// Import routes
import celestialRoutes from './routes/celestial.js';
import issRoutes from './routes/iss.js';
import missionsRoutes from './routes/missions.js';
import weatherRoutes from './routes/weather.js';
import academyRoutes from './routes/academy.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/celestial', celestialRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/academy', academyRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        service: 'SpaceScope API'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'SpaceScope API Server',
        version: '1.0.0',
        endpoints: {
            celestial: '/api/celestial',
            iss: '/api/iss',
            missions: '/api/missions',
            weather: '/api/weather',
            academy: '/api/academy',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║     🚀 SpaceScope API Server             ║
║     Running on http://localhost:${PORT}     ║
╚══════════════════════════════════════════╝
  `);
});
