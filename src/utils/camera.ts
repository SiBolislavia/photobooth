/**
 * Camera utility functions.
 * Handles webcam stream acquisition and cleanup per Rules.md §1.2.
 */

/** Start the front-facing camera and return the MediaStream */
export async function startCamera(
  videoElement: HTMLVideoElement
): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = stream;
  await videoElement.play();
  return stream;
}

/** Stop all tracks on a MediaStream (Rules.md §1.2) */
export function stopCamera(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

/**
 * Capture a single non-mirrored frame from the video element.
 *
 * The live preview is CSS mirrored (scaleX(-1)) so the user sees a
 * natural "mirror" feel while posing. The captured photo must be
 * the NON-mirrored orientation so text on clothing remains readable
 * (PRD §2.1, Design.md §3.2).
 *
 * Since the live preview uses CSS scaleX(-1), the captured image
 * needs to be flipped horizontally to match non-mirrored reality.
 * This counteracts both CSS mirror AND any webcam driver mirroring.
 */
export function captureFrame(videoElement: HTMLVideoElement): string {
  const w = videoElement.videoWidth;
  const h = videoElement.videoHeight;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas 2D context");

  // Flip horizontally to produce non-mirrored output.
  // The CSS preview is scaleX(-1), so the raw video data from
  // getUserMedia represents the mirrored-from-preview version.
  // Flipping it here gives us the TRUE non-mirrored image.
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoElement, 0, 0, w, h);

  const dataUrl = canvas.toDataURL("image/png", 1.0);

  // Dispose canvas to prevent memory leak (Rules.md §1.3)
  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
}
