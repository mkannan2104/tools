import type { Metadata } from "next";
import { JsonCompareTool } from "@/components/tools/JsonCompareTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-compare")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonComparePage() {
  return (
    <ToolPageShell slug="json-compare">
      <JsonCompareTool />
    </ToolPageShell>
  );
}
