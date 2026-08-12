import type { Metadata } from "next";
import { ImageConverterTool } from "@/components/tools/ImageConverterTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("image-converter")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function ImageConverterPage() {
  return (
    <ToolPageShell slug="image-converter">
      <ImageConverterTool />
    </ToolPageShell>
  );
}
