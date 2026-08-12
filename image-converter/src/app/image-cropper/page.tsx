import type { Metadata } from "next";
import { ImageCropperTool } from "@/components/tools/ImageCropperTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-cropper")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function ImageCropperPage() {
  return (
    <ToolPageShell slug="image-cropper">
      <ImageCropperTool />
    </ToolPageShell>
  );
}
