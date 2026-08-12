import type { Metadata } from "next";
import { JsonQueryTool } from "@/components/tools/JsonQueryTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-query")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonQueryPage() {
  return (
    <ToolPageShell slug="json-query">
      <JsonQueryTool />
    </ToolPageShell>
  );
}
