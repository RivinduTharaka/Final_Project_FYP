import React, { useState } from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../assets/0217.mp4";

const C = {
    text: "#F8FAFC",
    sub: "rgba(255,255,255,0.55)",
    card: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    primary: "#3b82f6",
};

const faqs = [
    {
        q: "How does the hand tracking and sign recognition work?",
        a: "EDUSign uses Google's MediaPipe to locate 21 specific 3D landmarks on your hand. Those coordinates are fed into our custom Convolutional Neural Network (CNN) which predicts the exact ASL letter you are signing in real-time.",
    },
    {
        q: "Do I need a fast internet connection?",
        a: "You need a stable connection to load the website and communicate with the recognition server. The app uses compressed coordinate vectors (not video streams), making it fast even on average internet speeds.",
    },
    {
        q: "Is my webcam video saved anywhere?",
        a: "No. Your privacy is completely secure. We never store or record your video feed. The browser extracts mathematical hand coordinates and discards the image instantly — only abstract numbers are sent to the model.",
    },
    {
        q: "Why do I have to sign a letter 3 times in Learning Mode?",
        a: "Repetition builds muscle memory. Requiring 3 consecutive correct signs ensures you're genuinely mastering the correct hand posture — not just getting lucky — before moving on.",
    },
    {
        q: "How is my progress tracked?",
        a: "Your performance is securely saved to a cloud database (Supabase) linked to your email. You can view per-letter accuracy rates and quiz history anytime in the Dashboard.",
    },
    {
        q: "What browsers are supported?",
        a: "EDUSign works best on modern Chromium-based browsers (Chrome, Edge, Brave) and Firefox. Safari has limited webcam support on some devices.",
    },
];

function FaqItem({ q, a, index }) {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                background: open ? "rgba(59,130,246,0.05)" : C.card,
                border: `1px solid ${open ? "rgba(59,130,246,0.2)" : C.border}`,
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                animation: `fadeUp 0.5s ease ${0.05 + index * 0.05}s both`,
            }}
        >
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    px: 2.5, py: 2,
                    cursor: "pointer",
                    "&:hover": { background: "rgba(255,255,255,0.03)" },
                    userSelect: "none",
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, md: 15 }, color: C.text, pr: 2 }}>
                    {q}
                </Typography>
                <Box sx={{
                    width: 28, height: 28,
                    borderRadius: "8px",
                    background: open ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${open ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    color: open ? C.primary : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s ease",
                }}>
                    {open
                        ? <RemoveRoundedIcon sx={{ fontSize: 14 }} />
                        : <AddRoundedIcon sx={{ fontSize: 14 }} />
                    }
                </Box>
            </Box>

            {open && (
                <Box sx={{
                    px: 2.5, pb: 2.5, pt: 0,
                    animation: "fadeIn 0.2s ease both",
                }}>
                    <Box sx={{ height: 1, background: "rgba(255,255,255,0.06)", mb: 2 }} />
                    <Typography sx={{ fontSize: 14, color: C.sub, lineHeight: 1.75 }}>
                        {a}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default function FaqPage() {
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

                <Box sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                }} />
            </Box>

            <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, pt: { xs: 4, md: 6 }, pb: 10 }}>
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
                        Frequently Asked Questions
                    </Typography>
                </Box>

                {/* Badge & subtitle */}
                <Box sx={{ mb: 4, animation: "fadeUp 0.5s ease 0.04s both" }}>
                    <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: C.sub, lineHeight: 1.7, maxWidth: 500 }}>
                        Got questions about how EDUSign works? We've got answers.
                    </Typography>
                </Box>

                {/* FAQ items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                    ))}
                </Box>

                <Box sx={{
                    mt: 5, p: 3,
                    borderRadius: "16px",
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    textAlign: "center",
                    animation: "fadeUp 0.5s ease 0.4s both",
                }}>
                    <Typography sx={{ color: C.sub, fontSize: 14, lineHeight: 1.7 }}>
                        Still have questions?{" "}
                        <span
                            onClick={() => navigate("/about")}
                            style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}
                        >
                            Learn more about EDUSign →
                        </span>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
