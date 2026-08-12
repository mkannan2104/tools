import type { Metadata } from "next";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-formatter")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonFormatterPage() {
  return (
    <ToolPageShell slug="json-formatter">
      <JsonFormatterTool />
    </ToolPageShell>
  );
}
