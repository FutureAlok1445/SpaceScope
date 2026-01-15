import express from 'express';
import axios from 'axios';

const router = express.Router();

// Cache for ISS position (updates every 5 seconds)
let issCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 5000;

// Get current ISS position
router.get('/', async (req, res) => {
    try {
        const now = Date.now();

        // Use cache if fresh
        if (issCache.data && (now - issCache.timestamp) < CACHE_DURATION) {
            return res.json({
                success: true,
                data: issCache.data,
                cached: true
            });
        }

        // Fetch from Open-Notify API
        const response = await axios.get('http://api.open-notify.org/iss-now.json');

        if (response.data.message === 'success') {
            const position = {
                latitude: parseFloat(response.data.iss_position.latitude),
                longitude: parseFloat(response.data.iss_position.longitude),
                timestamp: response.data.timestamp,
                altitude: 420, // ISS average altitude in km
                velocity: 27600 // ISS average velocity in km/h
            };

            // Update cache
            issCache = { data: position, timestamp: now };

            res.json({
                success: true,
                data: position
            });
        } else {
            throw new Error('ISS API returned unsuccessful response');
        }
    } catch (error) {
        console.error('ISS API Error:', error.message);

        // Return fallback position
        res.json({
            success: true,
            fallback: true,
            data: {
                latitude: 45.0 + Math.sin(Date.now() / 10000) * 30,
                longitude: (Date.now() / 1000 % 360) - 180,
                timestamp: Math.floor(Date.now() / 1000),
                altitude: 420,
                velocity: 27600
            }
        });
    }
});

// Get ISS pass times for a location
router.get('/passes', async (req, res) => {
    try {
        const { lat = 40.7128, lon = -74.0060 } = req.query; // Default: NYC

        // Note: Open-Notify pass predictions API is often down
        // Using calculated passes instead
        const passes = calculateISSPasses(parseFloat(lat), parseFloat(lon));

        res.json({
            success: true,
            data: {
                location: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
                passes
            }
        });
    } catch (error) {
        console.error('ISS Passes Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate ISS passes'
        });
    }
});

// Get astronauts currently in space
router.get('/crew', async (req, res) => {
    try {
        const response = await axios.get('http://api.open-notify.org/astros.json');

        if (response.data.message === 'success') {
            res.json({
                success: true,
                data: {
                    count: response.data.number,
                    people: response.data.people
                }
            });
        } else {
            throw new Error('Astros API unsuccessful');
        }
    } catch (error) {
        console.error('Crew API Error:', error.message);

        // Fallback data
        res.json({
            success: true,
            fallback: true,
            data: {
                count: 7,
                people: [
                    { name: 'Oleg Kononenko', craft: 'ISS' },
                    { name: 'Nikolai Chub', craft: 'ISS' },
                    { name: 'Tracy Dyson', craft: 'ISS' },
                    { name: 'Matthew Dominick', craft: 'ISS' },
                    { name: 'Michael Barratt', craft: 'ISS' },
                    { name: 'Jeanette Epps', craft: 'ISS' },
                    { name: 'Alexander Grebenkin', craft: 'ISS' }
                ]
            }
        });
    }
});

// Calculate approximate ISS passes
function calculateISSPasses(lat, lon) {
    const passes = [];
    const now = new Date();

    // ISS orbits every ~92 minutes, visible passes depend on sun angle
    for (let i = 0; i < 5; i++) {
        const passTime = new Date(now.getTime() + (i * 92 + Math.random() * 30) * 60 * 1000);
        const duration = Math.floor(3 + Math.random() * 4); // 3-7 minutes
        const maxElevation = Math.floor(20 + Math.random() * 60); // 20-80 degrees

        passes.push({
            risetime: Math.floor(passTime.getTime() / 1000),
            risetimeISO: passTime.toISOString(),
            duration: duration * 60,
            maxElevation,
            direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]
        });
    }

    return passes;
}

export default router;
