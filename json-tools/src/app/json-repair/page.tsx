import type { Metadata } from "next";
import { JsonRepairTool } from "@/components/tools/JsonRepairTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-repair")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonRepairPage() {
  return (
    <ToolPageShell slug="json-repair">
      <JsonRepairTool />
    </ToolPageShell>
  );
}
