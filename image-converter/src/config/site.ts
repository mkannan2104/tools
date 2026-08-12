export const siteConfig = {
  name: "Image Tools",
  shortName: "Image Tools",
  version: "1.0.0",
  description:
    "Simple image tools that run in your browser. Compress, resize, convert, crop, and remove metadata locally — no upload, no account.",
  tagline: "Simple image tools that run in your browser.",
  supportingText: "No upload. No account.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imageconverter.cloud",
  year: new Date().getFullYear(),
  developer: "Mugesh Kannan",
  email: "ops.devsupport@gmail.com",
  license: "MIT",
} as const;

/** Global product rules for client-side image processing. */
export const imageLimits = {
  maxFiles: 5,
  /** Strict upper bound: files must be smaller than 5 MB. */
  maxFileBytes: 5 * 1024 * 1024,
  acceptMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ] as const,
  acceptExtensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
  acceptAttribute: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
} as const;
