import type { ToolDefinition } from "@/types/tool";

export const tools: ToolDefinition[] = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, and WebP images locally.",
    path: "/image-compressor",
    category: "Image",
    seoTitle: "Image Compressor - Compress Images Online Free",
    seoDescription:
      "Compress JPG, PNG, and WebP images directly in your browser. Reduce image file size without uploading your images to a server.",
    primaryAction: "Compress All",
    related: ["image-resizer", "image-converter", "image-metadata-remover"],
    howTo: [
      "Drop or choose up to 5 images (JPG, PNG, or WebP, each under 5 MB).",
      "Adjust the quality slider for each image or use the shared default.",
      "Click Compress All, then download individual results or Download All.",
    ],
    examples: [
      {
        label: "Typical compression",
        input: "photo.jpg · 2.4 MB · Quality 80%",
        output: "photo.jpg · ~650 KB (smaller file, still previewable)",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. Compression runs entirely in your browser. Images stay on your device during normal processing.",
      },
      {
        question: "Which formats are supported?",
        answer:
          "JPG, JPEG, PNG, and WebP. Each file must be under 5 MB, and you can process up to 5 images at once.",
      },
      {
        question: "Does quality apply to PNG?",
        answer:
          "Browsers cannot apply a quality setting when saving PNG. The compressor uses JPG or WebP so your quality slider actually reduces file size. Auto converts PNG sources to JPG (or WebP if smaller).",
      },
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images by width, height, or percentage.",
    path: "/image-resizer",
    category: "Image",
    seoTitle: "Image Resizer - Resize Images Online Free",
    seoDescription:
      "Resize JPG, PNG, and WebP images by width, height, or percentage in your browser. Keep aspect ratio and download locally.",
    primaryAction: "Resize",
    related: ["image-compressor", "image-cropper", "image-converter"],
    howTo: [
      "Upload up to 5 images (JPG, PNG, or WebP, each under 5 MB).",
      "Set width and height, enable Maintain aspect ratio, or choose a percentage.",
      "Pick an output format, click Resize, then download the results.",
    ],
    examples: [
      {
        label: "Scale down",
        input: "Original: 1920 × 1080 → Width 1280 with aspect ratio on",
        output: "Result: 1280 × 720",
      },
    ],
    faqs: [
      {
        question: "Can I resize by percentage?",
        answer:
          "Yes. Choose percentage mode and enter a scale such as 50% to shrink both dimensions together.",
      },
      {
        question: "What output formats are available?",
        answer: "JPG, PNG, and WebP.",
      },
    ],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert between JPG, PNG, and WebP.",
    path: "/image-converter",
    category: "Image",
    seoTitle: "Image Converter - Convert Images Online Free",
    seoDescription:
      "Convert images between JPG, PNG, and WebP directly in your browser. No upload required.",
    primaryAction: "Convert",
    related: ["image-compressor", "image-resizer", "image-metadata-remover"],
    howTo: [
      "Upload up to 5 images in JPG, PNG, or WebP (each under 5 MB).",
      "Choose the output format: JPG, PNG, or WebP.",
      "Click Convert, then download individual files or Download All.",
    ],
    examples: [
      {
        label: "PNG to JPG",
        input: "screenshot.png",
        output: "screenshot.jpg",
      },
    ],
    faqs: [
      {
        question: "Do you support AVIF, TIFF, or HEIC?",
        answer:
          "Not in v1. Only JPG, PNG, and WebP are supported so the tool stays simple and reliable.",
      },
      {
        question: "Is conversion done on a server?",
        answer:
          "No. Conversion uses browser canvas APIs and stays on your device.",
      },
    ],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Crop an image with free or fixed ratios.",
    path: "/image-cropper",
    category: "Image",
    seoTitle: "Image Cropper - Crop Images Online Free",
    seoDescription:
      "Crop JPG, PNG, and WebP images in your browser with free, 1:1, 4:3, or 16:9 ratios. Download the cropped result locally.",
    primaryAction: "Crop",
    related: ["image-resizer", "image-compressor", "image-converter"],
    howTo: [
      "Upload one image (JPG, PNG, or WebP, under 5 MB).",
      "Drag the crop area and optionally lock Free, 1:1, 4:3, or 16:9.",
      "Click Crop, preview the result, then download.",
    ],
    examples: [
      {
        label: "Square crop",
        input: "photo.jpg with 1:1 aspect ratio",
        output: "A square cropped image ready to download",
      },
    ],
    faqs: [
      {
        question: "Can I crop multiple images at once?",
        answer:
          "The cropper focuses on one image at a time so you can position the crop accurately.",
      },
      {
        question: "Is this a full photo editor?",
        answer:
          "No. It is a basic crop tool — drag the crop area, pick a ratio, crop, and download.",
      },
    ],
  },
  {
    slug: "image-metadata-remover",
    name: "Image Metadata Remover",
    description: "Remove common image metadata before sharing.",
    path: "/image-metadata-remover",
    category: "Image",
    seoTitle: "Image Metadata Remover - Strip EXIF Online Free",
    seoDescription:
      "Remove common image metadata locally in your browser before sharing. Process JPG, PNG, and WebP without uploading files.",
    primaryAction: "Remove Metadata",
    related: ["image-compressor", "image-converter", "image-resizer"],
    howTo: [
      "Upload up to 5 images (JPG, PNG, or WebP, each under 5 MB).",
      "Review detected metadata hints when available.",
      "Click Remove Metadata to re-encode a clean copy, then download.",
    ],
    examples: [
      {
        label: "Before sharing",
        input: "photo.jpg with camera, date, and GPS tags",
        output: "A newly generated image without those common metadata fields",
      },
    ],
    faqs: [
      {
        question: "Is every metadata field removed from every format?",
        answer:
          "No. The tool re-encodes images in the browser, which strips common EXIF-style metadata for supported formats. It does not claim to remove every possible metadata field from every container.",
      },
      {
        question: "Do you store my photos?",
        answer:
          "No. Processing runs locally. Images are not uploaded to our servers for normal use of this tool.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.related
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((item): item is ToolDefinition => Boolean(item));
}
