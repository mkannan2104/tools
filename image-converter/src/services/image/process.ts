import type { OutputImageFormat } from "@/types/tool";
import { extensionForMime, replaceExtension } from "@/services/image/validate";

export async function loadBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: OutputImageFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export async function drawFileToCanvas(
  file: File,
  targetWidth?: number,
  targetHeight?: number,
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const bitmap = await loadBitmap(file);
  const width = targetWidth ?? bitmap.width;
  const height = targetHeight ?? bitmap.height;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { canvas, width: canvas.width, height: canvas.height };
}

export async function encodeImage(
  file: File,
  options: {
    mimeType: OutputImageFormat;
    quality?: number;
    width?: number;
    height?: number;
  },
): Promise<{ blob: Blob; width: number; height: number; filename: string }> {
  const { canvas, width, height } = await drawFileToCanvas(
    file,
    options.width,
    options.height,
  );

  // JPEG does not support transparency; paint white background when needed.
  if (options.mimeType === "image/jpeg") {
    const flattened = document.createElement("canvas");
    flattened.width = canvas.width;
    flattened.height = canvas.height;
    const ctx = flattened.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, flattened.width, flattened.height);
    ctx.drawImage(canvas, 0, 0);
    const blob = await canvasToBlob(
      flattened,
      options.mimeType,
      options.quality ?? 0.8,
    );
    return {
      blob,
      width,
      height,
      filename: replaceExtension(file.name, extensionForMime(options.mimeType)),
    };
  }

  const quality =
    options.mimeType === "image/png" ? undefined : (options.quality ?? 0.8);
  const blob = await canvasToBlob(canvas, options.mimeType, quality);
  return {
    blob,
    width,
    height,
    filename: replaceExtension(file.name, extensionForMime(options.mimeType)),
  };
}

export async function cropImage(
  file: File,
  crop: { x: number; y: number; width: number; height: number },
  mimeType: OutputImageFormat = "image/png",
  quality = 0.92,
): Promise<{ blob: Blob; width: number; height: number; filename: string }> {
  const bitmap = await loadBitmap(file);
  const canvas = document.createElement("canvas");
  const width = Math.max(1, Math.round(crop.width));
  const height = Math.max(1, Math.round(crop.height));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(
    bitmap,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height,
  );
  bitmap.close();

  let blob: Blob;
  if (mimeType === "image/jpeg") {
    const flattened = document.createElement("canvas");
    flattened.width = width;
    flattened.height = height;
    const fctx = flattened.getContext("2d");
    if (!fctx) throw new Error("Canvas is not available in this browser.");
    fctx.fillStyle = "#ffffff";
    fctx.fillRect(0, 0, width, height);
    fctx.drawImage(canvas, 0, 0);
    blob = await canvasToBlob(flattened, mimeType, quality);
  } else {
    blob = await canvasToBlob(
      canvas,
      mimeType,
      mimeType === "image/png" ? undefined : quality,
    );
  }

  return {
    blob,
    width,
    height,
    filename: replaceExtension(file.name, extensionForMime(mimeType)),
  };
}

/** Prefer keeping the original format when stripping metadata. */
export function mimeFromFile(file: File): OutputImageFormat {
  const type = file.type.toLowerCase();
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";
  if (type === "image/jpeg" || type === "image/jpg") return "image/jpeg";
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
