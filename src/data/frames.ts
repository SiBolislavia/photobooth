import type { FrameConfig } from "@/types";

/**
 * Predefined frame configurations for the photobooth.
 * Categories: strip (vertical photo strip), grid (2x2), story (tall single), square (1:1)
 */
export const frameConfigs: FrameConfig[] = [
  // ── Classic Strip (4 photos vertical) ──
  {
    id: "strip-classic",
    name: "Classic Strip",
    category: "strip",
    dimensions: { width: 600, height: 1800, dpi: 300 },
    slots: [
      { id: "s1", x: 5, y: 2, width: 90, height: 22, borderRadius: 8, aspectRatio: 1.5 },
      { id: "s2", x: 5, y: 26, width: 90, height: 22, borderRadius: 8, aspectRatio: 1.5 },
      { id: "s3", x: 5, y: 50, width: 90, height: 22, borderRadius: 8, aspectRatio: 1.5 },
      { id: "s4", x: 5, y: 74, width: 90, height: 22, borderRadius: 8, aspectRatio: 1.5 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#ffffff",
  },

  // ── Grid 2x2 ──
  {
    id: "grid-2x2",
    name: "Grid 2×2",
    category: "grid",
    dimensions: { width: 1200, height: 1200, dpi: 300 },
    slots: [
      { id: "g1", x: 3, y: 3, width: 45, height: 45, borderRadius: 8, aspectRatio: 1.0 },
      { id: "g2", x: 52, y: 3, width: 45, height: 45, borderRadius: 8, aspectRatio: 1.0 },
      { id: "g3", x: 3, y: 52, width: 45, height: 45, borderRadius: 8, aspectRatio: 1.0 },
      { id: "g4", x: 52, y: 52, width: 45, height: 45, borderRadius: 8, aspectRatio: 1.0 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#1a1a2e",
  },

  // ── Story (3 photos tall) ──
  {
    id: "story-3",
    name: "Story Mode",
    category: "story",
    dimensions: { width: 800, height: 1600, dpi: 300 },
    slots: [
      { id: "st1", x: 4, y: 2, width: 92, height: 30, borderRadius: 12, aspectRatio: 1.5 },
      { id: "st2", x: 4, y: 35, width: 92, height: 30, borderRadius: 12, aspectRatio: 1.5 },
      { id: "st3", x: 4, y: 68, width: 92, height: 30, borderRadius: 12, aspectRatio: 1.5 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#0f0f23",
  },

  // ── Single Square ──
  {
    id: "square-single",
    name: "Single Square",
    category: "square",
    dimensions: { width: 1200, height: 1200, dpi: 300 },
    slots: [
      { id: "sq1", x: 5, y: 5, width: 90, height: 90, borderRadius: 0, aspectRatio: 1.0 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#16213e",
  },

  // ── Fun Strip (3 photos) ──
  {
    id: "strip-fun",
    name: "Fun Strip",
    category: "strip",
    dimensions: { width: 600, height: 1500, dpi: 300 },
    slots: [
      { id: "f1", x: 5, y: 3, width: 90, height: 29, borderRadius: 16, aspectRatio: 1.333 },
      { id: "f2", x: 5, y: 35, width: 90, height: 29, borderRadius: 16, aspectRatio: 1.333 },
      { id: "f3", x: 5, y: 67, width: 90, height: 29, borderRadius: 16, aspectRatio: 1.333 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#e2136e",
  },

  // ── Grid 3x2 ──
  {
    id: "grid-3x2",
    name: "Grid 3×2",
    category: "grid",
    dimensions: { width: 1200, height: 1800, dpi: 300 },
    slots: [
      { id: "gx1", x: 3, y: 2, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
      { id: "gx2", x: 52, y: 2, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
      { id: "gx3", x: 3, y: 35, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
      { id: "gx4", x: 52, y: 35, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
      { id: "gx5", x: 3, y: 68, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
      { id: "gx6", x: 52, y: 68, width: 45, height: 30, borderRadius: 6, aspectRatio: 1.5 },
    ],
    overlayImageUrl: "",
    backgroundColor: "#2d1b69",
  },
];
