"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";
import { frameConfigs } from "@/data/frames";

/**
 * FramePicker - Smooth frame selection drawer.
 * Uses Framer Motion layout transitions with spring physics
 * per Design.md §2.1: stiffness: 300, damping: 30, mass: 0.8.
 * AnimatePresence uses mode="wait" per Rules.md §4.
 */

const frameTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

const frameVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.05, y: -10 },
};

const categoryLabels: Record<string, string> = {
  strip: "📋 Strips",
  grid: "🔲 Grids",
  story: "📱 Story",
  square: "⬜ Square",
};

export default function FramePicker() {
  const { selectedFrame, selectFrame } = usePhotoboothStore();

  const categories = [...new Set(frameConfigs.map((f) => f.category))];

  return (
    <div className="frame-picker">
      <h3 className="frame-picker-title">Choose a Frame</h3>
      <p className="frame-picker-desc">
        Select a frame layout for your photobooth session
      </p>

      {categories.map((cat) => (
        <div key={cat} className="frame-picker-category">
          <span className="frame-picker-category-label">
            {categoryLabels[cat] || cat}
          </span>
          <div className="frame-picker-grid">
            <AnimatePresence>
              {frameConfigs
                .filter((f) => f.category === cat)
                .map((frame) => (
                  <motion.button
                    key={frame.id}
                    className={`frame-card ${
                      selectedFrame?.id === frame.id ? "frame-card-selected" : ""
                    }`}
                    variants={frameVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={frameTransition}
                    onClick={() => selectFrame(frame)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    layout
                  >
                    {/* Mini preview of the frame layout */}
                    <div
                      className="frame-card-preview"
                      style={{ backgroundColor: frame.backgroundColor }}
                    >
                      {frame.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="frame-card-slot"
                          style={{
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            width: `${slot.width}%`,
                            height: `${slot.height}%`,
                            borderRadius: slot.borderRadius
                              ? `${Math.min(slot.borderRadius, 4)}px`
                              : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <span className="frame-card-name">{frame.name}</span>
                    <span className="frame-card-count">
                      {frame.slots.length} photo{frame.slots.length !== 1 ? "s" : ""}
                    </span>
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
