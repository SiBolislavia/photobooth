"use client";

import { motion } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";

/**
 * LandingScreen - The hero landing page with a start button.
 * Displays a stunning glassmorphic design with animated background.
 */
export default function LandingScreen() {
  const setStep = usePhotoboothStore((s) => s.setStep);

  return (
    <div className="landing-screen">
      {/* Animated background orbs */}
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />
      <div className="landing-orb landing-orb-3" />

      <motion.div
        className="landing-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo / Icon */}
        <motion.div
          className="landing-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="landing-camera-svg"
          >
            <rect x="8" y="20" width="64" height="48" rx="12" fill="url(#camGrad)" />
            <rect x="28" y="10" width="24" height="14" rx="4" fill="url(#camGrad2)" />
            <circle cx="40" cy="44" r="14" fill="#0f0f23" />
            <circle cx="40" cy="44" r="10" fill="#3b82f6" opacity="0.6" />
            <circle cx="40" cy="44" r="5" fill="#fff" opacity="0.9" />
            <circle cx="58" cy="28" r="3" fill="#f43f5e" />
            <defs>
              <linearGradient id="camGrad" x1="8" y1="20" x2="72" y2="68">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="camGrad2" x1="28" y1="10" x2="52" y2="24">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Photobooth
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Capture moments, choose frames, and export stunning photo strips — all
          right in your browser.
        </motion.p>

        <motion.button
          className="landing-start-btn"
          onClick={() => setStep("CAPTURE")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="landing-btn-icon">📸</span>
          Start Photobooth
        </motion.button>

        <motion.div
          className="landing-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {/* <div className="landing-feature-item">
            <span className="landing-feature-icon">🔒</span>
            <span>100% Client-Side</span>
          </div>
          <div className="landing-feature-item">
            <span className="landing-feature-icon">🖼️</span>
            <span>Multiple Frames</span>
          </div>
          <div className="landing-feature-item">
            <span className="landing-feature-icon">⬇️</span>
            <span>High-Res Export</span>
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
