import type { Metadata } from "next";
import { JsonViewerTool } from "@/components/tools/JsonViewerTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-viewer")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonViewerPage() {
  return (
    <ToolPageShell slug="json-viewer">
      <JsonViewerTool />
    </ToolPageShell>
  );
}
