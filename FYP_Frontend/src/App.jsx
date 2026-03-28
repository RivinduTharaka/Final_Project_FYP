import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoaderScreen from "./pages/LoaderScreen";
import ModeSelectScreen from "./pages/ModeSelectScreen";
import LearningPage from "./pages/LearningPage";
import WordBuildingPage from "./pages/WordBuildingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AboutUsPage from "./pages/AboutUsPage";
import FaqPage from "./pages/FaqPage";

/** Auto-redirect loader screen — goes straight to /mode (home) */
function LoaderRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/mode"), 2200);
    return () => clearTimeout(t);
  }, [navigate]);
  return <LoaderScreen />;
}

/** Route guard: redirect to /login if not authenticated */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoaderRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route path="/mode" element={<PrivateRoute><ModeSelectScreen /></PrivateRoute>} />
        <Route path="/learn" element={<PrivateRoute><LearningPage /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><WordBuildingPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutUsPage /></PrivateRoute>} />
        <Route path="/faq" element={<PrivateRoute><FaqPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
