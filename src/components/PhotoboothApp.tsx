"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";
import LandingScreen from "./LandingScreen";
import CameraViewport from "./CameraViewport";
import FramePicker from "./FramePicker";
import PhotoSlotEditor from "./PhotoSlotEditor";
import ExportModal from "./ExportModal";

/**
 * PhotoboothApp - Main application orchestrator.
 * Manages step transitions with AnimatePresence mode="wait" (Rules.md §4).
 * Flow: Landing → Camera → Edit → Export (Design.md §1).
 */
export default function PhotoboothApp() {
  const currentStep = usePhotoboothStore((s) => s.currentStep);
  const selectedFrame = usePhotoboothStore((s) => s.selectedFrame);

  return (
    <div className="photobooth-app">
      <AnimatePresence mode="wait">
        {currentStep === "INIT" && (
          <motion.div
            key="init"
            className="step-wrapper"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="init-layout">
              <div className="init-left">
                <LandingScreen />
              </div>
              <div className="init-right">
                <FramePicker />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "CAPTURE" && (
          <motion.div
            key="capture"
            className="step-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CameraViewport />
          </motion.div>
        )}

        {currentStep === "EDIT" && (
          <motion.div
            key="edit"
            className="step-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <PhotoSlotEditor />
          </motion.div>
        )}

        {currentStep === "EXPORT" && (
          <motion.div
            key="export"
            className="step-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ExportModal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame selection reminder if no frame selected and navigating to capture */}
      {currentStep === "CAPTURE" && !selectedFrame && (
        <motion.div
          className="frame-reminder"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p>💡 Tip: Go back and select a frame first for the best experience!</p>
        </motion.div>
      )}
    </div>
  );
}
