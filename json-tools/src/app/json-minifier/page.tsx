import type { Metadata } from "next";
import { JsonMinifierTool } from "@/components/tools/JsonMinifierTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-minifier")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonMinifierPage() {
  return (
    <ToolPageShell slug="json-minifier">
      <JsonMinifierTool />
    </ToolPageShell>
  );
}
