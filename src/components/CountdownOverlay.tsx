"use client";

import { motion } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";

/**
 * CountdownOverlay - 3-2-1 countdown animation before shutter.
 * Full-screen overlay with large animated numbers (Design.md §2.2).
 */
export default function CountdownOverlay() {
  const countdownValue = usePhotoboothStore((s) => s.countdownValue);

  return (
    <motion.div
      className="countdown-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.span
        key={countdownValue}
        className="countdown-number"
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {countdownValue}
      </motion.span>
    </motion.div>
  );
}
