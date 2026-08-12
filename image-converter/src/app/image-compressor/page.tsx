import type { Metadata } from "next";
import { ImageCompressorTool } from "@/components/tools/ImageCompressorTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-compressor")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function ImageCompressorPage() {
  return (
    <ToolPageShell slug="image-compressor">
      <ImageCompressorTool />
    </ToolPageShell>
  );
}
