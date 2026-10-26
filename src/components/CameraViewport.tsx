"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";
import { startCamera, stopCamera, captureFrame } from "@/utils/camera";
import { frameConfigs } from "@/data/frames";
import CountdownOverlay from "./CountdownOverlay";
import FlashOverlay from "./FlashOverlay";

/**
 * CameraViewport - Live webcam preview with capture controls.
 * Live view is CSS mirrored (scaleX(-1)) per PRD §2.1.
 * Captures are non-mirrored (natural orientation).
 * Media stream cleanup on unmount per Rules.md §1.2.
 */
export default function CameraViewport() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    selectedFrame,
    capturedPhotos,
    isCameraActive,
    isCountingDown,
    showFlash,
    cameraError,
    setCameraActive,
    setCameraError,
    addCapturedPhoto,
    selectFrame,
    setStep,
    setCountingDown,
    setCountdownValue,
    setShowFlash,
  } = usePhotoboothStore();

  // Auto-select default frame if none selected
  useEffect(() => {
    if (!selectedFrame) {
      selectFrame(frameConfigs[0]);
    }
  }, [selectedFrame, selectFrame]);

  const requiredPhotos = selectedFrame?.slots.length ?? 4;
  const photosRemaining = requiredPhotos - capturedPhotos.length;

  // Initialize camera on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!videoRef.current) return;
      try {
        const stream = await startCamera(videoRef.current);
        if (mounted) {
          streamRef.current = stream;
          setCameraActive(true);
          setCameraError(null);
        } else {
          stopCamera(stream);
        }
      } catch (err) {
        if (mounted) {
          setCameraError(
            err instanceof Error ? err.message : "Camera access denied"
          );
        }
      }
    }

    init();

    // Cleanup on unmount (Rules.md §1.2)
    return () => {
      mounted = false;
      stopCamera(streamRef.current);
      streamRef.current = null;
      setCameraActive(false);
    };
  }, [setCameraActive, setCameraError]);

  // Handle shutter with countdown
  const handleShutter = useCallback(async () => {
    if (isCountingDown || !videoRef.current || !isCameraActive) return;

    setCountingDown(true);

    // 3-2-1 countdown (Design.md §2.2)
    for (let i = 3; i >= 1; i--) {
      setCountdownValue(i);
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Flash effect
    setCountingDown(false);
    setShowFlash(true);

    // Capture the frame (non-mirrored per PRD §2.1)
    const photoDataUrl = captureFrame(videoRef.current);
    addCapturedPhoto(photoDataUrl);

    // Flash fades after 300ms (Design.md §2.2)
    setTimeout(() => setShowFlash(false), 300);

    // Read latest state directly from store to avoid stale closure
    const currentPhotos = usePhotoboothStore.getState().capturedPhotos;
    const needed = usePhotoboothStore.getState().selectedFrame?.slots.length ?? 4;

    if (currentPhotos.length >= needed) {
      setTimeout(() => setStep("EDIT"), 600);
    }
  }, [
    isCountingDown,
    isCameraActive,
    setCountingDown,
    setCountdownValue,
    setShowFlash,
    addCapturedPhoto,
    setStep,
  ]);

  return (
    <div className="camera-viewport">
      {/* Header info */}
      <div className="camera-header">
        <div className="camera-header-left">
          <div className="camera-rec-dot" />
          <span className="camera-rec-label">LIVE</span>
        </div>
        <div className="camera-header-right">
          <span className="camera-count-label">
            {capturedPhotos.length} / {requiredPhotos} photos
          </span>
        </div>
      </div>

      {/* Video container */}
      <div className="camera-video-wrapper">
        {cameraError ? (
          <div className="camera-error">
            <div className="camera-error-icon">📷</div>
            <p className="camera-error-title">Camera Access Required</p>
            <p className="camera-error-desc">{cameraError}</p>
            <button
              className="camera-retry-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
        )}

        {/* Countdown overlay */}
        <AnimatePresence mode="wait">
          {isCountingDown && <CountdownOverlay />}
        </AnimatePresence>

        {/* Flash overlay */}
        <AnimatePresence>{showFlash && <FlashOverlay />}</AnimatePresence>
      </div>

      {/* Photo thumbnails */}
      {capturedPhotos.length > 0 && (
        <div className="camera-thumbnails">
          {capturedPhotos.map((photo, i) => (
            <motion.div
              key={i}
              className="camera-thumbnail"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <img src={photo} alt={`Capture ${i + 1}`} />
              <span className="camera-thumbnail-number">{i + 1}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="camera-controls">
        <button
          className="camera-back-btn"
          onClick={() => {
            stopCamera(streamRef.current);
            streamRef.current = null;
            setStep("INIT");
          }}
        >
          ← Back
        </button>

        <motion.button
          className="shutter-btn"
          onClick={handleShutter}
          disabled={isCountingDown || !isCameraActive || photosRemaining <= 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="shutter-btn-inner" />
          <span className="shutter-btn-label">
            {photosRemaining > 0
              ? `Capture (${photosRemaining} left)`
              : "All captured!"}
          </span>
        </motion.button>

        {capturedPhotos.length >= requiredPhotos && (
          <motion.button
            className="camera-next-btn"
            onClick={() => setStep("EDIT")}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Edit →
          </motion.button>
        )}
      </div>
    </div>
  );
}
