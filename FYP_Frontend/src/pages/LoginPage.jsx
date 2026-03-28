import React, { useState } from "react";
import {
    Box, TextField, Button, Typography, Alert,
    Link as MuiLink, InputAdornment, IconButton,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fieldSx = {
    "& .MuiInputBase-root": {
        color: "#F8FAFC",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.05)",
        fontSize: 15,
        transition: "all 0.2s ease",
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
    "& .MuiInputLabel-root": { color: "#64748B", fontSize: 14 },
    "& .MuiInputBase-input": { px: 2, py: 1.6 },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.22)",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
        background: "rgba(59,130,246,0.06)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
        borderWidth: "1px",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

const FEATURES = [
    { icon: "🤟", title: "Real-Time Recognition", desc: "Instant hand gesture analysis powered by CNN" },
    { icon: "🎯", title: "Per-Letter Accuracy", desc: "Track your progress across all 26 ASL letters" },
    { icon: "🏆", title: "Word Building Quizzes", desc: "Spell complete words and earn points" },
    { icon: "☁️", title: "Cloud Progress Sync", desc: "Your stats saved securely to your account" },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error: err } = await signIn(email, password);
        setLoading(false);
        if (err) setError(err.message);
        else navigate("/mode");
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            color: "#F8FAFC",
            overflow: "hidden",
        }}>
            {/* Left panel */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                p: 5,
                position: "relative",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%)",
            }}>
                {/* Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                        width: 40, height: 40,
                        borderRadius: "11px",
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                        display: "grid", placeItems: "center",
                        fontSize: 20,
                        boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                    }}>
                        🤟
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>
                        EDUSign
                    </Typography>
                </Box>

                {/* Hero headline */}
                <Box>
                    <Typography sx={{
                        fontSize: { md: 36, lg: 44 },
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        mb: 2.5,
                    }}>
                        Learn ASL with<br />
                        <span style={{ color: "#3b82f6" }}>technology that sees</span><br />
                        your hands.
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {FEATURES.map((f) => (
                            <Box key={f.title} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <Box sx={{
                                    fontSize: 18, lineHeight: 1, mt: "1px",
                                    width: 36, height: 36,
                                    borderRadius: "10px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    display: "grid", placeItems: "center", flexShrink: 0,
                                }}>
                                    {f.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.2 }}>{f.title}</Typography>
                                    <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{f.desc}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
                    © 2026 EDUSign · FYP Project
                </Typography>
            </Box>

            {/* Right panel – form */}
            <Box sx={{
                flex: { xs: "auto", md: "0 0 460px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 3, sm: 5 },
                py: 5,
                position: "relative",
            }}>
                
                <Box sx={{
                    position: "absolute",
                    top: "20%", left: "50%",
                    transform: "translateX(-50%)",
                    width: 300, height: 250,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }} />

                <Box sx={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease both" }}>
                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 4 }}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: "10px",
                            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                            display: "grid", placeItems: "center", fontSize: 18,
                        }}>🤟</Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 17 }}>EDUSign</Typography>
                    </Box>

                    <Typography sx={{ fontWeight: 900, fontSize: 28, letterSpacing: "-0.02em", mb: 0.8 }}>
                        Welcome back
                    </Typography>
                    <Typography sx={{ color: "#94A3B8", fontSize: 14, mb: 4 }}>
                        Sign in to continue your ASL journey
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{
                            mb: 2.5, borderRadius: "12px", fontSize: 13,
                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#fca5a5", "& .MuiAlert-icon": { color: "#f87171" },
                        }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Email address"
                            type="email" fullWidth required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            sx={fieldSx}
                        />
                        <TextField
                            label="Password" fullWidth required
                            type={showPw ? "text" : "password"}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPw(!showPw)} edge="end" sx={{ color: "#64748B", mr: 0.5 }}>
                                            {showPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={fieldSx}
                        />

                        <Button
                            type="submit" fullWidth variant="contained" disabled={loading}
                            sx={{
                                mt: 1, py: 1.5, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                                textTransform: "none",
                                background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                                color: loading ? "#64748B" : "#fff",
                                boxShadow: loading ? "none" : "0 0 32px rgba(37,99,235,0.45)",
                                letterSpacing: "-0.01em",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                                    boxShadow: "0 0 40px rgba(37,99,235,0.55)",
                                    transform: "translateY(-1px)",
                                },
                                "&:active": { transform: "translateY(0)" },
                                transition: "all 0.2s ease",
                            }}
                        >
                            {loading ? "Signing in…" : "Sign In →"}
                        </Button>
                    </Box>

                    <Box sx={{
                        mt: 3, pt: 3,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        textAlign: "center",
                    }}>
                        <Typography sx={{ color: "#64748B", fontSize: 13.5 }}>
                            Don't have an account?{" "}
                            <MuiLink
                                component={Link} to="/signup"
                                sx={{ color: "#3b82f6", fontWeight: 700, textDecoration: "none", "&:hover": { color: "#60a5fa" } }}
                            >
                                Create one free
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
