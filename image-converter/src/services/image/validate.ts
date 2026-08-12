import { imageLimits } from "@/config/site";
import type { SelectedImage } from "@/types/tool";

const ALLOWED_MIME = new Set<string>(imageLimits.acceptMimeTypes);
const ALLOWED_EXT = new Set<string>(imageLimits.acceptExtensions);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function isAllowedImageFile(file: File): boolean {
  const mimeOk = file.type ? ALLOWED_MIME.has(file.type.toLowerCase()) : false;
  const name = file.name.toLowerCase();
  const ext = name.includes(".") ? `.${name.split(".").pop()}` : "";
  const extOk = ALLOWED_EXT.has(ext);
  return mimeOk || extOk;
}

export function validateImageFiles(
  incoming: File[],
  alreadySelected: number,
  options?: { maxFiles?: number },
): { accepted: File[]; errors: string[] } {
  const maxFiles = options?.maxFiles ?? imageLimits.maxFiles;
  const errors: string[] = [];
  const accepted: File[] = [];
  let remaining = Math.max(0, maxFiles - alreadySelected);

  if (remaining === 0) {
    errors.push(`You can process up to ${maxFiles} images at a time.`);
    return { accepted, errors };
  }

  for (const file of incoming) {
    if (remaining <= 0) {
      errors.push(`Only ${maxFiles} images are allowed per operation.`);
      break;
    }

    if (!isAllowedImageFile(file)) {
      errors.push(
        `"${file.name}" is not supported. Use JPG, JPEG, PNG, or WebP.`,
      );
      continue;
    }

    if (file.size >= imageLimits.maxFileBytes) {
      errors.push(
        `"${file.name}" is ${formatBytes(file.size)}. Each image must be under 5 MB.`,
      );
      continue;
    }

    accepted.push(file);
    remaining -= 1;
  }

  return { accepted, errors };
}

function loadImageDimensions(
  file: File,
): Promise<{ width: number; height: number; previewUrl: string }> {
  const previewUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        previewUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Could not read "${file.name}".`));
    };
    img.src = previewUrl;
  });
}

export async function filesToSelectedImages(
  files: File[],
): Promise<SelectedImage[]> {
  const results: SelectedImage[] = [];
  for (const file of files) {
    const { width, height, previewUrl } = await loadImageDimensions(file);
    results.push({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || guessMimeFromName(file.name),
      previewUrl,
      width,
      height,
    });
  }
  return results;
}

export function revokeSelectedImages(images: SelectedImage[]): void {
  for (const image of images) {
    URL.revokeObjectURL(image.previewUrl);
  }
}

export function guessMimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function replaceExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base}.${ext}`;
}

export function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
