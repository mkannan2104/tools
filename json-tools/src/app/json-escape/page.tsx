import type { Metadata } from "next";
import { JsonEscapeTool } from "@/components/tools/JsonEscapeTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-escape")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonEscapePage() {
  return (
    <ToolPageShell slug="json-escape">
      <JsonEscapeTool />
    </ToolPageShell>
  );
}
