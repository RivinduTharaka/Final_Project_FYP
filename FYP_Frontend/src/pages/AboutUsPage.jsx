import React from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../assets/0217.mp4";

const C = {
    text: "#F8FAFC",
    sub: "rgba(255,255,255,0.55)",
    muted: "rgba(255,255,255,0.35)",
    card: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    primary: "#3b82f6",
};

const features = [
    {
        emoji: "🎯",
        title: "The Mission",
        body: "Traditional ASL learning relies on static images with no feedback. EDUSign uses your webcam to track hand movements in 3D space and provides instant neural-network-driven feedback on your signing accuracy.",
    },
    {
        emoji: "🧠",
        title: "The Technology",
        body: "Built with React + Material UI on the frontend. Powered by a custom Convolutional Neural Network (CNN) on a Python FastAPI backend, integrated with Google's MediaPipe for precise 21-point hand landmark tracking.",
    },
    {
        emoji: "🔒",
        title: "Privacy First",
        body: "Your webcam video is never stored or streamed. Only abstract hand coordinates are sent to the model server — your privacy is always protected.",
    },
    {
        emoji: "📈",
        title: "Track Progress",
        body: "Every session is saved to your personal account. View per-letter accuracy rates, word-building scores, and your overall learning trajectory from the Dashboard.",
    },
];

export default function AboutUsPage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100vh", background: "#000", color: C.text, position: "relative", overflow: "hidden" }}>
            {/* Background video */}
            <Box sx={{ position: "fixed", inset: 0, zIndex: 0, background: "#000", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>

                <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%", maxHeight: "100%" }}>
                    <Box
                        component="video"
                        autoPlay loop muted playsInline
                        src={backgroundVideo}
                        sx={{
                            display: "block",
                            maxWidth: "100vw",
                            maxHeight: "100vh",
                            width: "auto",
                            height: "auto",
                            opacity: 0.14,
                        }}
                    />
                    <Box sx={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 150px 100px #000", pointerEvents: "none", zIndex: 1 }} />
                </Box>

                {/* Gradient overlay */}
                <Box sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                }} />
            </Box>

            <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, pt: { xs: 4, md: 6 }, pb: 10 }}>
                {/* Header */}
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 2, mb: 6,
                    animation: "fadeUp 0.5s ease both",
                }}>
                    <IconButton
                        onClick={() => navigate("/mode")}
                        sx={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: C.text,
                            "&:hover": { background: "rgba(255,255,255,0.1)" },
                        }}
                    >
                        <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: 24, md: 30 }, letterSpacing: "-0.02em" }}>
                        About Us
                    </Typography>
                </Box>

               
                <Box sx={{ mb: 6, animation: "fadeUp 0.5s ease 0.05s both" }}>
                    <Box sx={{
                        display: "inline-flex", alignItems: "center", gap: 0.8,
                        px: 1.5, py: 0.6,
                        borderRadius: "99px",
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        mb: 2.5,
                    }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: "0.08em" }}>
                            FINAL YEAR PROJECT · 2026
                        </Typography>
                    </Box>

                    <Typography sx={{
                        fontSize: { xs: 26, md: 36 },
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        mb: 2,
                    }}>
                        Learn sign language with{" "}
                        <span style={{ color: C.primary }}>the smart way.</span>
                    </Typography>

                    <Typography sx={{
                        fontSize: { xs: 14, md: 16 },
                        color: C.sub,
                        lineHeight: 1.8,
                        maxWidth: 600,
                    }}>
                        EDUSign is an interactive sign language learning platform built around real-time hand gesture recognition.
                        Our goal is to break down communication barriers by making sign language learning
                        engaging, accessible, and accurate — with real-time feedback from any device.
                    </Typography>
                </Box>

         
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                }}>
                    {features.map((f, i) => (
                        <Box key={f.title} sx={{
                            background: C.card,
                            border: `1px solid ${C.border}`,
                            borderRadius: "18px",
                            p: 3,
                            backdropFilter: "blur(12px)",
                            animation: `fadeUp 0.5s ease ${0.1 + i * 0.06}s both`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                transform: "translateY(-2px)",
                            },
                        }}>
                            <Typography sx={{ fontSize: 28, mb: 1.5 }}>{f.emoji}</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1, letterSpacing: "-0.01em" }}>
                                {f.title}
                            </Typography>
                            <Typography sx={{ fontSize: 13.5, color: C.sub, lineHeight: 1.7 }}>
                                {f.body}
                            </Typography>
                        </Box>
                    ))}
                </Box>

              
                <Box sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: "18px",
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    animation: "fadeUp 0.5s ease 0.35s both",
                }}>
                    <Typography sx={{ fontSize: 13.5, color: C.sub, lineHeight: 1.8, textAlign: "center" }}>
                        🎓 Built as a Final Year Project · Powered by React, FastAPI, MediaPipe & CNN ·
                        {" "}<span style={{ color: C.primary }}>EDUSign 2026</span>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
