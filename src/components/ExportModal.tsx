"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotoboothStore } from "@/store/usePhotoboothStore";
import { compositeFrame, downloadImage, printPhoto } from "@/utils/canvas";

/**
 * ExportModal - Final export screen.
 * Composites the photo frame and provides download (high-res PNG)
 * and native browser print options (PRD §2).
 * Revokes Blob URLs after use (Rules.md §1.3).
 */
export default function ExportModal() {
  const { selectedFrame, capturedPhotos, transforms, setStep, resetSession } =
    usePhotoboothStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = useCallback(async () => {
    if (!selectedFrame) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Revoke previous URL if exists (Rules.md §1.3)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = await compositeFrame(selectedFrame, capturedPhotos, transforms);
      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedFrame, capturedPhotos, transforms, previewUrl]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    downloadImage(
      previewUrl,
      `photobooth-${Date.now()}.png`
    );
    // After download, URL is revoked inside downloadImage
    setPreviewUrl(null);
  }, [previewUrl]);

  const handlePrint = useCallback(() => {
    printPhoto();
  }, []);

  const handleNewSession = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    resetSession();
  }, [previewUrl, resetSession]);

  return (
    <div className="export-modal">
      <motion.div
        className="export-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="export-title">✨ Your Photobooth Result</h2>
        <p className="export-desc">
          Generate, preview, and download your photo
        </p>

        {/* Preview area */}
        <div className="export-preview-area">
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                className="export-preview-img-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Photobooth result"
                  className="export-preview-img"
                />

                {/* Hidden printable sheet (Design.md §4) */}
                <div id="printable-photo-sheet" className="printable-sheet">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Print" className="printable-img" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="export-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="export-placeholder-icon">🖼️</div>
                <p>Click &quot;Generate&quot; to create your photo</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="export-error">{error}</p>}

        {/* Action buttons */}
        <div className="export-actions">
          <button className="export-back-btn" onClick={() => setStep("EDIT")}>
            ← Back to Edit
          </button>

          {!previewUrl ? (
            <motion.button
              className="export-generate-btn"
              onClick={generatePreview}
              disabled={isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? (
                <>
                  <span className="export-spinner" />
                  Generating...
                </>
              ) : (
                "🎨 Generate Preview"
              )}
            </motion.button>
          ) : (
            <>
              <motion.button
                className="export-download-btn"
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⬇️ Download PNG
              </motion.button>
              <motion.button
                className="export-print-btn"
                onClick={handlePrint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🖨️ Print
              </motion.button>
            </>
          )}

          <button className="export-new-btn" onClick={handleNewSession}>
            📸 New Session
          </button>
        </div>
      </motion.div>
    </div>
  );
}
