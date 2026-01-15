import express from 'express';
import axios from 'axios';

const router = express.Router();
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_DONKI_BASE = 'https://api.nasa.gov/DONKI';

// Get all celestial events (CME, Solar Flares, Geomagnetic Storms)
router.get('/', async (req, res) => {
    try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);

        const formatDate = (d) => d.toISOString().split('T')[0];

        const [cme, flares, storms] = await Promise.all([
            axios.get(`${NASA_DONKI_BASE}/CME?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${NASA_API_KEY}`),
            axios.get(`${NASA_DONKI_BASE}/FLR?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${NASA_API_KEY}`),
            axios.get(`${NASA_DONKI_BASE}/GST?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${NASA_API_KEY}`)
        ]);

        res.json({
            success: true,
            data: {
                coronalMassEjections: cme.data || [],
                solarFlares: flares.data || [],
                geomagneticStorms: storms.data || []
            },
            fetchedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Celestial API Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch celestial data',
            fallback: true,
            data: getMockCelestialData()
        });
    }
});

// Get upcoming sky events (meteor showers, eclipses, planetary alignments)
router.get('/events', async (req, res) => {
    try {
        // Using NASA EONET for natural events
        const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events?limit=20&status=open');

        // Add mock sky events since NASA doesn't have a direct sky events API
        const skyEvents = [
            {
                id: 'quadrantids-2026',
                name: 'Quadrantids Meteor Shower',
                type: 'meteor_shower',
                peak: '2026-01-03T06:00:00Z',
                visibility: 'Northern Hemisphere',
                intensity: 'Strong (120 meteors/hr)',
                status: 'past'
            },
            {
                id: 'total-lunar-2026',
                name: 'Total Lunar Eclipse',
                type: 'eclipse',
                peak: '2026-03-03T12:00:00Z',
                visibility: 'Americas, Europe, Africa',
                intensity: 'Total',
                status: 'upcoming'
            },
            {
                id: 'lyrids-2026',
                name: 'Lyrids Meteor Shower',
                type: 'meteor_shower',
                peak: '2026-04-22T08:00:00Z',
                visibility: 'Global',
                intensity: 'Moderate (18 meteors/hr)',
                status: 'upcoming'
            },
            {
                id: 'partial-solar-2026',
                name: 'Partial Solar Eclipse',
                type: 'eclipse',
                peak: '2026-03-29T10:00:00Z',
                visibility: 'Europe, North Africa, Russia',
                intensity: 'Partial (95%)',
                status: 'upcoming'
            },
            {
                id: 'perseids-2026',
                name: 'Perseids Meteor Shower',
                type: 'meteor_shower',
                peak: '2026-08-12T04:00:00Z',
                visibility: 'Northern Hemisphere',
                intensity: 'Very Strong (100 meteors/hr)',
                status: 'upcoming'
            }
        ];

        res.json({
            success: true,
            data: {
                skyEvents,
                naturalEvents: response.data.events || []
            }
        });
    } catch (error) {
        console.error('Events API Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            data: { skyEvents: getMockSkyEvents(), naturalEvents: [] }
        });
    }
});

// Get aurora forecast
router.get('/aurora', async (req, res) => {
    try {
        // NOAA Space Weather Prediction Center aurora forecast
        const response = await axios.get('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');

        // Get KP index
        const kpResponse = await axios.get('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');

        const kpData = kpResponse.data.slice(-8); // Last 8 readings
        const currentKp = kpData[kpData.length - 1];

        res.json({
            success: true,
            data: {
                aurora: response.data,
                kpIndex: {
                    current: parseFloat(currentKp?.[1]) || 2,
                    history: kpData.map(k => ({
                        time: k[0],
                        value: parseFloat(k[1]) || 0
                    }))
                },
                visibility: getAuroraVisibility(parseFloat(currentKp?.[1]) || 2)
            }
        });
    } catch (error) {
        console.error('Aurora API Error:', error.message);
        res.json({
            success: true,
            fallback: true,
            data: {
                kpIndex: { current: 3, history: [] },
                visibility: getAuroraVisibility(3)
            }
        });
    }
});

function getAuroraVisibility(kp) {
    const regions = [
        { name: 'Alaska', lat: 65, lon: -150, minKp: 2 },
        { name: 'Norway', lat: 70, lon: 20, minKp: 2 },
        { name: 'Iceland', lat: 65, lon: -18, minKp: 3 },
        { name: 'Canada', lat: 60, lon: -100, minKp: 4 },
        { name: 'Scotland', lat: 57, lon: -4, minKp: 5 },
        { name: 'Northern US', lat: 48, lon: -95, minKp: 6 }
    ];

    return regions.map(r => ({
        ...r,
        visible: kp >= r.minKp,
        intensity: Math.min(1, (kp - r.minKp + 1) / 3)
    }));
}

function getMockCelestialData() {
    return {
        coronalMassEjections: [
            { activityID: 'CME-001', startTime: '2026-01-14T08:00Z', note: 'Halo CME detected' }
        ],
        solarFlares: [
            { flrID: 'FLR-001', beginTime: '2026-01-13T14:30Z', classType: 'M2.5' }
        ],
        geomagneticStorms: []
    };
}

function getMockSkyEvents() {
    return [
        { id: '1', name: 'ISS Pass', type: 'satellite', peak: new Date().toISOString(), visibility: 'Overhead' }
    ];
}

export default router;
