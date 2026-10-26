"use client";

import { motion } from "framer-motion";

/**
 * FlashOverlay - Camera flash effect.
 * Full-screen white overlay animating opacity from 1 to 0 over 300ms
 * with easeOut timing (Design.md §2.2).
 */
export default function FlashOverlay() {
  return (
    <motion.div
      className="flash-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
}
