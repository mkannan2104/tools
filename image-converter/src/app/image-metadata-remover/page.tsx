import type { Metadata } from "next";
import { ImageMetadataRemoverTool } from "@/components/tools/ImageMetadataRemoverTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-metadata-remover")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function ImageMetadataRemoverPage() {
  return (
    <ToolPageShell slug="image-metadata-remover">
      <ImageMetadataRemoverTool />
    </ToolPageShell>
  );
}
