import express from 'express';
import axios from 'axios';

const router = express.Router();

// NOAA Space Weather Prediction Center base URL
const NOAA_SWPC = 'https://services.swpc.noaa.gov';

// Get comprehensive space weather data
router.get('/', async (req, res) => {
    try {
        const [kpIndex, solarWind, alerts, xray] = await Promise.all([
            axios.get(`${NOAA_SWPC}/products/noaa-planetary-k-index.json`).catch(() => ({ data: [] })),
            axios.get(`${NOAA_SWPC}/products/solar-wind/plasma-7-day.json`).catch(() => ({ data: [] })),
            axios.get(`${NOAA_SWPC}/products/alerts.json`).catch(() => ({ data: [] })),
            axios.get(`${NOAA_SWPC}/json/goes/primary/xrays-7-day.json`).catch(() => ({ data: [] }))
        ]);

        // Parse KP Index
        const kpData = kpIndex.data.slice(-24) || [];
        const currentKp = kpData[kpData.length - 1];

        // Parse Solar Wind
        const windData = solarWind.data.slice(-50) || [];
        const latestWind = windData[windData.length - 1];

        // Parse X-Ray flux for solar flare activity
        const xrayData = xray.data.slice(-100) || [];
        const latestXray = xrayData[xrayData.length - 1];

        res.json({
            success: true,
            data: {
                kpIndex: {
                    current: parseFloat(currentKp?.[1]) || 2,
                    level: getKpLevel(parseFloat(currentKp?.[1]) || 2),
                    history: kpData.map(k => ({
                        time: k[0],
                        value: parseFloat(k[1]) || 0
                    }))
                },
                solarWind: {
                    speed: parseFloat(latestWind?.[2]) || 400,
                    density: parseFloat(latestWind?.[1]) || 5,
                    history: windData.slice(-20).map(w => ({
                        time: w[0],
                        density: parseFloat(w[1]) || 0,
                        speed: parseFloat(w[2]) || 0,
                        temperature: parseFloat(w[3]) || 0
                    }))
                },
                xrayFlux: {
                    current: parseFloat(latestXray?.[1]) || 0,
                    level: getXrayLevel(parseFloat(latestXray?.[1]) || 0)
                },
                alerts: (alerts.data || []).slice(0, 10).map(alert => ({
                    issueTime: alert.issue_datetime,
                    message: alert.message,
                    productId: alert.product_id
                })),
                summary: generateWeatherSummary(
                    parseFloat(currentKp?.[1]) || 2,
                    parseFloat(latestWind?.[2]) || 400
                )
            },
            fetchedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.json({
            success: true,
            fallback: true,
            data: getFallbackWeather()
        });
    }
});

// Get solar imagery
router.get('/imagery', async (req, res) => {
    res.json({
        success: true,
        data: {
            sdo: {
                aia_171: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg',
                aia_304: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg',
                aia_193: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg',
                hmi_mag: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_HMIBC.jpg'
            },
            soho: {
                lasco_c2: 'https://soho.nascom.nasa.gov/data/realtime/c2/1024/latest.jpg',
                lasco_c3: 'https://soho.nascom.nasa.gov/data/realtime/c3/1024/latest.jpg'
            }
        }
    });
});

// Get radiation levels
router.get('/radiation', async (req, res) => {
    try {
        const response = await axios.get(`${NOAA_SWPC}/products/noaa-scales.json`);

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.json({
            success: true,
            fallback: true,
            data: {
                R: { Scale: 0, Text: 'None' },
                S: { Scale: 0, Text: 'None' },
                G: { Scale: 0, Text: 'None' }
            }
        });
    }
});

function getKpLevel(kp) {
    if (kp >= 8) return { level: 'extreme', color: '#ff0000', description: 'Extreme Storm' };
    if (kp >= 7) return { level: 'severe', color: '#ff4400', description: 'Severe Storm' };
    if (kp >= 6) return { level: 'strong', color: '#ff8800', description: 'Strong Storm' };
    if (kp >= 5) return { level: 'moderate', color: '#ffcc00', description: 'Moderate Storm' };
    if (kp >= 4) return { level: 'minor', color: '#ffff00', description: 'Minor Storm' };
    return { level: 'quiet', color: '#00ff00', description: 'Quiet' };
}

function getXrayLevel(flux) {
    if (flux >= 1e-4) return 'X-class (Extreme)';
    if (flux >= 1e-5) return 'M-class (Strong)';
    if (flux >= 1e-6) return 'C-class (Moderate)';
    if (flux >= 1e-7) return 'B-class (Low)';
    return 'A-class (Minimal)';
}

function generateWeatherSummary(kp, windSpeed) {
    let summary = [];

    if (kp >= 5) {
        summary.push(`⚠️ Geomagnetic storm active (KP ${kp})`);
    } else if (kp >= 4) {
        summary.push(`🌐 Minor geomagnetic activity (KP ${kp})`);
    } else {
        summary.push(`✅ Geomagnetic conditions quiet (KP ${kp})`);
    }

    if (windSpeed > 600) {
        summary.push(`🌬️ Elevated solar wind (${Math.round(windSpeed)} km/s)`);
    }

    if (kp >= 4) {
        summary.push('🌌 Aurora may be visible at high latitudes');
    }

    return summary;
}

function getFallbackWeather() {
    return {
        kpIndex: {
            current: 3,
            level: getKpLevel(3),
            history: []
        },
        solarWind: {
            speed: 420,
            density: 5,
            history: []
        },
        xrayFlux: {
            current: 1e-7,
            level: 'B-class (Low)'
        },
        alerts: [],
        summary: ['✅ Geomagnetic conditions quiet (KP 3)']
    };
}

export default router;
