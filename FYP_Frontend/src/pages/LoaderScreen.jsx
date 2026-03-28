import React from "react";
import { Box, Typography } from "@mui/material";

export default function LoaderScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
{/* Background animated gradient */}
      <Box sx={{
        position: "absolute",
        top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

 
      <Box sx={{
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        animation: "fadeIn 0.6s ease both",
      }}>
        {/* Logo icon */}
        <Box sx={{
          width: 72, height: 72,
          mx: "auto",
          mb: 3,
          borderRadius: "20px",
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 0 40px rgba(37,99,235,0.5)",
          animation: "floaty 2.6s ease-in-out infinite",
          fontSize: 32,
        }}>
          🤟
        </Box>

        <Typography sx={{
          fontSize: 26,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
          mb: 0.5,
        }}>
          EDUSign
        </Typography>

        <Typography sx={{
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.05em",
          mb: 4,
        }}>
          Sign Language Learning Platform
        </Typography>

        {/* Loader bar */}
        <Box sx={{
          width: 160,
          height: 2,
          mx: "auto",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          overflow: "hidden",
        }}>
          <Box sx={{
            height: "100%",
            width: "40%",
            background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
            borderRadius: 99,
            animation: "shimmer 1.4s ease-in-out infinite",
            backgroundSize: "200% auto",
          }} />
        </Box>
      </Box>
    </Box>
  );
}
