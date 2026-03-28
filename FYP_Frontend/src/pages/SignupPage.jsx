import React, { useState } from "react";
import {
    Box, TextField, Button, Typography, Alert,
    Link as MuiLink, InputAdornment, IconButton,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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

const STEPS = [
    "Create your account in seconds",
    "Grant camera access when prompted",
    "Choose Learn or Quiz mode",
    "Start signing — get real-time sign feedback",
];

export default function SignupPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) { setError("Passwords do not match."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setLoading(true);
        const { error: err } = await signUp(email, password);
        setLoading(false);
        if (err) setError(err.message);
        else { setSuccess(true); setTimeout(() => navigate("/mode"), 2000); }
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            color: "#F8FAFC",
            overflow: "hidden",
        }}>
          \
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: "11px",
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                        display: "grid", placeItems: "center", fontSize: 20,
                        boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                    }}>🤟</Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>EDUSign</Typography>
                </Box>

                <Box>
                    <Typography sx={{
                        fontSize: { md: 34, lg: 42 },
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        mb: 3,
                    }}>
                        Start learning<br />
                        <span style={{ color: "#3b82f6" }}>sign language</span><br />
                        in minutes.
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.35)", mb: 2, fontWeight: 600, letterSpacing: "0.08em" }}>
                        HOW IT WORKS
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {STEPS.map((step, i) => (
                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: "8px",
                                    background: "rgba(59,130,246,0.12)",
                                    border: "1px solid rgba(59,130,246,0.25)",
                                    display: "grid", placeItems: "center", flexShrink: 0,
                                    color: "#3b82f6", fontSize: 12, fontWeight: 800,
                                }}>
                                    {i + 1}
                                </Box>
                                <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>
                                    {step}
                                </Typography>
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
                        Create account
                    </Typography>
                    <Typography sx={{ color: "#94A3B8", fontSize: 14, mb: 4 }}>
                        Join EDUSign and start your ASL learning journey
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

                    {success && (
                        <Alert
                            severity="success"
                            icon={<CheckCircleRoundedIcon sx={{ color: "#10b981" }} />}
                            sx={{
                                mb: 2.5, borderRadius: "12px", fontSize: 13,
                                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                                color: "#6ee7b7",
                            }}
                        >
                            Account created! Redirecting you now…
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Email address" type="email" fullWidth required
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
                        <TextField
                            label="Confirm password" fullWidth required
                            type={showPw ? "text" : "password"}
                            value={confirm} onChange={(e) => setConfirm(e.target.value)}
                            sx={fieldSx}
                        />

                        {/* Password hint */}
                        <Typography sx={{ fontSize: 12, color: "#64748B", mt: -0.5 }}>
                            Minimum 6 characters required
                        </Typography>

                        <Button
                            type="submit" fullWidth variant="contained" disabled={loading || success}
                            sx={{
                                mt: 0.5, py: 1.5, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                                textTransform: "none",
                                background: (loading || success) ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                                color: (loading || success) ? "#64748B" : "#fff",
                                boxShadow: (loading || success) ? "none" : "0 0 32px rgba(37,99,235,0.45)",
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
                            {loading ? "Creating account…" : success ? "✓ Account created!" : "Create Account →"}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                        <Typography sx={{ color: "#64748B", fontSize: 13.5 }}>
                            Already have an account?{" "}
                            <MuiLink
                                component={Link} to="/login"
                                sx={{ color: "#3b82f6", fontWeight: 700, textDecoration: "none", "&:hover": { color: "#60a5fa" } }}
                            >
                                Sign in
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
