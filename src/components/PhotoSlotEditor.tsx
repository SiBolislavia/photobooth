"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";
import { frameConfigs } from "@/data/frames";
import type { FrameSlotGeometry } from "@/types";

/**
 * PhotoSlotEditor - Interactive drag & zoom per photo slot.
 * Supports pan (drag) and wheel/pinch zoom (Design.md §3).
 * Visual feedback: dashed accent border on active slot.
 * Cursor: grab on hover, grabbing during drag (Design.md §3.1).
 * Wrapped in React.memo for re-render prevention (Rules.md §3).
 */
const PhotoSlotEditor = React.memo(function PhotoSlotEditor() {
  const {
    selectedFrame,
    capturedPhotos,
    transforms,
    updateTransform,
    selectFrame,
    setStep,
  } = usePhotoboothStore();

  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Auto-select default frame if none was chosen
  useEffect(() => {
    if (!selectedFrame) {
      selectFrame(frameConfigs[0]);
    }
  }, [selectedFrame, selectFrame]);

  // While waiting for frame to be set, show loading
  if (!selectedFrame) {
    return (
      <div className="slot-editor">
        <div className="slot-editor-header">
          <h2 className="slot-editor-title">Loading frame...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-editor">
      <div className="slot-editor-header">
        <h2 className="slot-editor-title">Adjust Your Photos</h2>
        <p className="slot-editor-desc">
          Drag to reposition, scroll to zoom each photo
        </p>
      </div>

      {/* Frame switcher */}
      <div className="slot-editor-frames">
        {frameConfigs.map((frame) => (
          <button
            key={frame.id}
            className={`slot-frame-chip ${
              selectedFrame.id === frame.id ? "slot-frame-chip-active" : ""
            }`}
            onClick={() => selectFrame(frame)}
          >
            {frame.name}
          </button>
        ))}
      </div>

      <div
        className="slot-editor-canvas"
        style={{
          backgroundColor: selectedFrame.backgroundColor,
          aspectRatio: `${selectedFrame.dimensions.width} / ${selectedFrame.dimensions.height}`,
        }}
      >
        {selectedFrame.slots.map((slot, index) => (
          <SlotItem
            key={slot.id}
            slot={slot}
            photo={capturedPhotos[index]}
            transform={transforms[slot.id]}
            isActive={activeSlot === slot.id}
            onActivate={() => setActiveSlot(slot.id)}
            onDeactivate={() => setActiveSlot(null)}
            onUpdateTransform={(partial) => updateTransform(slot.id, partial)}
          />
        ))}
      </div>

      <div className="slot-editor-controls">
        <button className="slot-editor-back-btn" onClick={() => setStep("CAPTURE")}>
          ← Retake
        </button>
        <motion.button
          className="slot-editor-next-btn"
          onClick={() => setStep("EXPORT")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Export →
        </motion.button>
      </div>
    </div>
  );
});

export default PhotoSlotEditor;

/** Individual slot with drag and zoom support */
function SlotItem({
  slot,
  photo,
  transform,
  isActive,
  onActivate,
  onDeactivate,
  onUpdateTransform,
}: {
  slot: FrameSlotGeometry;
  photo?: string;
  transform?: { translateX: number; translateY: number; scale: number; rotation: number };
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onUpdateTransform: (t: {
    translateX?: number;
    translateY?: number;
    scale?: number;
  }) => void;
}) {
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const tx = transform?.translateX ?? 0;
  const ty = transform?.translateY ?? 0;
  const sc = transform?.scale ?? 1;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onActivate();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onActivate]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onUpdateTransform({
        translateX: tx + dx,
        translateY: ty + dy,
      });
    },
    [tx, ty, onUpdateTransform]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(1.0, Math.min(3.0, sc + delta));
      onUpdateTransform({ scale: newScale });
      onActivate();
    },
    [sc, onUpdateTransform, onActivate]
  );

  return (
    <div
      className={`slot-item ${isActive ? "slot-item-active" : ""}`}
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${slot.width}%`,
        height: `${slot.height}%`,
        borderRadius: slot.borderRadius ? `${slot.borderRadius}px` : undefined,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        handlePointerUp();
        onDeactivate();
      }}
      onWheel={handleWheel}
    >
      {photo ? (
        <img
          src={photo}
          alt="Captured photo"
          className="slot-photo"
          draggable={false}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
          }}
        />
      ) : (
        <div className="slot-empty">
          <span className="slot-empty-icon">📷</span>
        </div>
      )}
    </div>
  );
}
