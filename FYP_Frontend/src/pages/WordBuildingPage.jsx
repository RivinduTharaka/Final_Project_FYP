import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Tooltip,
    LinearProgress,
    Stack,
    Chip,
    Dialog,
    Zoom,
    CircularProgress,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PanToolRoundedIcon from "@mui/icons-material/PanToolRounded";

 
const LS_QUIZ_PROGRESS_KEY = "edusign_quiz_progress_v1";
const LS_THEME_KEY = "edusign_quiz_theme_mode";

function loadQuizProgress() {
    try {
        const raw = localStorage.getItem(LS_QUIZ_PROGRESS_KEY);
        return raw ? JSON.parse(raw) : { wordIdx: 0 };
    } catch {
        return { wordIdx: 0 };
    }
}

function saveQuizProgress(wordIdx) {
    localStorage.setItem(LS_QUIZ_PROGRESS_KEY, JSON.stringify({ wordIdx }));
}

// Quiz Words  
const WORDS = [
    { word: "CAT", hint: "A furry pet that meows", emoji: "🐱" },
    { word: "DOG", hint: "Man's best friend", emoji: "🐶" },
    { word: "SUN", hint: "Star at center of solar system", emoji: "☀️" },
    { word: "BAT", hint: "Flying nocturnal mammal", emoji: "🦇" },
    { word: "BOX", hint: "Cardboard container", emoji: "📦" },
];

// Themes 
const THEMES = {
    light: {
        primary: "#2563EB",
        primaryDark: "#1d4ed8",
        secondary: "#3b82f6",
        accent: "#60a5fa",
        background: "#F8FAFC",
        card: "rgba(255, 255, 255, 0.95)",
        cardBorder: "rgba(0, 0, 0, 0.07)",
        textPrimary: "#0A0A0A",
        textSecondary: "#6B7280",
        success: "#10B981",
        divider: "rgba(0, 0, 0, 0.06)",
        neonGlow: "rgba(37,99,235,0.2)",
        glass: "rgba(255, 255, 255, 0.85)",
    },
    dark: {
        primary: "#3B82F6",
        primaryDark: "#2563EB",
        secondary: "#60a5fa",
        accent: "#93c5fd",
        background: "#000000",
        card: "rgba(255, 255, 255, 0.05)",
        cardBorder: "rgba(255, 255, 255, 0.09)",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        success: "#10B981",
        divider: "rgba(255, 255, 255, 0.06)",
        neonGlow: "rgba(37,99,235,0.3)",
        glass: "rgba(255, 255, 255, 0.04)",
    },
};

/**
 * Given a Set of completed word strings from Supabase,
 * find the index of the first word not yet completed.
 */
function pickStartingWordIdx(completedWords) {
    for (let i = 0; i < WORDS.length; i++) {
        if (!completedWords.has(WORDS[i].word)) return i;
    }
    return 0; // all done — wrap back to beginning
}

// Webcam Panel  
function WebcamPanel({ onFrame, running, setRunning, colors: C }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState("");

    const start = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setRunning(true);
        } catch {
            setError("Camera permission denied. Please allow camera access to play.");
            setRunning(false);
        }
    };

    const stop = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRunning(false);
    };

    useEffect(() => () => stop(), []);

    useEffect(() => {
        if (!running) return;
        let rafId = null;
        let lastSent = 0;
        const tick = () => {
            const now = Date.now();
            if (videoRef.current && canvasRef.current && now - lastSent > 350) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                canvas.width = 320;
                canvas.height = 240;
                ctx.drawImage(videoRef.current, 0, 0, 320, 240);
                onFrame?.(canvas.toDataURL("image/jpeg", 0.7));
                lastSent = now;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => rafId && cancelAnimationFrame(rafId);
    }, [running, onFrame]);

    return (
        <Box sx={{ width: "100%", maxWidth: 640, mx: "auto" }}>
            <Box
                sx={{
                    position: "relative",
                    p: "4px",
                    borderRadius: "28px",
                    overflow: "hidden",
                    background: `linear-gradient(45deg, #1d4ed8, #3b82f6, #60a5fa, #2563eb, #1d4ed8)`,
                    backgroundSize: "300% 300%",
                    animation: "gradientFlow 6s linear infinite",
                    boxShadow: running ? `0 0 40px ${C.neonGlow}` : "none",
                    "@keyframes gradientFlow": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                    },
                }}
            >
                <Box sx={{ borderRadius: "24px", overflow: "hidden", aspectRatio: "1.4 / 1", position: "relative", background: C.background, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: running ? "block" : "none" }} />
                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {!running && (
                        <Box sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Box sx={{ fontSize: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>📷</Box>
                            <Typography sx={{ color: "#FFF", fontWeight: 600, fontSize: 16, lineHeight: 1.4, maxWidth: 300 }}>
                                {error || "Camera access required to start the ASL Quiz session."}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={start}
                                sx={{
                                    mt: 1, borderRadius: "40px",
                                    background: "rgba(59, 130, 246, 0.15)",
                                    border: `1px solid ${C.primary}44`,
                                    color: C.primary, textTransform: "none",
                                    fontSize: 13, fontWeight: 700, px: 3,
                                    "&:hover": { background: "rgba(59, 130, 246, 0.25)" }
                                }}
                            >
                                Try Again
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Chip
                    label={running ? "SYSTEM ACTIVE" : "ENGINE STANDBY"}
                    size="small"
                    sx={{
                        background: running ? `${C.success}22` : C.divider,
                        color: running ? C.success : C.textSecondary,
                        fontWeight: 800, fontSize: 10, letterSpacing: 1, px: 1
                    }}
                />
            </Box>
        </Box>
    );
}

// Onboarding Dialog 
function OnboardingDialog({ open, onStart, colors: C }) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    background: C.background,
                    borderRadius: "40px",
                    maxWidth: 550,
                    width: "90%",
                    p: 6,
                    border: `1px solid ${C.cardBorder}`,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                    textAlign: "center"
                }
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Box sx={{ width: 100, height: 100, borderRadius: "50%", background: `${C.success}22`, display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                    <PanToolRoundedIcon sx={{ fontSize: 50, color: C.success }} />
                </Box>

                <Typography variant="body1" sx={{ color: C.textPrimary, fontWeight: 500, lineHeight: 1.6 }}>
                    Learn <span style={{ color: C.primary, fontWeight: 700 }}>ASL signs</span> by showing them to your camera!
                    Match each letter to <span style={{ color: C.secondary, fontWeight: 700 }}>complete the word</span> and earn <span style={{ color: C.primary, fontWeight: 700 }}>points</span>.
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
                    {[
                        { icon: <PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />, label: "Use your camera" },
                        { icon: "🤘", label: "Show ASL signs" },
                        { icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />, label: "Earn points" },
                    ].map((c, i) => (
                        <Box key={i} sx={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: "40px", px: 1.5, py: 0.8, display: "flex", alignItems: "center", gap: 0.8, color: C.textSecondary, fontSize: 11, fontWeight: 600 }}>
                            <Box sx={{ color: C.primary, display: "flex" }}>{c.icon}</Box>
                            {c.label}
                        </Box>
                    ))}
                </Box>

                <Button
                    fullWidth
                    onClick={onStart}
                    sx={{
                        mt: 2, height: 60, borderRadius: "40px", fontSize: 18, fontWeight: 900,
                        textTransform: "none",
                        background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                        color: "#FFF",
                        boxShadow: `0 8px 30px ${C.primary}66`,
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "scale(1.02)", boxShadow: `0 12px 40px ${C.primary}99` }
                    }}
                >
                    Start Quiz 🚀
                </Button>
            </Box>
        </Dialog>
    );
}

//Main Page
export default function WordBuildingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [theme, setTheme] = useState(() => localStorage.getItem(LS_THEME_KEY) || "dark");
    const C = useMemo(() => THEMES[theme], [theme]);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem(LS_THEME_KEY, next);
    };

    const [showOnboarding, setShowOnboarding] = useState(true);

    // Progress state
    const [wordIdx, setWordIdx] = useState(() => {
        const { wordIdx: saved } = loadQuizProgress();
        return Math.min(saved, WORDS.length - 1);
    });
    const [charIdx, setCharIdx] = useState(0);
    const [wordCompleted, setWordCompleted] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);

    // Session counters 
    const [running, setRunning] = useState(false);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [predicting, setPredicting] = useState(false);

    const current = WORDS[wordIdx];
    const targetChar = current.word[charIdx];
    const isLastWord = wordIdx === WORDS.length - 1;

    // fetch completed words from Supabase and sync progress 
    useEffect(() => {
        if (!user) return;

        const syncFromSupabase = async () => {
            setStatsLoading(true);
            try {
                const { data, error } = await supabase
                    .from("quiz_sessions")
                    .select("word, completed")
                    .eq("user_id", user.id)
                    .eq("completed", true);

                if (error) {
                    console.error("[Supabase] Fetch quiz_sessions error:", error);
                    return;
                }

                if (!data || data.length === 0) return; 

                // Build set of remotely completed word strings
                const remoteCompleted = new Set(data.map((r) => r.word));

                // Build set of locally completed words (all words before current index)
                const { wordIdx: localIdx } = loadQuizProgress();
                const localCompleted = new Set(WORDS.slice(0, localIdx).map((w) => w.word));

                // union of both sources so neither overwrites the other
                const mergedCompleted = new Set([...remoteCompleted, ...localCompleted]);

                const newIdx = pickStartingWordIdx(mergedCompleted);

                if (newIdx > localIdx) {
                    setWordIdx(newIdx);
                    saveQuizProgress(newIdx);
                    console.log(`[Supabase] ✅ Progress synced — resuming at "${WORDS[newIdx]?.word}" (index ${newIdx})`);
                }
            } catch (e) {
                console.error("[Supabase] Unexpected sync error:", e);
            } finally {
                setStatsLoading(false);
            }
        };

        syncFromSupabase();
    }, [user]);

    //Word navigation 
    const handleNextWord = useCallback(() => {
        const nextIdx = isLastWord ? 0 : wordIdx + 1;
        setWordIdx(nextIdx);
        saveQuizProgress(nextIdx);
        setCharIdx(0);
        setWordCompleted(false);
    }, [wordIdx, isLastWord]);

    const handleRestartWord = useCallback(() => {
        setCharIdx(0);
        setWordCompleted(false);
    }, []);

    // Letter progression 
    const nextLetter = useCallback(async (finalScore, finalStreak) => {
        const isLastLetter = charIdx >= current.word.length - 1;
        if (!isLastLetter) {
            setCharIdx((prev) => prev + 1);
        } else {
            // Persist completed word to Supabase
            if (user) {
                const { error } = await supabase.from("quiz_sessions").insert({
                    user_id: user.id,
                    word: current.word,
                    score: finalScore,
                    streak: finalStreak,
                    completed: true,
                    played_at: new Date().toISOString(),
                });
                if (error) console.error("[Supabase] quiz_sessions insert error:", error);
                else console.log(`[Supabase] ✅ Word saved: ${current.word}`);
            }
            setWordCompleted(true);
        }
    }, [charIdx, current.word, user]);

    // Frame prediction 
    const onFrame = useCallback(async (dataUrl) => {
        if (!running || predicting || wordCompleted) return;
        setPredicting(true);
        try {
            const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                ? "http://localhost:8000/api/predict"
                : "https://edusign-model.onrender.com/api/predict";

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: dataUrl, target: targetChar, mode: "quiz" }),
            });

            if (res.ok) {
    const data = await res.json();

    // Only count attempt if hand is detected
    if (data.hand_detected) {
        setAttempts((prev) => prev + 1);

        if (data.label === targetChar && data.confidence > 0.6) {
            setCorrectCount((prev) => prev + 1);

            const newStreak = streak + 1;
            const newScore = score + 10;

            setStreak(newStreak);
            setScore(newScore);

            await nextLetter(newScore, newStreak);
        } else {
            setStreak(0);
        }
    }
}
        } catch (e) {
            console.error(e);
        } finally {
            setPredicting(false);
        }
    }, [running, predicting, wordCompleted, targetChar, nextLetter, streak, score]);

    // Render
    return (
        <Box
            sx={{
                height: { xs: "auto", md: "100vh" },
                width: "100vw",
                background: C.background,
                p: { xs: 2, md: 3 },
                color: C.textPrimary,
                display: "flex",
                flexDirection: "column",
                overflow: { xs: "auto", md: "hidden" },
                transition: "all 0.3s ease",
            }}
        >
            <OnboardingDialog open={showOnboarding} onStart={() => setShowOnboarding(false)} colors={C} />

            {/* ── Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <IconButton onClick={() => navigate("/mode")} sx={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.textPrimary }}>
                    <ArrowBackRoundedIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>ASL Quiz</Typography>
                    <Typography sx={{ color: C.textSecondary, fontSize: 13 }}>Word {wordIdx + 1} of {WORDS.length}</Typography>
                </Box>

                <Box sx={{ flex: 1 }} />

                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Cloud sync indicator */}
                    {statsLoading ? (
                        <Tooltip title="Syncing progress from cloud...">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={14} sx={{ color: C.primary }} />
                                <Typography sx={{ fontSize: 10, color: C.textSecondary, fontWeight: 700 }}>SYNCING</Typography>
                            </Box>
                        </Tooltip>
                    ) : user && (
                        <Chip
                            label="☁️ Cloud Synced"
                            size="small"
                            sx={{
                                fontSize: 9, fontWeight: 700, height: 20,
                                background: `${C.success}18`,
                                color: C.success,
                                border: `1px solid ${C.success}33`,
                            }}
                        />
                    )}

                    <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
                        <IconButton onClick={toggleTheme} sx={{ color: C.textPrimary, background: C.card, border: `1px solid ${C.cardBorder}` }}>
                            {theme === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ background: C.card, px: 2, py: 1, borderRadius: "12px", border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 18 }}>🔥</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{streak}</Typography>
                    </Box>
                    <Box sx={{ background: C.card, px: 2, py: 1, borderRadius: "12px", border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 18 }}>✨</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{score}</Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Progress bar */}
            <LinearProgress
                variant="determinate"
                value={(wordIdx / WORDS.length) * 100}
                sx={{
                    height: 6, borderRadius: 3, mb: 2,
                    background: C.divider,
                    "& .MuiLinearProgress-bar": { background: `linear-gradient(45deg, ${C.primary}, ${C.secondary})` }
                }}
            />

        
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, flex: 1, minHeight: 0, mb: 1 }}>

                {/* Left: Camera */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
                    <WebcamPanel onFrame={onFrame} running={running} setRunning={setRunning} colors={C} />
                </Box>

                {/* Right: Quiz Content */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>

                    {/*  Word card with hint and status */}
                    <Card sx={{ background: C.card, borderRadius: "24px", border: `1px solid ${C.cardBorder}`, flex: "0 0 auto", transition: "all 0.3s ease" }}>
                        <CardContent sx={{ textAlign: "center", p: 2.5 }}>
                            <Box sx={{ fontSize: 60, mb: 1 }}>{current.emoji}</Box>
                            <Box sx={{ background: `${C.primary}1A`, py: 0.8, px: 2, borderRadius: "20px", display: "inline-block", mb: 2 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{current.hint}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Typography sx={{
                                    display: "flex", alignItems: "center", gap: 1,
                                    background: wordCompleted
                                        ? `linear-gradient(45deg, ${C.success}, #059669)`
                                        : `linear-gradient(45deg, ${C.primary}, ${C.secondary})`,
                                    px: 2.5, py: 1, borderRadius: "40px",
                                    fontWeight: 900, fontSize: 14, color: "#FFF",
                                    transition: "background 0.3s ease",
                                }}>
                                    {wordCompleted ? "✅ Word complete!" : <><span>👋</span> Sign the letter: {targetChar}</>}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Spelling Slots + Inline Completion Actions */}
                    <Card sx={{ background: C.card, borderRadius: "24px", border: `1px solid ${C.cardBorder}`, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", transition: "all 0.3s ease" }}>
                        <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.textSecondary, letterSpacing: 2, mb: 2, textAlign: "center" }}>
                                SPELL THE WORD
                            </Typography>

                            {/* Letter tiles */}
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: wordCompleted ? 3 : 0 }}>
                                {current.word.split("").map((char, i) => {
                                    const isDone = wordCompleted || i < charIdx;
                                    const isActive = !wordCompleted && i === charIdx;
                                    return (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 54, height: 54, borderRadius: "14px",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                background: isDone ? `${C.success}22` : (isActive ? `${C.primary}1A` : C.divider),
                                                border: isActive ? `2px solid ${C.primary}` : `1px solid ${C.cardBorder}`,
                                                boxShadow: isActive ? `0 0 15px ${C.primary}44` : "none",
                                                transition: "all 0.3s ease",
                                                animation: isActive ? "activeBlink 1.5s infinite" : "none",
                                                "@keyframes activeBlink": {
                                                    "0%": { opacity: 1, transform: "scale(1)" },
                                                    "50%": { opacity: 0.7, transform: "scale(0.95)" },
                                                    "100%": { opacity: 1, transform: "scale(1)" },
                                                }
                                            }}
                                        >
                                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: isDone ? C.success : (isActive ? C.primary : C.textSecondary) }}>
                                                {char}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                           {/* Completion actions */}
                            {wordCompleted && (
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: "16px",
                                        background: `${C.success}0D`,
                                        border: `1px solid ${C.success}33`,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 1.5,
                                        animation: "fadeUp 0.3s ease",
                                        "@keyframes fadeUp": {
                                            from: { opacity: 0, transform: "translateY(8px)" },
                                            to: { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    {/* Success message */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: C.success }} />
                                        <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.success }}>
                                            "{current.word}" complete! +10 points 🎉
                                        </Typography>
                                    </Box>

                                    {/* Action buttons */}
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        {/* Redo Word "Restart" in LearningPage */}
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={handleRestartWord}
                                            sx={{
                                                borderRadius: "10px",
                                                textTransform: "none",
                                                fontWeight: 700,
                                                fontSize: 12,
                                                borderColor: C.textSecondary,
                                                color: C.textSecondary,
                                                "&:hover": { borderColor: C.textPrimary, color: C.textPrimary },
                                            }}
                                        >
                                            🔄 Redo Word
                                        </Button>

                                        {/* Next Word or Restart All if last word */}
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={handleNextWord}
                                            sx={{
                                                borderRadius: "10px",
                                                textTransform: "none",
                                                fontWeight: 700,
                                                fontSize: 12,
                                                background: isLastWord
                                                    ? `linear-gradient(135deg, ${C.primary}, ${C.secondary})`
                                                    : C.success,
                                                boxShadow: `0 4px 12px ${isLastWord ? C.primary : C.success}44`,
                                                "&:hover": {
                                                    background: isLastWord ? C.primaryDark : "#059669",
                                                },
                                                color: "#FFF",
                                            }}
                                        >
                                            {isLastWord ? "🎉 Restart All" : "Next Word →"}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats row */}
                    <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
                        {[
                            { label: "Correct", val: correctCount, icon: "✅", color: C.success },
                            { label: "Attempts", val: attempts, icon: "🎯", color: "#3B82F6" },
                            { label: "Streak", val: streak, icon: "🔥", color: C.primary },
                        ].map((s, i) => (
                            <Card key={i} sx={{ flex: 1, background: C.card, borderRadius: "16px", border: `1px solid ${C.cardBorder}`, transition: "all 0.3s ease" }}>
                                <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                                    <Typography sx={{ fontSize: 14, mb: 0.2 }}>{s.icon}</Typography>
                                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</Typography>
                                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: C.textSecondary }}>{s.label}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}