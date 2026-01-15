"use client";

import { useState, useEffect, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { academyApi, QuizSummary, Quiz, QuizResult } from "@/lib/api/api-service";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import {
    Globe,
    Rocket,
    Satellite,
    Sparkles,
    ChevronRight,
    Check,
    X,
    ArrowLeft,
    Trophy,
    Medal,
    Award,
    Star,
    Clock,
    Brain,
    Lightbulb,
    Target,
    Zap,
} from "lucide-react";

type ViewState = "menu" | "quiz" | "results";

// Quiz category icons mapping
const QUIZ_ICONS: Record<string, React.ElementType> = {
    solar_system: Globe,
    space_missions: Rocket,
    satellites_earth: Satellite,
    cosmic_phenomena: Sparkles,
};

// Quiz category colors
const QUIZ_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    solar_system: { bg: "from-blue-600/20 to-indigo-600/20", text: "text-blue-400", border: "border-blue-500/50", glow: "shadow-blue-500/30" },
    space_missions: { bg: "from-orange-600/20 to-red-600/20", text: "text-orange-400", border: "border-orange-500/50", glow: "shadow-orange-500/30" },
    satellites_earth: { bg: "from-cyan-600/20 to-teal-600/20", text: "text-cyan-400", border: "border-cyan-500/50", glow: "shadow-cyan-500/30" },
    cosmic_phenomena: { bg: "from-purple-600/20 to-pink-600/20", text: "text-purple-400", border: "border-purple-500/50", glow: "shadow-purple-500/30" },
};

export function Academy() {
    const [viewState, setViewState] = useState<ViewState>("menu");
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const response = await academyApi.getQuizzes();
                if (response.success && response.data) {
                    setQuizzes(response.data);
                } else {
                    setQuizzes(getFallbackQuizzes());
                }
            } catch (error) {
                setQuizzes(getFallbackQuizzes());
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (!loading && sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll(".quiz-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.9, rotateX: -10 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power3.out",
                }
            );
        }
    }, [loading, viewState]);

    // Timer for quiz
    useEffect(() => {
        if (viewState === "quiz") {
            setTimeElapsed(0);
            timerRef.current = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [viewState]);

    const startQuiz = async (quizId: string) => {
        setLoading(true);
        try {
            const response = await academyApi.getQuiz(quizId);
            if (response.success && response.data) {
                setCurrentQuiz(response.data);
                setCurrentQuestion(0);
                setAnswers([]);
                setViewState("quiz");
            } else {
                const fallbackQuiz = getFallbackFullQuiz(quizId);
                if (fallbackQuiz) {
                    setCurrentQuiz(fallbackQuiz);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setViewState("quiz");
                }
            }
        } catch (error) {
            const fallbackQuiz = getFallbackFullQuiz(quizId);
            if (fallbackQuiz) {
                setCurrentQuiz(fallbackQuiz);
                setCurrentQuestion(0);
                setAnswers([]);
                setViewState("quiz");
            }
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            // Animate question transition
            gsap.fromTo(
                ".question-container",
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            gsap.fromTo(
                ".question-container",
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    };

    const submitQuiz = async () => {
        if (!currentQuiz) return;
        setLoading(true);

        // Calculate results locally with proper answer validation
        const correctAnswers = [1, 1, 2, 1, 1]; // Mars=1, 8=1, Jupiter=2, Venus=1, Saturn=1 for solar_system
        const answerKeys: Record<string, number[]> = {
            solar_system: [1, 1, 2, 1, 1],
            space_missions: [1, 2, 1, 1, 1],
            satellites_earth: [1, 1, 1, 1, 1],
            cosmic_phenomena: [1, 0, 1, 1, 1],
        };

        const keys = answerKeys[currentQuiz.id] || correctAnswers;
        let correct = 0;
        const results = currentQuiz.questions.map((q, idx) => {
            const isCorrect = answers[idx] === keys[idx];
            if (isCorrect) correct++;
            return {
                question: q.question,
                isCorrect,
                selectedAnswer: q.options[answers[idx]] || "No answer",
                correctAnswer: q.options[keys[idx]],
                explanation: isCorrect
                    ? "Correct! Great job."
                    : `The correct answer is: ${q.options[keys[idx]]}`,
            };
        });

        const score = Math.round((correct / currentQuiz.questions.length) * 100);
        let badge = { name: "Participant", tier: "bronze" as const, icon: <Medal className="w-8 h-8" /> };
        if (score >= 80) badge = { name: "Space Expert", tier: "gold" as const, icon: <Trophy className="w-8 h-8" /> };
        else if (score >= 60) badge = { name: "Star Navigator", tier: "silver" as const, icon: <Award className="w-8 h-8" /> };

        setResult({
            quizId: currentQuiz.id,
            score,
            correct,
            total: currentQuiz.questions.length,
            badge,
            results,
            timeSpent: timeElapsed,
        });
        setViewState("results");
        setLoading(false);
    };

    const resetQuiz = () => {
        setViewState("menu");
        setCurrentQuiz(null);
        setCurrentQuestion(0);
        setAnswers([]);
        setResult(null);
        setTimeElapsed(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getQuizColor = (quizId: string) => QUIZ_COLORS[quizId] || QUIZ_COLORS.solar_system;
    const QuizIcon = (quizId: string) => QUIZ_ICONS[quizId] || Globe;

    return (
        <div ref={sectionRef} className="w-full min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-full mb-6">
                        <Brain className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
                            Interactive Learning
                        </span>
                    </div>
                    <h2 className="font-orbitron font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
                        SPACE <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">ACADEMY</span>
                    </h2>
                    <p className="text-white/60 font-inter max-w-xl mx-auto text-lg">
                        Challenge your cosmic knowledge and earn achievement badges
                    </p>
                </div>

                {loading && viewState !== "menu" ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
                        </div>
                        <span className="text-amber-400/60 font-mono text-sm">Loading quiz...</span>
                    </div>
                ) : (
                    <>
                        {/* Quiz Menu */}
                        {viewState === "menu" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {quizzes.map((quiz) => {
                                    const colors = getQuizColor(quiz.id);
                                    const Icon = QuizIcon(quiz.id);
                                    return (
                                        <GlassPanel
                                            key={quiz.id}
                                            className={cn(
                                                "quiz-card p-0 cursor-pointer transition-all duration-500 group overflow-hidden",
                                                "hover:scale-[1.02] hover:shadow-2xl",
                                                colors.border,
                                                `hover:${colors.glow}`
                                            )}
                                            onClick={() => startQuiz(quiz.id)}
                                        >
                                            {/* Gradient Background */}
                                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colors.bg)} />

                                            {/* Content */}
                                            <div className="relative p-8">
                                                <div className="flex items-start justify-between mb-6">
                                                    {/* Icon Container */}
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                                                        "bg-gradient-to-br from-white/10 to-white/5 border border-white/10",
                                                        "group-hover:scale-110 transition-transform duration-500"
                                                    )}>
                                                        <Icon className={cn("w-8 h-8", colors.text)} />
                                                    </div>

                                                    {/* Difficulty Badge */}
                                                    <span className={cn(
                                                        "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
                                                        "flex items-center gap-1.5",
                                                        quiz.difficulty === "beginner"
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                            : quiz.difficulty === "intermediate"
                                                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                    )}>
                                                        <Target className="w-3 h-3" />
                                                        {quiz.difficulty}
                                                    </span>
                                                </div>

                                                <h3 className="font-orbitron text-2xl text-white mb-3 group-hover:text-amber-400 transition-colors">
                                                    {quiz.title}
                                                </h3>
                                                <p className="text-sm text-white/60 mb-6 line-clamp-2">{quiz.description}</p>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1.5 text-xs font-mono text-white/40">
                                                            <Lightbulb className="w-3.5 h-3.5" />
                                                            {quiz.questionCount} Questions
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs font-mono text-white/40">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            ~3 min
                                                        </span>
                                                    </div>
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        "bg-white/5 group-hover:bg-amber-500 transition-all duration-300"
                                                    )}>
                                                        <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-black transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassPanel>
                                    );
                                })}
                            </div>
                        )}

                        {/* Quiz Questions */}
                        {viewState === "quiz" && currentQuiz && (
                            <div className="max-w-2xl mx-auto">
                                <GlassPanel className="p-0 overflow-hidden">
                                    {/* Quiz Header */}
                                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={resetQuiz}
                                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                                            >
                                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                                <span className="text-sm font-mono">Exit</span>
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5 text-sm font-mono text-amber-400">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTime(timeElapsed)}
                                                </span>
                                                <span className="text-sm font-mono text-white/60">
                                                    {currentQuestion + 1}/{currentQuiz.questions.length}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
                                                style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </div>
                                    </div>

                                    {/* Question Content */}
                                    <div className="p-8 question-container">
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                                <span className="font-orbitron font-bold text-amber-400">{currentQuestion + 1}</span>
                                            </div>
                                            <h3 className="font-orbitron text-xl md:text-2xl text-white leading-relaxed">
                                                {currentQuiz.questions[currentQuestion].question}
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            {currentQuiz.questions[currentQuestion].options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectAnswer(idx)}
                                                    className={cn(
                                                        "w-full p-5 text-left rounded-xl border transition-all duration-300 group",
                                                        "flex items-center gap-4",
                                                        answers[currentQuestion] === idx
                                                            ? "border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                                                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                                                        answers[currentQuestion] === idx
                                                            ? "bg-amber-500 text-black"
                                                            : "bg-white/10 text-white/60 group-hover:bg-white/20"
                                                    )}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className={cn(
                                                        "flex-1 font-inter",
                                                        answers[currentQuestion] === idx ? "text-white" : "text-white/80"
                                                    )}>
                                                        {option}
                                                    </span>
                                                    {answers[currentQuestion] === idx && (
                                                        <Check className="w-5 h-5 text-amber-400" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation Footer */}
                                    <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
                                        <button
                                            onClick={previousQuestion}
                                            disabled={currentQuestion === 0}
                                            className={cn(
                                                "px-6 py-3 rounded-xl font-orbitron text-sm uppercase tracking-wider transition-all flex items-center gap-2",
                                                currentQuestion === 0
                                                    ? "text-white/20 cursor-not-allowed"
                                                    : "text-white border border-white/20 hover:bg-white/10"
                                            )}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Previous
                                        </button>

                                        {currentQuestion < currentQuiz.questions.length - 1 ? (
                                            <button
                                                onClick={nextQuestion}
                                                disabled={answers[currentQuestion] === undefined}
                                                className={cn(
                                                    "px-8 py-3 rounded-xl font-orbitron text-sm uppercase tracking-wider transition-all flex items-center gap-2",
                                                    answers[currentQuestion] === undefined
                                                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/30"
                                                )}
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={submitQuiz}
                                                disabled={answers.length !== currentQuiz.questions.length || answers.includes(undefined as unknown as number)}
                                                className={cn(
                                                    "px-8 py-3 rounded-xl font-orbitron text-sm uppercase tracking-wider transition-all flex items-center gap-2",
                                                    answers.length !== currentQuiz.questions.length
                                                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-lg hover:shadow-green-500/30"
                                                )}
                                            >
                                                <Zap className="w-4 h-4" />
                                                Submit Quiz
                                            </button>
                                        )}
                                    </div>
                                </GlassPanel>
                            </div>
                        )}

                        {/* Quiz Results */}
                        {viewState === "results" && result && (
                            <div className="max-w-2xl mx-auto">
                                <GlassPanel className="p-0 overflow-hidden">
                                    {/* Results Header */}
                                    <div className={cn(
                                        "p-8 text-center border-b border-white/10",
                                        result.score >= 80 ? "bg-gradient-to-b from-amber-500/20 to-transparent" :
                                            result.score >= 60 ? "bg-gradient-to-b from-gray-400/20 to-transparent" :
                                                "bg-gradient-to-b from-orange-700/20 to-transparent"
                                    )}>
                                        {/* Badge */}
                                        <div className={cn(
                                            "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6",
                                            "animate-bounce-slow",
                                            result.score >= 80 ? "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-amber-500/50" :
                                                result.score >= 60 ? "bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg shadow-gray-400/30" :
                                                    "bg-gradient-to-br from-amber-700 to-amber-900 shadow-lg shadow-amber-700/30"
                                        )}>
                                            {result.score >= 80 ? <Trophy className="w-12 h-12 text-yellow-900" /> :
                                                result.score >= 60 ? <Award className="w-12 h-12 text-gray-700" /> :
                                                    <Medal className="w-12 h-12 text-amber-200" />}
                                        </div>

                                        <h3 className="font-orbitron text-2xl text-white mb-2">{result.badge.name}</h3>

                                        {/* Score Display */}
                                        <div className="text-6xl font-orbitron font-black text-white mb-2">
                                            {result.score}%
                                        </div>
                                        <p className="text-white/60">
                                            {result.correct} of {result.total} correct • {formatTime(result.timeSpent || 0)}
                                        </p>
                                    </div>

                                    {/* Results Breakdown */}
                                    <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
                                        {result.results.map((r, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "p-4 rounded-xl border flex items-start gap-4",
                                                    r.isCorrect
                                                        ? "border-green-500/30 bg-green-500/10"
                                                        : "border-red-500/30 bg-red-500/10"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                    r.isCorrect ? "bg-green-500" : "bg-red-500"
                                                )}>
                                                    {r.isCorrect ? (
                                                        <Check className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white mb-1 line-clamp-2">{r.question}</p>
                                                    <p className="text-xs text-white/60">{r.explanation}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="p-6 border-t border-white/10 flex gap-4">
                                        <button
                                            onClick={resetQuiz}
                                            className="flex-1 py-4 rounded-xl font-orbitron text-sm uppercase tracking-wider border border-white/20 text-white hover:bg-white/10 transition-all"
                                        >
                                            Back to Quizzes
                                        </button>
                                        <button
                                            onClick={() => startQuiz(result.quizId)}
                                            className="flex-1 py-4 rounded-xl font-orbitron text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Star className="w-4 h-4" />
                                            Try Again
                                        </button>
                                    </div>
                                </GlassPanel>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function getFallbackQuizzes(): QuizSummary[] {
    return [
        {
            id: "solar_system",
            title: "Solar System Explorer",
            description: "Journey through our cosmic neighborhood and test your knowledge of planets, moons, and more",
            difficulty: "beginner",
            icon: "planet",
            questionCount: 5,
        },
        {
            id: "space_missions",
            title: "Space Mission Master",
            description: "From Apollo to Artemis - how well do you know humanity's greatest space exploration achievements?",
            difficulty: "intermediate",
            icon: "rocket",
            questionCount: 5,
        },
        {
            id: "satellites_earth",
            title: "Satellites & Earth Science",
            description: "Discover how orbiting technology helps us understand and protect our home planet",
            difficulty: "intermediate",
            icon: "satellite",
            questionCount: 5,
        },
        {
            id: "cosmic_phenomena",
            title: "Cosmic Phenomena",
            description: "Black holes, supernovae, and aurora - explore the universe's most spectacular events",
            difficulty: "advanced",
            icon: "stars",
            questionCount: 5,
        },
    ];
}

function getFallbackFullQuiz(quizId: string): Quiz | null {
    const quizzes: Record<string, Quiz> = {
        solar_system: {
            id: "solar_system",
            title: "Solar System Explorer",
            description: "Test your knowledge about our cosmic neighborhood",
            difficulty: "beginner",
            icon: "planet",
            questions: [
                { id: 1, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
                { id: 2, question: "How many planets are in our Solar System?", options: ["7", "8", "9", "10"] },
                { id: 3, question: "Which planet is the largest in our Solar System?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"] },
                { id: 4, question: "What is the hottest planet in our Solar System?", options: ["Mercury", "Venus", "Mars", "Earth"] },
                { id: 5, question: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"] },
            ],
        },
        space_missions: {
            id: "space_missions",
            title: "Space Mission Master",
            description: "How well do you know space exploration history?",
            difficulty: "intermediate",
            icon: "rocket",
            questions: [
                { id: 1, question: "What was the first crewed spacecraft to land on the Moon?", options: ["Apollo 10", "Apollo 11", "Apollo 12", "Apollo 13"] },
                { id: 2, question: "Which space telescope was launched in 2021?", options: ["Hubble", "Kepler", "James Webb", "Spitzer"] },
                { id: 3, question: "What rover is currently exploring Mars?", options: ["Curiosity", "Perseverance", "Spirit", "Opportunity"] },
                { id: 4, question: "Which NASA program will return humans to the Moon?", options: ["Apollo", "Artemis", "Orion", "Gateway"] },
                { id: 5, question: "Which agency launched the Europa Clipper mission?", options: ["ESA", "NASA", "SpaceX", "JAXA"] },
            ],
        },
        satellites_earth: {
            id: "satellites_earth",
            title: "Satellites & Earth Science",
            description: "Learn how satellites help us understand Earth",
            difficulty: "intermediate",
            icon: "satellite",
            questions: [
                { id: 1, question: "What do weather satellites primarily observe?", options: ["Stars", "Clouds and storms", "Other planets", "Asteroids"] },
                { id: 2, question: "GPS navigation relies on signals from what?", options: ["Radio towers", "Satellites in orbit", "Ground stations", "Aircraft"] },
                { id: 3, question: "What does NDVI measure from satellite imagery?", options: ["Temperature", "Vegetation health", "Ocean depth", "Wind speed"] },
                { id: 4, question: "Which satellite mission monitors polar ice coverage?", options: ["Hubble", "ICESat-2", "JWST", "Kepler"] },
                { id: 5, question: "How do satellites assist during natural disasters?", options: ["Creating alerts only", "Mapping damage extent", "Stopping earthquakes", "Generating power"] },
            ],
        },
        cosmic_phenomena: {
            id: "cosmic_phenomena",
            title: "Cosmic Phenomena",
            description: "Explore the wonders of the universe",
            difficulty: "advanced",
            icon: "stars",
            questions: [
                { id: 1, question: "What causes the Northern Lights (Aurora Borealis)?", options: ["Moonlight reflection", "Solar wind particles", "Star explosions", "Meteor showers"] },
                { id: 2, question: "What is a solar flare?", options: ["An explosion on the Sun's surface", "A type of meteor", "A moon phase", "A passing comet"] },
                { id: 3, question: "What is a black hole?", options: ["Empty space", "A collapsed star with extreme gravity", "A dark planet", "An asteroid field"] },
                { id: 4, question: "What does the KP Index measure?", options: ["Temperature", "Geomagnetic activity", "Star brightness", "Planet size"] },
                { id: 5, question: "What is a supernova?", options: ["A new star forming", "A massive star explosion", "A type of galaxy", "A meteor shower"] },
            ],
        },
    };
    return quizzes[quizId] || null;
}
