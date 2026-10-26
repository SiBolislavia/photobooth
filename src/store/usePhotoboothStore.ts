import { create } from "zustand";
import type { SlotTransform, FrameConfig, AppStep } from "@/types";

interface PhotoboothState {
  // Camera State
  isCameraActive: boolean;
  cameraError: string | null;

  // Session State
  currentStep: AppStep;
  capturedPhotos: string[]; // List of un-mirrored captured frame Data URLs

  // Frame & Slot State
  selectedFrame: FrameConfig | null;
  transforms: Record<string, SlotTransform>; // Keyed by slotId

  // Countdown
  isCountingDown: boolean;
  countdownValue: number;

  // Flash
  showFlash: boolean;

  // Actions
  setCameraActive: (active: boolean) => void;
  setCameraError: (error: string | null) => void;
  addCapturedPhoto: (photoDataUrl: string) => void;
  removeCapturedPhoto: (index: number) => void;
  updateTransform: (
    slotId: string,
    transform: Partial<SlotTransform>
  ) => void;
  selectFrame: (frame: FrameConfig) => void;
  setStep: (step: AppStep) => void;
  setCountingDown: (counting: boolean) => void;
  setCountdownValue: (value: number) => void;
  setShowFlash: (show: boolean) => void;
  resetSession: () => void;
}

const initialState = {
  isCameraActive: false,
  cameraError: null,
  currentStep: "INIT" as AppStep,
  capturedPhotos: [],
  selectedFrame: null,
  transforms: {},
  isCountingDown: false,
  countdownValue: 3,
  showFlash: false,
};

export const usePhotoboothStore = create<PhotoboothState>((set) => ({
  ...initialState,

  setCameraActive: (active) => set({ isCameraActive: active }),

  setCameraError: (error) => set({ cameraError: error }),

  addCapturedPhoto: (photoDataUrl) =>
    set((state) => ({
      capturedPhotos: [...state.capturedPhotos, photoDataUrl],
    })),

  removeCapturedPhoto: (index) =>
    set((state) => ({
      capturedPhotos: state.capturedPhotos.filter((_, i) => i !== index),
    })),

  updateTransform: (slotId, transform) =>
    set((state) => ({
      transforms: {
        ...state.transforms,
        [slotId]: {
          ...state.transforms[slotId],
          ...transform,
        },
      },
    })),

  selectFrame: (frame) => set({ selectedFrame: frame }),

  setStep: (step) => set({ currentStep: step }),

  setCountingDown: (counting) => set({ isCountingDown: counting }),

  setCountdownValue: (value) => set({ countdownValue: value }),

  setShowFlash: (show) => set({ showFlash: show }),

  resetSession: () => set({ ...initialState }),
}));
