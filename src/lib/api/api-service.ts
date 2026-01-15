// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    fallback?: boolean;
    fetchedAt?: string;
}

async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            next: { revalidate: 60 }, // Cache for 1 minute
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Celestial Events API
export interface CelestialEvent {
    id: string;
    name: string;
    type: 'meteor_shower' | 'eclipse' | 'planetary' | 'satellite';
    peak: string;
    visibility: string;
    intensity: string;
    status: 'upcoming' | 'active' | 'past';
}

export interface SolarFlare {
    flrID: string;
    beginTime: string;
    peakTime?: string;
    classType: string;
    sourceLocation?: string;
}

export interface AuroraRegion {
    name: string;
    lat: number;
    lon: number;
    visible: boolean;
    intensity: number;
}

export const celestialApi = {
    getEvents: () => fetchApi<{ skyEvents: CelestialEvent[]; naturalEvents: unknown[] }>('/celestial/events'),
    getAurora: () => fetchApi<{ kpIndex: { current: number; history: { time: string; value: number }[] }; visibility: AuroraRegion[] }>('/celestial/aurora'),
    getAll: () => fetchApi<{ coronalMassEjections: unknown[]; solarFlares: SolarFlare[]; geomagneticStorms: unknown[] }>('/celestial'),
};

// ISS Tracking API
export interface ISSPosition {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    timestamp: number;
}

export interface Astronaut {
    name: string;
    craft: string;
}

export const issApi = {
    getPosition: () => fetchApi<ISSPosition>('/iss'),
    getCrew: () => fetchApi<{ count: number; people: Astronaut[] }>('/iss/crew'),
    getPasses: (lat: number, lon: number) =>
        fetchApi<{ location: { latitude: number; longitude: number }; passes: unknown[] }>(`/iss/passes?lat=${lat}&lon=${lon}`),
};

// Space Missions API
export interface Mission {
    id: string;
    name: string;
    date: string;
    status: 'scheduled' | 'active' | 'success' | 'failed';
    type?: string;
    details?: string;
    source: 'spacex' | 'nasa';
    links?: {
        patch?: string;
        webcast?: string;
        article?: string;
    };
}

export const missionsApi = {
    getAll: () => fetchApi<{ spacex: Mission[]; nasa: Mission[]; combined: Mission[] }>('/missions'),
    getById: (id: string) => fetchApi<Mission>(`/missions/${id}`),
    getRockets: () => fetchApi<unknown[]>('/missions/rockets/all'),
};

// Space Weather API
export interface KpIndex {
    current: number;
    level: {
        level: string;
        color: string;
        description: string;
    };
    history: { time: string; value: number }[];
}

export interface SpaceWeather {
    kpIndex: KpIndex;
    solarWind: {
        speed: number;
        density: number;
        history: { time: string; speed: number; density: number }[];
    };
    xrayFlux: {
        current: number;
        level: string;
    };
    alerts: { issueTime: string; message: string }[];
    summary: string[];
}

export const weatherApi = {
    getAll: () => fetchApi<SpaceWeather>('/weather'),
    getImagery: () => fetchApi<{ sdo: Record<string, string>; soho: Record<string, string> }>('/weather/imagery'),
    getRadiation: () => fetchApi<unknown>('/weather/radiation'),
};

// Academy API
export interface QuizSummary {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    icon: string;
    questionCount: number;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    icon: string;
    questions: {
        id: number;
        question: string;
        options: string[];
    }[];
}

export interface QuizResult {
    quizId: string;
    quizTitle: string;
    score: number;
    correct: number;
    total: number;
    badge: {
        name: string;
        icon: string;
        tier: string;
    };
    results: {
        questionId: number;
        question: string;
        userAnswer: number;
        correctAnswer: number;
        isCorrect: boolean;
        explanation: string;
    }[];
}

export const academyApi = {
    getQuizzes: () => fetchApi<QuizSummary[]>('/academy/quizzes'),
    getQuiz: (id: string) => fetchApi<Quiz>(`/academy/quizzes/${id}`),
    submitQuiz: async (id: string, answers: number[]): Promise<ApiResponse<QuizResult>> => {
        try {
            const response = await fetch(`${API_BASE}/academy/quizzes/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Failed to submit quiz' };
        }
    },
    getContent: () => fetchApi<{ topics: unknown[] }>('/academy/content'),
    getProgress: (userId: string) => fetchApi<unknown>(`/academy/progress/${userId}`),
};

// Health check
export const healthCheck = () => fetchApi<{ status: string; timestamp: string }>('/health');
