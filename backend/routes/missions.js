import express from 'express';
import axios from 'axios';

const router = express.Router();

// SpaceX API v4 base URL
const SPACEX_API = 'https://api.spacexdata.com/v4';

// Get all missions (combines SpaceX and NASA data)
router.get('/', async (req, res) => {
    try {
        // Fetch SpaceX launches
        const [upcoming, past] = await Promise.all([
            axios.get(`${SPACEX_API}/launches/upcoming`),
            axios.get(`${SPACEX_API}/launches/past`, { params: { limit: 10 } })
        ]);

        const formatLaunch = (launch, status) => ({
            id: launch.id,
            name: launch.name,
            date: launch.date_utc,
            dateLocal: launch.date_local,
            status,
            success: launch.success,
            details: launch.details,
            rocket: launch.rocket,
            launchpad: launch.launchpad,
            links: {
                patch: launch.links?.patch?.small,
                webcast: launch.links?.webcast,
                article: launch.links?.article,
                wikipedia: launch.links?.wikipedia
            },
            source: 'spacex'
        });

        const missions = [
            ...upcoming.data.slice(0, 5).map(l => formatLaunch(l, 'upcoming')),
            ...past.data.slice(-10).reverse().map(l => formatLaunch(l, l.success ? 'success' : 'failed'))
        ];

        // Add major NASA missions
        const nasaMissions = getNASAMissions();

        res.json({
            success: true,
            data: {
                spacex: missions,
                nasa: nasaMissions,
                combined: [...missions, ...nasaMissions].sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                )
            }
        });
    } catch (error) {
        console.error('Missions API Error:', error.message);
        res.json({
            success: true,
            fallback: true,
            data: {
                spacex: [],
                nasa: getNASAMissions(),
                combined: getNASAMissions()
            }
        });
    }
});

// Get specific mission details
router.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`${SPACEX_API}/launches/${req.params.id}`);

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Mission not found'
        });
    }
});

// Get rockets info
router.get('/rockets/all', async (req, res) => {
    try {
        const response = await axios.get(`${SPACEX_API}/rockets`);

        res.json({
            success: true,
            data: response.data.map(rocket => ({
                id: rocket.id,
                name: rocket.name,
                description: rocket.description,
                active: rocket.active,
                stages: rocket.stages,
                height: rocket.height,
                diameter: rocket.diameter,
                mass: rocket.mass,
                firstFlight: rocket.first_flight,
                successRate: rocket.success_rate_pct,
                costPerLaunch: rocket.cost_per_launch,
                images: rocket.flickr_images
            }))
        });
    } catch (error) {
        console.error('Rockets API Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch rockets'
        });
    }
});

// Major NASA missions data
function getNASAMissions() {
    return [
        {
            id: 'artemis-2',
            name: 'Artemis II',
            date: '2025-09-01T00:00:00Z',
            status: 'scheduled',
            type: 'Crewed Lunar Flyby',
            details: 'First crewed Artemis mission, lunar flyby with 4 astronauts.',
            source: 'nasa'
        },
        {
            id: 'europa-clipper',
            name: 'Europa Clipper',
            date: '2024-10-14T00:00:00Z',
            status: 'active',
            type: 'Jovian Orbiter',
            details: 'Mission to study Jupiter\'s moon Europa and its subsurface ocean.',
            source: 'nasa'
        },
        {
            id: 'jwst',
            name: 'James Webb Space Telescope',
            date: '2021-12-25T00:00:00Z',
            status: 'active',
            type: 'Space Telescope',
            details: 'Most powerful space telescope, observing in infrared.',
            source: 'nasa'
        },
        {
            id: 'perseverance',
            name: 'Perseverance Rover',
            date: '2021-02-18T00:00:00Z',
            status: 'active',
            type: 'Mars Rover',
            details: 'Searching for signs of ancient microbial life on Mars.',
            source: 'nasa'
        },
        {
            id: 'psyche',
            name: 'Psyche',
            date: '2023-10-13T00:00:00Z',
            status: 'active',
            type: 'Asteroid Probe',
            details: 'Mission to explore metal-rich asteroid 16 Psyche.',
            source: 'nasa'
        },
        {
            id: 'dragonfly',
            name: 'Dragonfly',
            date: '2028-06-01T00:00:00Z',
            status: 'scheduled',
            type: 'Titan Rotorcraft',
            details: 'Drone mission to explore Saturn\'s moon Titan.',
            source: 'nasa'
        }
    ];
}

export default router;
