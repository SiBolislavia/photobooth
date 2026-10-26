Data Schemas & State Specifications

1. TypeScript Interfaces & Data Contracts

1.1 Transform Matrix State

Defines the spatial positioning and zoom factor of a photo within a slot:

export interface SlotTransform {
  slotId: string;
  photoUri: string; // Base64 or Blob URL of captured photo
  translateX: number; // Horizontal offset in pixels
  translateY: number; // Vertical offset in pixels
  scale: number; // Zoom factor (1.0 <= scale <= 3.0)
  rotation: number; // Rotation in degrees (default 0)
}


1.2 Slot Geometry Definition

Defines the boundary and mask of an individual photo slot within a frame:

export interface FrameSlotGeometry {
  id: string;
  x: number; // Top-left X position (percentage or relative units)
  y: number; // Top-left Y position
  width: number; // Slot width
  height: number; // Slot height
  borderRadius?: number; // Optional corner rounding
  aspectRatio: number; // e.g., 1.0, 1.333, 1.5
}


1.3 Frame Configuration Specification

Defines the properties of a frame variation:

export interface FrameConfig {
  id: string;
  name: string;
  category: 'strip' | 'grid' | 'story' | 'square';
  dimensions: {
    width: number; // Full frame width in pixels (e.g., 1200)
    height: number; // Full frame height in pixels (e.g., 1800)
    dpi: number; // Resolution rating (default 300)
  };
  slots: FrameSlotGeometry[];
  overlayImageUrl: string; // Path to transparent PNG overlay
  backgroundColor: string; // Hex color code
}


2. Client Application State (Zustand / React Context Schema)

export interface PhotoboothState {
  // Camera State
  isCameraActive: boolean;
  cameraError: string | null;
  
  // Session State
  currentStep: 'INIT' | 'CAPTURE' | 'EDIT' | 'EXPORT';
  capturedPhotos: string[]; // List of un-mirrored captured frame Data URLs
  
  // Frame & Slot State
  selectedFrame: FrameConfig | null;
  transforms: Record<string, SlotTransform>; // Keyed by slotId
  
  // Actions
  setCameraActive: (active: boolean) => void;
  addCapturedPhoto: (photoDataUrl: string) => void;
  updateTransform: (slotId: string, transform: Partial<SlotTransform>) => void;
  selectFrame: (frame: FrameConfig) => void;
  resetSession: () => void;
}


3. JSON Schema for Dynamic Frame Configurations

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FrameConfig",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "category": { "type": "string", "enum": ["strip", "grid", "story", "square"] },
    "dimensions": {
      "type": "object",
      "properties": {
        "width": { "type": "integer", "minimum": 300 },
        "height": { "type": "integer", "minimum": 300 },
        "dpi": { "type": "integer", "default": 300 }
      },
      "required": ["width", "height"]
    },
    "slots": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "x": { "type": "number" },
          "y": { "type": "number" },
          "width": { "type": "number" },
          "height": { "type": "number" },
          "aspectRatio": { "type": "number" }
        },
        "required": ["id", "x", "y", "width", "height", "aspectRatio"]
      }
    },
    "overlayImageUrl": { "type": "string" },
    "backgroundColor": { "type": "string" }
  },
  "required": ["id", "name", "category", "dimensions", "slots", "overlayImageUrl"]
}
