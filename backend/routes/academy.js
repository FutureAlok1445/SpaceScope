import express from 'express';

const router = express.Router();

// Quiz questions database
const QUIZZES = {
    solar_system: {
        id: 'solar_system',
        title: 'Solar System Explorer',
        description: 'Test your knowledge about our cosmic neighborhood',
        difficulty: 'beginner',
        icon: '🪐',
        questions: [
            {
                id: 1,
                question: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                correct: 1,
                explanation: 'Mars appears red due to iron oxide (rust) on its surface.'
            },
            {
                id: 2,
                question: 'How many planets are in our Solar System?',
                options: ['7', '8', '9', '10'],
                correct: 1,
                explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
            },
            {
                id: 3,
                question: 'Which planet is the largest?',
                options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
                correct: 2,
                explanation: 'Jupiter is so large that over 1,300 Earths could fit inside it!'
            },
            {
                id: 4,
                question: 'What is the hottest planet in our Solar System?',
                options: ['Mercury', 'Venus', 'Mars', 'Earth'],
                correct: 1,
                explanation: 'Venus is hottest due to its thick atmosphere trapping heat (460°C).'
            },
            {
                id: 5,
                question: 'Which planet has the most moons?',
                options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
                correct: 1,
                explanation: 'Saturn has over 140 known moons, more than any other planet!'
            }
        ]
    },
    space_missions: {
        id: 'space_missions',
        title: 'Space Mission Master',
        description: 'How well do you know space exploration history?',
        difficulty: 'intermediate',
        icon: '🚀',
        questions: [
            {
                id: 1,
                question: 'What was the first human spacecraft to land on the Moon?',
                options: ['Apollo 10', 'Apollo 11', 'Apollo 12', 'Apollo 13'],
                correct: 1,
                explanation: 'Apollo 11 landed on July 20, 1969, with Neil Armstrong and Buzz Aldrin.'
            },
            {
                id: 2,
                question: 'Which space telescope was launched in 2021?',
                options: ['Hubble', 'Kepler', 'James Webb', 'Spitzer'],
                correct: 2,
                explanation: 'JWST launched on December 25, 2021, and is the most powerful space telescope ever built.'
            },
            {
                id: 3,
                question: 'What rover is currently exploring Mars?',
                options: ['Curiosity', 'Perseverance', 'Spirit', 'Opportunity'],
                correct: 1,
                explanation: 'Perseverance landed in February 2021 and is searching for signs of ancient life.'
            },
            {
                id: 4,
                question: 'Which mission will return humans to the Moon?',
                options: ['Apollo', 'Artemis', 'Orion', 'Gateway'],
                correct: 1,
                explanation: 'NASA\'s Artemis program aims to land the first woman and next man on the Moon.'
            },
            {
                id: 5,
                question: 'What is the name of NASA\'s mission to study Jupiter\'s moon Europa?',
                options: ['Juno', 'Europa Clipper', 'Galileo', 'Cassini'],
                correct: 1,
                explanation: 'Europa Clipper launched in 2024 to study Europa\'s ice shell and subsurface ocean.'
            }
        ]
    },
    satellites_earth: {
        id: 'satellites_earth',
        title: 'Satellites & Earth Science',
        description: 'Learn how satellites help us understand Earth',
        difficulty: 'intermediate',
        icon: '🛰️',
        questions: [
            {
                id: 1,
                question: 'What do weather satellites primarily observe?',
                options: ['Stars', 'Clouds and storms', 'Other planets', 'Asteroids'],
                correct: 1,
                explanation: 'Weather satellites track cloud patterns, storms, and atmospheric conditions.'
            },
            {
                id: 2,
                question: 'What technology does GPS use to determine location?',
                options: ['Radio waves', 'Satellite signals', 'Laser beams', 'Radar'],
                correct: 1,
                explanation: 'GPS uses signals from multiple satellites to triangulate your position.'
            },
            {
                id: 3,
                question: 'What does NDVI measure from satellite data?',
                options: ['Temperature', 'Vegetation health', 'Ocean depth', 'Wind speed'],
                correct: 1,
                explanation: 'NDVI (Normalized Difference Vegetation Index) shows plant health using light reflection.'
            },
            {
                id: 4,
                question: 'Which satellite monitors global ice coverage?',
                options: ['Hubble', 'ICESat-2', 'JWST', 'Kepler'],
                correct: 1,
                explanation: 'ICESat-2 uses laser altimetry to precisely measure ice sheet changes.'
            },
            {
                id: 5,
                question: 'How do satellites help during natural disasters?',
                options: ['Creating disasters', 'Mapping damage areas', 'Stopping earthquakes', 'Making rain'],
                correct: 1,
                explanation: 'Satellites provide imagery for damage assessment, flood mapping, and rescue coordination.'
            }
        ]
    },
    cosmic_phenomena: {
        id: 'cosmic_phenomena',
        title: 'Cosmic Phenomena',
        description: 'Explore the wonders of the universe',
        difficulty: 'advanced',
        icon: '✨',
        questions: [
            {
                id: 1,
                question: 'What causes the Northern Lights (Aurora Borealis)?',
                options: ['Moonlight', 'Solar wind particles', 'Star explosions', 'Meteor showers'],
                correct: 1,
                explanation: 'Charged particles from the Sun interact with Earth\'s atmosphere, creating colorful lights.'
            },
            {
                id: 2,
                question: 'What is a solar flare?',
                options: ['An explosion on the Sun', 'A type of meteor', 'A moon phase', 'A comet'],
                correct: 0,
                explanation: 'Solar flares are intense bursts of radiation from the Sun\'s surface.'
            },
            {
                id: 3,
                question: 'What is a black hole?',
                options: ['Empty space', 'A collapsed star with extreme gravity', 'A dark planet', 'A type of asteroid'],
                correct: 1,
                explanation: 'Black holes form when massive stars collapse, creating gravity so strong light cannot escape.'
            },
            {
                id: 4,
                question: 'What is the KP Index used to measure?',
                options: ['Temperature', 'Geomagnetic activity', 'Star brightness', 'Planet size'],
                correct: 1,
                explanation: 'The KP Index measures geomagnetic storm intensity, helping predict aurora visibility.'
            },
            {
                id: 5,
                question: 'What is a supernova?',
                options: ['A new star forming', 'A massive star explosion', 'A type of galaxy', 'A meteor shower'],
                correct: 1,
                explanation: 'A supernova is the explosive death of a massive star, briefly outshining entire galaxies.'
            }
        ]
    }
};

// Get all quizzes (summary)
router.get('/quizzes', (req, res) => {
    const summaries = Object.values(QUIZZES).map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        icon: quiz.icon,
        questionCount: quiz.questions.length
    }));

    res.json({
        success: true,
        data: summaries
    });
});

// Get specific quiz
router.get('/quizzes/:id', (req, res) => {
    const quiz = QUIZZES[req.params.id];

    if (!quiz) {
        return res.status(404).json({
            success: false,
            error: 'Quiz not found'
        });
    }

    // Return quiz without correct answers for frontend
    const safeQuiz = {
        ...quiz,
        questions: quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }))
    };

    res.json({
        success: true,
        data: safeQuiz
    });
});

// Submit quiz answers
router.post('/quizzes/:id/submit', (req, res) => {
    const quiz = QUIZZES[req.params.id];
    const { answers } = req.body;

    if (!quiz) {
        return res.status(404).json({
            success: false,
            error: 'Quiz not found'
        });
    }

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
            success: false,
            error: 'Answers array required'
        });
    }

    // Grade the quiz
    let correct = 0;
    const results = quiz.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === q.correct;
        if (isCorrect) correct++;

        return {
            questionId: q.id,
            question: q.question,
            userAnswer,
            correctAnswer: q.correct,
            isCorrect,
            explanation: q.explanation
        };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const badge = getBadge(score);

    res.json({
        success: true,
        data: {
            quizId: quiz.id,
            quizTitle: quiz.title,
            score,
            correct,
            total: quiz.questions.length,
            badge,
            results
        }
    });
});

// Get learning content
router.get('/content', (req, res) => {
    res.json({
        success: true,
        data: {
            topics: [
                {
                    id: 'satellite-earth',
                    title: 'How Satellites Help Earth',
                    icon: '🛰️',
                    sections: [
                        {
                            title: 'Weather Forecasting',
                            content: 'Satellites like GOES observe clouds, storms, and atmospheric conditions to help predict weather and track hurricanes.',
                            image: 'weather'
                        },
                        {
                            title: 'Agriculture Monitoring',
                            content: 'Using NDVI data, farmers can monitor crop health, detect diseases, and optimize irrigation across vast farmlands.',
                            image: 'agriculture'
                        },
                        {
                            title: 'Climate Tracking',
                            content: 'Satellites measure sea levels, ice sheet changes, and greenhouse gases to understand climate change.',
                            image: 'climate'
                        },
                        {
                            title: 'Disaster Response',
                            content: 'During floods, fires, or earthquakes, satellites provide rapid imagery for damage assessment and rescue coordination.',
                            image: 'disaster'
                        }
                    ]
                },
                {
                    id: 'space-weather',
                    title: 'Understanding Space Weather',
                    icon: '☀️',
                    sections: [
                        {
                            title: 'Solar Flares',
                            content: 'Intense bursts of radiation from the Sun that can affect radio communications and satellite operations.',
                            image: 'flare'
                        },
                        {
                            title: 'Geomagnetic Storms',
                            content: 'Disturbances in Earth\'s magnetic field caused by solar wind that create beautiful auroras.',
                            image: 'storm'
                        },
                        {
                            title: 'Aurora Prediction',
                            content: 'The KP Index helps scientists predict when and where auroras will be visible.',
                            image: 'aurora'
                        }
                    ]
                }
            ]
        }
    });
});

// Get user progress (would need database in production)
router.get('/progress/:userId', (req, res) => {
    // Mock progress data
    res.json({
        success: true,
        data: {
            userId: req.params.userId,
            level: 'Cadet',
            xp: 150,
            xpToNextLevel: 500,
            badges: [
                { id: 'first-quiz', name: 'First Steps', icon: '🌟', earned: true },
                { id: 'perfect-score', name: 'Perfect Score', icon: '💯', earned: false }
            ],
            completedQuizzes: ['solar_system'],
            streakDays: 3
        }
    });
});

function getBadge(score) {
    if (score === 100) return { name: 'Perfect Score!', icon: '💯', tier: 'gold' };
    if (score >= 80) return { name: 'Space Expert', icon: '🌟', tier: 'silver' };
    if (score >= 60) return { name: 'Star Student', icon: '⭐', tier: 'bronze' };
    return { name: 'Keep Learning!', icon: '📚', tier: 'none' };
}

export default router;
