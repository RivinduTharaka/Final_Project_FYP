import React, { useEffect, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import backgroundVideo from "../assets/0217.mp4";


const MODES = [
  {
    icon: <SchoolRoundedIcon sx={{ fontSize: 26 }} />,
    tag: "LEARN",
    title: "Learning Mode",
    desc: "Practice every ASL letter with your webcam. Get real-time correct / incorrect feedback and track your streak.",
    cta: "Start Learning",
    route: "/learn",
    accent: "#3b82f6",
    delay: 0,
  },
  {
    icon: <ExtensionRoundedIcon sx={{ fontSize: 26 }} />,
    tag: "QUIZ",
    title: "Word Building",
    desc: "Spell full words letter by letter using sign gestures. Earn points, build streaks, and challenge yourself.",
    cta: "Build Words",
    route: "/quiz",
    accent: "#818cf8",
    delay: 0.08,
  },
  {
    icon: <BarChartRoundedIcon sx={{ fontSize: 26 }} />,
    tag: "STATS",
    title: "My Progress",
    desc: "View your per-letter accuracy heatmap, quiz history, overall score, and improvement trends.",
    cta: "Open Dashboard",
    route: "/dashboard",
    accent: "#34d399",
    delay: 0.16,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Grant Camera Access",
    desc: "Allow the browser to use your webcam — no video is ever recorded or stored.",
    icon: "📷",
  },
  {
    step: "02",
    title: "Hand Tracking Activates",
    desc: "Google MediaPipe maps 21 landmark points on your hand in real-time at 350ms intervals.",
    icon: "🖐️",
  },
  {
    step: "03",
    title: "Model Classifies Your Sign",
    desc: "A custom CNN trained on ASL gestures predicts your letter with confidence scoring.",
    icon: "🧠",
  },
  {
    step: "04",
    title: "Instant Feedback & Save",
    desc: "Results appear immediately. Correct signs level up your stats, saved securely to your account.",
    icon: "⚡",
  },
];

const TECH_STACK = [
  { label: "React + MUI", sublabel: "Frontend", icon: "⚛️" },
  { label: "FastAPI", sublabel: "Backend", icon: "🐍" },
  { label: "MediaPipe", sublabel: "Hand Tracking", icon: "🖐️" },
  { label: "CNN Model", sublabel: "Recognition Engine", icon: "🧠" },
  { label: "Supabase", sublabel: "Database", icon: "☁️" },
];

const STATS = [
  { value: "26", label: "ASL Letters" },
  { value: "21", label: "Hand Landmarks" },
  { value: "350ms", label: "Prediction Speed" },
  { value: "Real-Time", label: "Feedback" },
];

/*  Sub-components  */
function NavBtn({ onClick, icon, label }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex", alignItems: "center", gap: 0.7,
        cursor: "pointer", px: 1.5, py: 0.8, borderRadius: "10px",
        color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500,
        transition: "all 0.18s ease",
        "&:hover": { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)" },
        userSelect: "none",
      }}
    >
      {icon}{label}
    </Box>
  );
}

function ModeCard({ icon, tag, title, desc, cta, route, accent, delay, navigate }) {
  return (
    <Box
      onClick={() => navigate(route)}
      sx={{
        cursor: "pointer",
        borderRadius: "22px",
        p: { xs: 2.5, md: 3 },
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(14px)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        animation: `fadeUp 0.6s ease ${delay}s both`,
        "&:hover": {
          background: "rgba(255,255,255,0.07)",
          border: `1px solid ${accent}40`,
          transform: "translateY(-4px)",
          boxShadow: `0 24px 60px ${accent}18`,
        },
        "&:hover .card-line": { opacity: 1 },
        "&:hover .card-arrow": { transform: "translateX(4px)", opacity: 1 },
      }}
    >
      <Box className="card-line" sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${accent}77, transparent)`,
        opacity: 0, transition: "opacity 0.3s ease",
      }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: "13px",
          background: `${accent}15`, border: `1px solid ${accent}28`,
          display: "grid", placeItems: "center", color: accent,
        }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: accent, opacity: 0.85 }}>
          {tag}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff", mb: 1.2, letterSpacing: "-0.02em" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, mb: 3 }}>
        {desc}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "rgba(255,255,255,0.6)" }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{cta}</Typography>
        <ArrowForwardRoundedIcon className="card-arrow" sx={{ fontSize: 16, opacity: 0.4, transition: "all 0.2s ease" }} />
      </Box>
    </Box>
  );
}

/* Main Component */
export default function ModeSelectScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const heroRef = useRef(null);

  const handleSignOut = async () => { await signOut(); navigate("/login"); };

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#000", color: "#fff", overflowX: "hidden" }}>

      {/* Background video*/}
      <Box ref={heroRef} sx={{ position: "fixed", inset: 0, zIndex: 0, background: "#000", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", willChange: "transform" }}>

        <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%", maxHeight: "100%" }}>
          <Box
            component="video"
            src={backgroundVideo}
            autoPlay loop muted playsInline
            sx={{
              display: "block",
              maxWidth: "100vw",
              maxHeight: "100vh",
              width: "auto",
              height: "auto",
              opacity: 0.16
            }}
          />
          <Box sx={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 150px 100px #000", pointerEvents: "none", zIndex: 1 }} />
        </Box>

        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
      </Box>

      {/*  Blue ambient glow */}
      <Box sx={{
        position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 900, height: 600, borderRadius: "50%", zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(37,99,235,0.14) 0%, transparent 70%)",
        filter: "blur(70px)",
      }} />

    
      <Box sx={{
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(0,0,0,0.6)",
      }}>
        <Box sx={{
          maxWidth: 1200, mx: "auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: { xs: 2.5, md: 5 }, py: 1.8,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: "9px",
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              display: "grid", placeItems: "center", fontSize: 17,
              boxShadow: "0 0 18px rgba(59,130,246,0.45)",
            }}>🤟</Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>EDUSign</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <NavBtn onClick={() => navigate("/about")} icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />} label="About" />
            <NavBtn onClick={() => navigate("/faq")} icon={<HelpOutlineRoundedIcon sx={{ fontSize: 15 }} />} label="FAQ" />
            <Box sx={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.12)", mx: 0.5, flexShrink: 0 }} />
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.8,
              cursor: "pointer", px: 1.5, py: 0.8, borderRadius: "10px",
              color: "#ef4444", fontSize: 13, fontWeight: 600,
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
              "&:hover": { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)" },
              userSelect: "none",
            }} onClick={handleSignOut}>
              <LogoutRoundedIcon sx={{ fontSize: 14 }} />Sign Out
            </Box>
          </Box>
        </Box>
      </Box>

 
      <Box sx={{ position: "relative", zIndex: 2 }}>

        <Box sx={{
          maxWidth: 1200, mx: "auto",
          px: { xs: 3, md: 8 },
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
        }}>
   
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 0.8,
            px: 1.8, py: 0.7, mb: 3.5, borderRadius: "99px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)",
            animation: "fadeUp 0.5s ease both",
          }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#3b82f6", animation: "pulse-dot 1.6s ease-in-out infinite",
            }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.06em" }}>
              REAL-TIME · SIGN RECOGNITION
            </Typography>
          </Box>

          {/* Greeting */}
          <Typography sx={{
            fontSize: { xs: 13, md: 15 }, color: "rgba(255,255,255,0.38)",
            fontWeight: 500, mb: 1.5, animation: "fadeUp 0.5s ease 0.05s both",
          }}>
            Good to see you, <span style={{ color: "rgba(255,255,255,0.65)" }}>
              {user?.email?.split("@")[0]}
            </span> 👋
          </Typography>

      {/*  Main headline */}
          <Typography sx={{
            fontSize: { xs: 42, sm: 60, md: 78 },
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            mb: 3,
            animation: "fadeUp 0.6s ease 0.08s both",
          }}>
            Learn{" "}
            <span style={{
              background: "linear-gradient(135deg, #3b82f6, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Sign Language</span>
            <br />the smart way.
          </Typography>

          <Typography sx={{
            fontSize: { xs: 15, md: 18 },
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.75,
            maxWidth: 580,
            mx: "auto",
            mb: 5,
            animation: "fadeUp 0.6s ease 0.12s both",
          }}>
            Point your webcam, start signing — get instant, per-letter feedback
            and tracks your accuracy across all 26 ASL letters.
          </Typography>

          
          <Box sx={{
            display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap",
            animation: "fadeUp 0.6s ease 0.16s both",
          }}>
            <Button
              onClick={() => navigate("/learn")}
              sx={{
                px: 4, py: 1.6, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                textTransform: "none",
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                color: "#fff",
                boxShadow: "0 0 36px rgba(37,99,235,0.45)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1e40af, #2563eb)",
                  boxShadow: "0 0 50px rgba(37,99,235,0.6)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.22s ease",
              }}
            >
              Start Learning →
            </Button>
            <Button
              onClick={() => navigate("/quiz")}
              sx={{
                px: 4, py: 1.6, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                textTransform: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.04)",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.25)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.22s ease",
              }}
            >
              Try Word Quiz
            </Button>
          </Box>
        </Box>

        {/* STATS BAR */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Box sx={{
            maxWidth: 1200, mx: "auto",
            px: { xs: 3, md: 8 }, py: { xs: 4, md: 5 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 3,
          }}>
            {STATS.map((s, i) => (
              <Box key={s.label} sx={{ textAlign: "center", animation: `fadeUp 0.5s ease ${0.05 * i}s both` }}>
                <Typography sx={{
                  fontSize: { xs: 28, md: 38 },
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", fontWeight: 600, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* MODE CARDS */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 8 }, py: { xs: 8, md: 12 } }}>
          <Box sx={{ mb: 6, animation: "fadeUp 0.5s ease both" }}>
            <Typography sx={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              color: "#3b82f6", mb: 1.5,
            }}>
              PRACTICE MODES
            </Typography>
            <Typography sx={{
              fontSize: { xs: 28, md: 38 }, fontWeight: 900,
              letterSpacing: "-0.03em", lineHeight: 1.1,
            }}>
              Choose how you want<br />to practice today
            </Typography>
          </Box>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
            gap: 2.5,
          }}>
            {MODES.map((m) => (
              <ModeCard key={m.route} {...m} navigate={navigate} />
            ))}
          </Box>
        </Box>

        {/* HOW IT WORKS */}
        <Box sx={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 8 }, py: { xs: 8, md: 12 } }}>
            <Box sx={{ textAlign: "center", mb: 8, animation: "fadeUp 0.5s ease both" }}>
              <Typography sx={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
                color: "#3b82f6", mb: 1.5,
              }}>
                HOW IT WORKS
              </Typography>
              <Typography sx={{
                fontSize: { xs: 28, md: 38 }, fontWeight: 900,
                letterSpacing: "-0.03em",
              }}>
                From camera to<br />instant feedback in 350ms
              </Typography>
            </Box>

            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: { xs: 3, md: 4 },
              position: "relative",
            }}>
              {/* Connecting line (desktop) */}
              <Box sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: "30px", left: "12.5%", right: "12.5%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(59,130,246,0.3), transparent)",
                zIndex: 0,
              }} />

              {HOW_IT_WORKS.map((step, i) => (
                <Box key={step.step} sx={{
                  textAlign: "center",
                  position: "relative", zIndex: 1,
                  animation: `fadeUp 0.5s ease ${0.08 * i}s both`,
                }}>
                  <Box sx={{
                    width: 60, height: 60, borderRadius: "16px",
                    mx: "auto", mb: 2,
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    display: "grid", placeItems: "center",
                    fontSize: 26,
                    position: "relative",
                  }}>
                    {step.icon}
                    <Box sx={{
                      position: "absolute", top: -10, right: -10,
                      width: 22, height: 22, borderRadius: "7px",
                      background: "#3b82f6",
                      display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em",
                    }}>
                      {step.step}
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 1, letterSpacing: "-0.01em" }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                    {step.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* TECHNOLOGY SHOWCASE */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 8 }, py: { xs: 8, md: 12 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 6, md: 8 }, alignItems: "center" }}>
            {/* Left */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#3b82f6", mb: 1.5 }}>
                TECHNOLOGY
              </Typography>
              <Typography sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, mb: 2.5 }}>
                Built with cutting-edge<br />computer vision & web tech
              </Typography>
              <Typography sx={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, mb: 3.5 }}>
                EDUSign combines Google's MediaPipe for precise 3D hand landmark detection with a
                custom Convolutional Neural Network (CNN) trained on ASL gesture data. The result
                is a sub-350ms prediction pipeline running entirely in your browser.
              </Typography>
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                px: 2, py: 1, borderRadius: "10px",
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                color: "rgba(255,255,255,0.55)", fontSize: 13.5,
              }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "pulse-dot 2s ease-in-out infinite" }} />
                Privacy by design — video never stored or transmitted
              </Box>
            </Box>

            {/* tech cards */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              {TECH_STACK.map((t, i) => (
                <Box key={t.label} sx={{
                  display: "flex", alignItems: "center", gap: 2,
                  p: 2.2, borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.2s ease",
                  animation: `fadeUp 0.5s ease ${0.06 * i}s both`,
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    transform: "translateX(4px)",
                  },
                }}>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: "12px",
                    background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.18)",
                    display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0,
                  }}>
                    {t.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{t.label}</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{t.sublabel}</Typography>
                  </Box>
                  <Box sx={{ ml: "auto" }}>
                    <Box sx={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#10b981",
                    }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* CALL TO ACTION BANNER */}
        <Box sx={{ px: { xs: 3, md: 8 }, pb: { xs: 8, md: 10 } }}>
          <Box sx={{
            maxWidth: 1200, mx: "auto",
            borderRadius: "28px",
            p: { xs: 4, md: 7 },
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(99,102,241,0.12) 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
            position: "relative", overflow: "hidden",
          }}>
            <Box sx={{
              position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
              width: 500, height: 300, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(37,99,235,0.25) 0%, transparent 70%)",
              filter: "blur(50px)", pointerEvents: "none",
            }} />
            <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, letterSpacing: "-0.03em", mb: 1.5, position: "relative" }}>
              Ready to start signing?
            </Typography>
            <Typography sx={{ fontSize: 16, color: "rgba(255,255,255,0.5)", mb: 4, position: "relative" }}>
              Pick a mode and begin your ASL learning session right now.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Button
                onClick={() => navigate("/learn")}
                sx={{
                  px: 4, py: 1.6, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                  color: "#fff",
                  boxShadow: "0 0 36px rgba(37,99,235,0.45)",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 0 50px rgba(37,99,235,0.6)" },
                  transition: "all 0.22s ease",
                }}
              >
                Start Learning Mode →
              </Button>
              <Button
                onClick={() => navigate("/quiz")}
                sx={{
                  px: 4, py: 1.6, borderRadius: "14px", fontWeight: 700, fontSize: 15,
                  textTransform: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.06)",
                  "&:hover": { background: "rgba(255,255,255,0.1)", transform: "translateY(-2px)" },
                  transition: "all 0.22s ease",
                }}
              >
                Try Word Building
              </Button>
            </Box>
          </Box>
        </Box>

        {/* footer */}
        <Box sx={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          px: { xs: 3, md: 8 }, py: 3,
        }}>
          <Box sx={{
            maxWidth: 1200, mx: "auto",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: "8px",
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                display: "grid", placeItems: "center", fontSize: 14,
              }}>🤟</Box>
              <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
                EDUSign · AI Sign Language Learning · 2026 FYP Project
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              {[
                ["About", "/about"],
                ["FAQ", "/faq"],
                ["Dashboard", "/dashboard"],
              ].map(([label, path]) => (
                <Typography
                  key={label}
                  onClick={() => navigate(path)}
                  sx={{
                    fontSize: 13, color: "rgba(255,255,255,0.25)",
                    cursor: "pointer", transition: "color 0.18s ease",
                    "&:hover": { color: "rgba(255,255,255,0.6)" },
                    userSelect: "none",
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
