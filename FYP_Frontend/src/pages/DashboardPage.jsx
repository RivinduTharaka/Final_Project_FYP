import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, IconButton,
    Tooltip, LinearProgress, Chip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const C = {
    bg: "#000",
    card: "rgba(255,255,255,0.04)",
    cardHover: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.08)",
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    text: "#F8FAFC",
    sub: "#94A3B8",
};

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const cardSx = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
    boxShadow: "none",
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const [letterStats, setLetterStats] = useState([]);
    const [quizSessions, setQuizSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const [{ data: ls }, { data: qs }] = await Promise.all([
                supabase.from("letter_stats").select("*").eq("user_id", user.id),
                supabase.from("quiz_sessions").select("*").eq("user_id", user.id).order("played_at", { ascending: false }).limit(10),
            ]);
            setLetterStats(ls || []);
            setQuizSessions(qs || []);
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const totalAttempts = letterStats.reduce((s, r) => s + (r.attempts || 0), 0);
    const totalCorrect = letterStats.reduce((s, r) => s + (r.correct || 0), 0);
    const overallAcc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    const getStatsForLetter = (letter) =>
        letterStats.find((r) => r.letter === letter) || { attempts: 0, correct: 0 };

    const handleSignOut = async () => { await signOut(); navigate("/login"); };

    const statItems = [
        { label: "Total Attempts", value: totalAttempts, color: C.primary, bg: "rgba(59,130,246,0.1)" },
        { label: "Correct Signs", value: totalCorrect, color: C.success, bg: "rgba(16,185,129,0.1)" },
        { label: "Overall Accuracy", value: `${overallAcc}%`, color: overallAcc >= 70 ? C.success : C.warning, bg: overallAcc >= 70 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)" },
        { label: "Letters Practiced", value: letterStats.length, color: C.text, bg: "rgba(255,255,255,0.06)" },
    ];

    return (
        <Box sx={{
            minHeight: "100vh",
            background: C.bg,
            color: C.text,
            position: "relative",
            overflow: "hidden",
        }}>
         
            <Box sx={{
                position: "fixed",
                top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 700, height: 400,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            <Box sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: 1100,
                mx: "auto",
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 4 },
            }}>
                {/* Header */}
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 2, mb: 4,
                    animation: "fadeUp 0.5s ease both",
                }}>
                    <Tooltip title="Back to Home">
                        <IconButton
                            onClick={() => navigate("/mode")}
                            sx={{
                                background: C.card,
                                border: `1px solid ${C.border}`,
                                color: C.text,
                                "&:hover": { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" },
                            }}
                        >
                            <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em" }}>
                            My Progress
                        </Typography>
                        <Typography sx={{ color: C.sub, fontSize: 12, mt: 0.3 }}>
                            {user?.email}
                        </Typography>
                    </Box>

                    <Tooltip title="Sign Out">
                        <IconButton
                            onClick={handleSignOut}
                            sx={{
                                background: "rgba(239,68,68,0.06)",
                                border: "1px solid rgba(239,68,68,0.15)",
                                color: "rgba(239,68,68,0.7)",
                                "&:hover": { background: "rgba(239,68,68,0.12)", color: "#ef4444" },
                            }}
                        >
                            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {loading ? (
                    <Box sx={{ pt: 4 }}>
                        <LinearProgress
                            sx={{
                                borderRadius: 99,
                                background: "rgba(255,255,255,0.06)",
                                "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #1d4ed8, #3b82f6)", borderRadius: 99 },
                            }}
                        />
                        <Typography sx={{ color: C.sub, fontSize: 13, mt: 2, textAlign: "center" }}>
                            Loading your stats…
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Stat cards */}
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                            gap: 2,
                            animation: "fadeUp 0.5s ease 0.05s both",
                        }}>
                            {statItems.map((s) => (
                                <Box key={s.label} sx={{
                                    ...cardSx,
                                    p: 2.5,
                                    textAlign: "center",
                                    transition: "all 0.2s ease",
                                    "&:hover": { background: C.cardHover, border: "1px solid rgba(255,255,255,0.12)" },
                                }}>
                                    <Typography sx={{ fontSize: 32, fontWeight: 900, color: s.color, mb: 0.5 }}>
                                        {s.value}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: C.sub, fontWeight: 600, letterSpacing: "0.04em" }}>
                                        {s.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                       
                        <Card sx={{ ...cardSx, animation: "fadeUp 0.5s ease 0.1s both" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>
                                        Letter Accuracy — A to Z
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: C.sub }}>
                                        {letterStats.length} / 26 practiced
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {LETTERS.map((letter) => {
                                        const s = getStatsForLetter(letter);
                                        const acc = s.attempts ? Math.round((s.correct / s.attempts) * 100) : null;
                                        const col = acc === null ? C.sub : acc >= 70 ? C.success : acc >= 40 ? C.warning : C.error;
                                        return (
                                            <Box key={letter} sx={{
                                                width: 52, height: 60,
                                                textAlign: "center",
                                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                                gap: 0.3,
                                                p: 0.8,
                                                borderRadius: "10px",
                                                border: `1px solid ${acc !== null ? col + "33" : C.border}`,
                                                background: acc !== null ? `${col}10` : "transparent",
                                                transition: "all 0.15s ease",
                                                "&:hover": { transform: "scale(1.05)", border: `1px solid ${acc !== null ? col + "66" : "rgba(255,255,255,0.15)"}` },
                                            }}>
                                                <Typography sx={{ fontWeight: 900, fontSize: 18, color: acc !== null ? col : C.sub, lineHeight: 1 }}>
                                                    {letter}
                                                </Typography>
                                                <Typography sx={{ fontSize: 9, color: acc !== null ? col : "rgba(255,255,255,0.25)", fontWeight: 700 }}>
                                                    {acc !== null ? `${acc}%` : "—"}
                                                </Typography>
                                                {s.attempts > 0 && (
                                                    <Typography sx={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>
                                                        {s.correct}/{s.attempts}
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Quiz sessions */}
                        <Card sx={{ ...cardSx, animation: "fadeUp 0.5s ease 0.15s both" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em", mb: 2.5 }}>
                                    Recent Quiz Sessions
                                </Typography>

                                {quizSessions.length === 0 ? (
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography sx={{ fontSize: 32, mb: 1 }}>📝</Typography>
                                        <Typography sx={{ color: C.sub, fontSize: 14 }}>
                                            No quiz sessions yet. Try the Word Building mode!
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        {quizSessions.map((q) => (
                                            <Box key={q.id} sx={{
                                                display: "flex", alignItems: "center", gap: 2,
                                                p: 1.8,
                                                borderRadius: "12px",
                                                border: `1px solid ${C.border}`,
                                                background: "rgba(255,255,255,0.02)",
                                                transition: "all 0.15s ease",
                                                "&:hover": { background: "rgba(255,255,255,0.04)" },
                                            }}>
                                                <Box sx={{
                                                    width: 38, height: 38,
                                                    borderRadius: "10px",
                                                    background: "rgba(59,130,246,0.1)",
                                                    border: "1px solid rgba(59,130,246,0.2)",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    fontSize: 18,
                                                    flexShrink: 0,
                                                }}>
                                                    📝
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                                                        {q.word}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 11, color: C.sub, mt: 0.2 }}>
                                                        {new Date(q.played_at).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                                                    <Chip
                                                        label={`Score: ${q.score}`}
                                                        size="small"
                                                        sx={{
                                                            background: "rgba(59,130,246,0.12)",
                                                            color: C.primary,
                                                            fontWeight: 700,
                                                            border: "1px solid rgba(59,130,246,0.2)",
                                                            borderRadius: "8px",
                                                            fontSize: 11,
                                                        }}
                                                    />
                                                    {q.completed && (
                                                        <Chip
                                                            label="✓ Done"
                                                            size="small"
                                                            sx={{
                                                                background: "rgba(16,185,129,0.1)",
                                                                color: C.success,
                                                                fontWeight: 700,
                                                                border: "1px solid rgba(16,185,129,0.2)",
                                                                borderRadius: "8px",
                                                                fontSize: 11,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
