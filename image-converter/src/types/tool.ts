export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  path: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  primaryAction: string;
  related: string[];
  howTo: string[];
  examples: { input: string; output?: string; label?: string }[];
  faqs: { question: string; answer: string }[];
}

export type OutputImageFormat = "image/jpeg" | "image/png" | "image/webp";

export interface SelectedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width: number;
  height: number;
}

export interface ProcessedImage {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
  width: number;
  height: number;
  originalSize?: number;
}
