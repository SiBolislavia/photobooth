// Data Schemas & State Specifications (from Schema.md)

/** Defines the spatial positioning and zoom factor of a photo within a slot */
export interface SlotTransform {
  slotId: string;
  photoUri: string; // Base64 or Blob URL of captured photo
  translateX: number; // Horizontal offset in pixels
  translateY: number; // Vertical offset in pixels
  scale: number; // Zoom factor (1.0 <= scale <= 3.0)
  rotation: number; // Rotation in degrees (default 0)
}

/** Defines the boundary and mask of an individual photo slot within a frame */
export interface FrameSlotGeometry {
  id: string;
  x: number; // Top-left X position (percentage)
  y: number; // Top-left Y position (percentage)
  width: number; // Slot width (percentage)
  height: number; // Slot height (percentage)
  borderRadius?: number; // Optional corner rounding
  aspectRatio: number; // e.g., 1.0, 1.333, 1.5
}

/** Defines the properties of a frame variation */
export interface FrameConfig {
  id: string;
  name: string;
  category: "strip" | "grid" | "story" | "square";
  dimensions: {
    width: number; // Full frame width in pixels (e.g., 1200)
    height: number; // Full frame height in pixels (e.g., 1800)
    dpi: number; // Resolution rating (default 300)
  };
  slots: FrameSlotGeometry[];
  overlayImageUrl: string; // Path to transparent PNG overlay
  backgroundColor: string; // Hex color code
}

/** App step enum */
export type AppStep = "INIT" | "CAPTURE" | "EDIT" | "EXPORT";
