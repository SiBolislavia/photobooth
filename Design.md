UI/UX Specifications & Design System1. User Interface Flow & State Transitions [ Landing Screen ]
        |
        v
 [ Camera Viewport ] ---> Live Stream CSS Mirrored (`scaleX(-1)`)
        |
        +---> [ Shutter Trigger ] ---> 3-2-1 Countdown Animation
        |
        v
 [ Un-mirrored Capture Buffer ]
        |
        v
 [ Interactive Slot Editor ] ---> Pan (Drag) & Pinch/Wheel (Zoom)
        |
        v
 [ Frame Picker Drawer ] ---> Framer Motion Smooth Transition
        |
        v
 [ Export / Print Modal ] ---> High-Res PNG / Native Print Layout
2. Motion Design & Framer Motion Specs2.1 Frame Swapping AnimationAnimation Type: Layout Morphing & Spring PhysicsTransition Settings:export const frameTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

export const frameVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.05, y: -10 }
};
2.2 Camera Flash EffectShutter Animation: Full-screen overlay animating opacity from 1 to 0 over 300ms with easeOut timing.3. Interactive Slot UX (Drag & Zoom)3.1 Visual FeedbackHover / Touch Active State: Displays a subtle dashed accent border (2px dashed #3b82f6) around the active photo slot.Pan Controls: Cursor changes to grab on hover and grabbing during mouse drag.Zoom Slider / Gesture: Pinch gesture on touchscreens or scroll wheel on desktop alters the zoom factor in real-time.3.2 Live View vs Final Result DistinctionView PhaseVisual MirroringText / Clothing ReadabilityRendering EngineLive Camera PreviewMirrored (scaleX(-1))Reversed (Natural mirror feel)HTML Video ElementCaptured Slot BufferNon-Mirrored (Original)Legible & CorrectCanvas 2D ContextFinal Export / PrintNon-Mirrored (Original)Legible & CorrectScaled 2D Composition Canvas4. Print Layout Specifications (@media print)To guarantee precise physical prints:@media print {
  body * {
    visibility: hidden;
  }
  #printable-photo-sheet, #printable-photo-sheet * {
    visibility: visible;
  }
  #printable-photo-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 4in;
    height: 6in;
    margin: 0;
    padding: 0;
  }
  @page {
    size: 4in 6in;
    margin: 0;
  }
}
