/**
 * Canvas utility functions for compositing the final photobooth output.
 * Handles high-res PNG rendering and memory cleanup per Architecture.md & Rules.md §1.3.
 */

import type { FrameConfig, SlotTransform } from "@/types";

/**
 * Compose all captured photos into a single canvas with the selected frame.
 * Returns a Blob URL for download/print. Caller must revoke it after use.
 */
export async function compositeFrame(
  frame: FrameConfig,
  photos: string[],
  transforms: Record<string, SlotTransform>
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = frame.dimensions.width;
  canvas.height = frame.dimensions.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas 2D context");

  // Draw background
  ctx.fillStyle = frame.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each slot
  for (let i = 0; i < frame.slots.length; i++) {
    const slot = frame.slots[i];
    const photoUrl = photos[i];
    if (!photoUrl) continue;

    const transform = transforms[slot.id] || {
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotation: 0,
    };

    // Calculate absolute slot coordinates from percentages
    const slotX = (slot.x / 100) * canvas.width;
    const slotY = (slot.y / 100) * canvas.height;
    const slotW = (slot.width / 100) * canvas.width;
    const slotH = (slot.height / 100) * canvas.height;

    ctx.save();

    // Create clipping region for the slot
    if (slot.borderRadius && slot.borderRadius > 0) {
      roundedRect(ctx, slotX, slotY, slotW, slotH, slot.borderRadius);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(slotX, slotY, slotW, slotH);
      ctx.clip();
    }

    // Load the photo
    const img = await loadImage(photoUrl);

    // Apply transforms (centered in slot)
    const centerX = slotX + slotW / 2;
    const centerY = slotY + slotH / 2;

    ctx.translate(centerX + transform.translateX, centerY + transform.translateY);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale, transform.scale);

    // Draw image centered, covering the slot
    const imgAspect = img.width / img.height;
    const slotAspect = slotW / slotH;
    let drawW: number, drawH: number;

    if (imgAspect > slotAspect) {
      drawH = slotH;
      drawW = slotH * imgAspect;
    } else {
      drawW = slotW;
      drawH = slotW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Cleanup image reference (Rules.md §1.3)
    img.onload = null;
    img.onerror = null;
  }

  // Draw frame overlay if present
  if (frame.overlayImageUrl) {
    try {
      const overlay = await loadImage(frame.overlayImageUrl);
      ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
      overlay.onload = null;
      overlay.onerror = null;
    } catch {
      // Overlay is optional, silently skip if missing
    }
  }

  // Convert to blob URL
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create canvas blob"));
          return;
        }
        const url = URL.createObjectURL(blob);
        // Dispose canvas (Rules.md §1.3)
        canvas.width = 0;
        canvas.height = 0;
        resolve(url);
      },
      "image/png",
      1.0
    );
  });
}

/** Load an image from a URL and return it as an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/** Draw a rounded rectangle path */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Trigger a high-res PNG download */
export function downloadImage(blobUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after download (Rules.md §1.3)
  URL.revokeObjectURL(blobUrl);
}

/** Trigger native browser print for the printable element */
export function printPhoto(): void {
  window.print();
}
