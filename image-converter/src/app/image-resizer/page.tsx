import type { Metadata } from "next";
import { ImageResizerTool } from "@/components/tools/ImageResizerTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-resizer")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function ImageResizerPage() {
  return (
    <ToolPageShell slug="image-resizer">
      <ImageResizerTool />
    </ToolPageShell>
  );
}
